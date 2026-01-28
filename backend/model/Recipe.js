const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Recipe name is required'],
        trim: true,
        maxlength: [200, 'Name cannot exceed 200 characters']
    },
    ingredients: [{
        type: String,
        required: true
    }],
    instructions: [{
        type: String,
        required: true
    }],
    prepTimeMinutes: {
        type: Number,
        required: [true, 'Prep time is required'],
        min: [0, 'Prep time cannot be negative']
    },
    cookTimeMinutes: {
        type: Number,
        required: [true, 'Cook time is required'],
        min: [0, 'Cook time cannot be negative']
    },
    servings: {
        type: Number,
        required: [true, 'Servings is required'],
        min: [1, 'Servings must be at least 1']
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: [true, 'Difficulty is required']
    },
    cuisine: {
        type: String,
        required: [true, 'Cuisine is required'],
        trim: true
    },
    caloriesPerServing: {
        type: Number,
        min: [0, 'Calories cannot be negative']
    },
    tags: [{
        type: String,
        trim: true
    }],
    image: {
        type: String,
        required: [true, 'Image is required']
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot exceed 5']
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    mealType: [{
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert', 'Appetizer', 'Beverage', 'Side Dish']
    }],
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field
recipeSchema.pre('save', function() {
    this.updatedAt = Date.now();
});

// Create text index for search
recipeSchema.index({ name: 'text', cuisine: 'text', tags: 'text' });

module.exports = mongoose.model('Recipe', recipeSchema);
