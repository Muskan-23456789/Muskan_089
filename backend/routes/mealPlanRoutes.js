const express = require('express');
const router = express.Router();
const {
    createMealPlan,
    getMyMealPlans,
    getMealPlanById,
    updateMealPlan,
    deleteMealPlan,
    addRecipeToMealPlan
} = require('../controllers/mealPlanController');
const { protect } = require('../middleware/auth');
const { strictLimiter } = require('../middleware/rateLimiter');

// All routes require authentication
router.use(protect);

// @route   POST /api/meal-plans
router.post('/', strictLimiter, createMealPlan);

// @route   GET /api/meal-plans
router.get('/', getMyMealPlans);

// @route   GET /api/meal-plans/:id
router.get('/:id', getMealPlanById);

// @route   PUT /api/meal-plans/:id
router.put('/:id', updateMealPlan);

// @route   DELETE /api/meal-plans/:id
router.delete('/:id', deleteMealPlan);

// @route   POST /api/meal-plans/:id/recipes
router.post('/:id/recipes', addRecipeToMealPlan);

module.exports = router;
