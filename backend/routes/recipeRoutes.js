const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/recipeController');
const { protect } = require('../middleware/auth');

// Public routes
// @route   GET /api/recipes/cuisines
router.get('/cuisines', getCuisines);

// @route   GET /api/recipes/tags
router.get('/tags', getTags);

// @route   GET /api/recipes/search
router.get('/search', searchRecipes);

// @route   GET /api/recipes/cuisine/:cuisine
router.get('/cuisine/:cuisine', getRecipesByCuisine);

// @route   GET /api/recipes/meal/:mealType
router.get('/meal/:mealType', getRecipesByMealType);

// @route   GET /api/recipes
router.get('/', getRecipes);

// @route   GET /api/recipes/:id
router.get('/:id', getRecipeById);

// Protected routes
// @route   POST /api/recipes
router.post('/', protect, createRecipe);

// @route   PUT /api/recipes/:id
router.put('/:id', protect, updateRecipe);

// @route   DELETE /api/recipes/:id
router.delete('/:id', protect, deleteRecipe);

module.exports = router;
