const Recipe = require('../model/Recipe');
const User = require('../model/User');

// @desc    Get all recipes with pagination, filtering, and sorting
// @route   GET /api/recipes
// @access  Public
const getRecipes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build query
        let query = {};

        // Filter by cuisine
        if (req.query.cuisine) {
            query.cuisine = { $regex: req.query.cuisine, $options: 'i' };
        }

        // Filter by difficulty
        if (req.query.difficulty) {
            query.difficulty = req.query.difficulty;
        }

        // Filter by meal type
        if (req.query.mealType) {
            query.mealType = { $in: [req.query.mealType] };
        }

        // Filter by tags
        if (req.query.tag) {
            query.tags = { $in: [new RegExp(req.query.tag, 'i')] };
        }

        // Filter by max prep time
        if (req.query.maxPrepTime) {
            query.prepTimeMinutes = { $lte: parseInt(req.query.maxPrepTime) };
        }

        // Filter by max cook time
        if (req.query.maxCookTime) {
            query.cookTimeMinutes = { $lte: parseInt(req.query.maxCookTime) };
        }

        // Filter by max total time (prep + cook)
        if (req.query.maxTotalTime) {
            query.$expr = {
                $lte: [{ $add: ['$prepTimeMinutes', '$cookTimeMinutes'] }, parseInt(req.query.maxTotalTime)]
            };
        }

        // Filter by max calories
        if (req.query.maxCalories) {
            query.caloriesPerServing = { $lte: parseInt(req.query.maxCalories) };
        }

        // Search by name
        if (req.query.search) {
            query.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { tags: { $in: [new RegExp(req.query.search, 'i')] } }
            ];
        }

        // Sort options
        let sortOption = {};
        if (req.query.sortBy) {
            const sortFields = req.query.sortBy.split(',');
            sortFields.forEach(field => {
                const sortOrder = field.startsWith('-') ? -1 : 1;
                const fieldName = field.replace('-', '');
                sortOption[fieldName] = sortOrder;
            });
        } else {
            sortOption = { createdAt: -1 };
        }

        // Execute query
        const recipes = await Recipe.find(query)
            .sort(sortOption)
            .skip(skip)
            .limit(limit)
            .populate('userId', 'firstName lastName username');

        const total = await Recipe.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                recipes: recipes,
                pagination: {
                    total: total,
                    page: page,
                    limit: limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page < Math.ceil(total / limit),
                    hasPrevPage: page > 1
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get single recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id)
            .populate('userId', 'firstName lastName username image');

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe not found'
            });
        }

        res.status(200).json({
            success: true,
            data: recipe
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Recipe not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get recipes by cuisine
// @route   GET /api/recipes/cuisine/:cuisine
// @access  Public
const getRecipesByCuisine = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const recipes = await Recipe.find({
            cuisine: { $regex: req.params.cuisine, $options: 'i' }
        })
            .sort({ rating: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'firstName lastName username');

        const total = await Recipe.countDocuments({
            cuisine: { $regex: req.params.cuisine, $options: 'i' }
        });

        res.status(200).json({
            success: true,
            data: {
                recipes: recipes,
                pagination: {
                    total: total,
                    page: page,
                    limit: limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page < Math.ceil(total / limit),
                    hasPrevPage: page > 1
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get recipes by meal type
// @route   GET /api/recipes/meal/:mealType
// @access  Public
const getRecipesByMealType = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const recipes = await Recipe.find({
            mealType: { $in: [req.params.mealType] }
        })
            .sort({ rating: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'firstName lastName username');

        const total = await Recipe.countDocuments({
            mealType: { $in: [req.params.mealType] }
        });

        res.status(200).json({
            success: true,
            data: {
                recipes: recipes,
                pagination: {
                    total: total,
                    page: page,
                    limit: limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page < Math.ceil(total / limit),
                    hasPrevPage: page > 1
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Search recipes
// @route   GET /api/recipes/search
// @access  Public
const searchRecipes = async (req, res) => {
    try {
        const { q } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const recipes = await Recipe.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { cuisine: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } },
                { ingredients: { $in: [new RegExp(q, 'i')] } }
            ]
        })
            .sort({ rating: -1 })
            .skip(skip)
            .limit(limit)
            .populate('userId', 'firstName lastName username');

        const total = await Recipe.countDocuments({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { cuisine: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } },
                { ingredients: { $in: [new RegExp(q, 'i')] } }
            ]
        });

        res.status(200).json({
            success: true,
            data: {
                recipes: recipes,
                pagination: {
                    total: total,
                    page: page,
                    limit: limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page < Math.ceil(total / limit),
                    hasPrevPage: page > 1
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get all cuisines
// @route   GET /api/recipes/cuisines
// @access  Public
const getCuisines = async (req, res) => {
    try {
        const cuisines = await Recipe.distinct('cuisine');

        res.status(200).json({
            success: true,
            data: cuisines
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get all tags
// @route   GET /api/recipes/tags
// @access  Public
const getTags = async (req, res) => {
    try {
        const recipes = await Recipe.find({}, 'tags');
        const allTags = [...new Set(recipes.flatMap(r => r.tags))];

        res.status(200).json({
            success: true,
            data: allTags
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Create a recipe (authenticated)
// @route   POST /api/recipes
// @access  Private
const createRecipe = async (req, res) => {
    try {
        const recipeData = {
            ...req.body,
            userId: req.user.id
        };

        const recipe = await Recipe.create(recipeData);

        // Add to user's created recipes
        await User.findByIdAndUpdate(req.user.id, {
            $push: { createdRecipes: recipe._id }
        });

        res.status(201).json({
            success: true,
            message: 'Recipe created successfully',
            data: recipe
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update a recipe
// @route   PUT /api/recipes/:id
// @access  Private (owner only)
const updateRecipe = async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe not found'
            });
        }

        // Check ownership
        if (recipe.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this recipe'
            });
        }

        recipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Recipe updated successfully',
            data: recipe
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete a recipe
// @route   DELETE /api/recipes/:id
// @access  Private (owner only)
const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);

        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe not found'
            });
        }

        // Check ownership
        if (recipe.userId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this recipe'
            });
        }

        await Recipe.findByIdAndDelete(req.params.id);

        // Remove from user's created recipes
        await User.findByIdAndUpdate(req.user.id, {
            $pull: { createdRecipes: req.params.id }
        });

        res.status(200).json({
            success: true,
            message: 'Recipe deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

module.exports = {
    getRecipes,
    getRecipeById,
    getRecipesByCuisine,
    getRecipesByMealType,
    searchRecipes,
    getCuisines,
    getTags,
    createRecipe,
    updateRecipe,
    deleteRecipe
};
