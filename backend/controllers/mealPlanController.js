const MealPlan = require('../model/MealPlan');
const Recipe = require('../model/Recipe');

// @desc    Create a meal plan
// @route   POST /api/meal-plans
// @access  Private
const createMealPlan = async (req, res) => {
    try {
        const { name, startDate, endDate, meals, notes } = req.body;

        // Validate dates
        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({
                success: false,
                message: 'Start date must be before end date'
            });
        }

        // Validate recipe IDs if meals are provided
        if (meals && meals.length > 0) {
            for (const day of meals) {
                for (const item of day.items) {
                    const recipe = await Recipe.findById(item.recipe);
                    if (!recipe) {
                        return res.status(404).json({
                            success: false,
                            message: `Recipe not found: ${item.recipe}`
                        });
                    }
                }
            }
        }

        const mealPlan = await MealPlan.create({
            user: req.user.id,
            name,
            startDate,
            endDate,
            meals,
            notes
        });

        res.status(201).json({
            success: true,
            message: 'Meal plan created successfully',
            data: mealPlan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Get all meal plans for user
// @route   GET /api/meal-plans
// @access  Private
const getMyMealPlans = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        let query = { user: req.user.id };

        // Filter by active status
        if (req.query.active === 'true') {
            query.isActive = true;
        }

        const mealPlans = await MealPlan.find(query)
            .sort({ startDate: -1 })
            .skip(skip)
            .limit(limit)
            .populate('meals.items.recipe', 'name image prepTimeMinutes cookTimeMinutes');

        const total = await MealPlan.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                mealPlans: mealPlans,
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

// @desc    Get single meal plan
// @route   GET /api/meal-plans/:id
// @access  Private
const getMealPlanById = async (req, res) => {
    try {
        const mealPlan = await MealPlan.findById(req.params.id)
            .populate('meals.items.recipe', 'name image ingredients prepTimeMinutes cookTimeMinutes servings caloriesPerServing');

        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: 'Meal plan not found'
            });
        }

        // Check ownership
        if (mealPlan.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this meal plan'
            });
        }

        res.status(200).json({
            success: true,
            data: mealPlan
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(404).json({
                success: false,
                message: 'Meal plan not found'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Update meal plan
// @route   PUT /api/meal-plans/:id
// @access  Private
const updateMealPlan = async (req, res) => {
    try {
        let mealPlan = await MealPlan.findById(req.params.id);

        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: 'Meal plan not found'
            });
        }

        // Check ownership
        if (mealPlan.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this meal plan'
            });
        }

        mealPlan = await MealPlan.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('meals.items.recipe', 'name image');

        res.status(200).json({
            success: true,
            message: 'Meal plan updated successfully',
            data: mealPlan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Delete meal plan
// @route   DELETE /api/meal-plans/:id
// @access  Private
const deleteMealPlan = async (req, res) => {
    try {
        const mealPlan = await MealPlan.findById(req.params.id);

        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: 'Meal plan not found'
            });
        }

        // Check ownership
        if (mealPlan.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this meal plan'
            });
        }

        await MealPlan.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Meal plan deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Add recipe to meal plan
// @route   POST /api/meal-plans/:id/recipes
// @access  Private
const addRecipeToMealPlan = async (req, res) => {
    try {
        const { day, recipeId, mealType, servings } = req.body;

        const mealPlan = await MealPlan.findById(req.params.id);

        if (!mealPlan) {
            return res.status(404).json({
                success: false,
                message: 'Meal plan not found'
            });
        }

        // Check ownership
        if (mealPlan.user.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to modify this meal plan'
            });
        }

        // Validate recipe
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({
                success: false,
                message: 'Recipe not found'
            });
        }

        // Find or create the day entry
        const dayDate = new Date(day);
        let dayEntry = mealPlan.meals.find(
            m => new Date(m.day).toDateString() === dayDate.toDateString()
        );

        if (!dayEntry) {
            mealPlan.meals.push({
                day: dayDate,
                items: []
            });
            dayEntry = mealPlan.meals[mealPlan.meals.length - 1];
        }

        dayEntry.items.push({
            recipe: recipeId,
            mealType,
            servings: servings || 1
        });

        await mealPlan.save();

        res.status(200).json({
            success: true,
            message: 'Recipe added to meal plan',
            data: mealPlan
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
    createMealPlan,
    getMyMealPlans,
    getMealPlanById,
    updateMealPlan,
    deleteMealPlan,
    addRecipeToMealPlan
};
