const express = require('express');
const router = express.Router();
const { 
    getProfile, 
    updateProfile, 
    updatePassword,
    addToFavorites,
    removeFromFavorites,
    getFavorites,
    deleteAccount 
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// @route   GET /api/users/profile
router.get('/profile', getProfile);

// @route   PUT /api/users/profile
router.put('/profile', updateProfile);

// @route   PUT /api/users/password
router.put('/password', updatePassword);

// @route   GET /api/users/favorites
router.get('/favorites', getFavorites);

// @route   POST /api/users/favorites/:recipeId
router.post('/favorites/:recipeId', addToFavorites);

// @route   DELETE /api/users/favorites/:recipeId
router.delete('/favorites/:recipeId', removeFromFavorites);

// @route   DELETE /api/users/profile
router.delete('/profile', deleteAccount);

module.exports = router;
