const mongoose = require('mongoose');

const mealPlanItemSchema = new mongoose.Schema({
    recipe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recipe',
        required: true
    },
    mealType: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
        required: true
    },
    servings: {
        type: Number,
        default: 1,
        min: 1
    }
});

const mealPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Meal plan name is required'],
        trim: true,
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    meals: [{
        day: {
            type: Date,
            required: true
        },
        items: [mealPlanItemSchema]
    }],
    notes: {
        type: String,
        maxlength: [500, 'Notes cannot exceed 500 characters']
    },
    isActive: {
        type: Boolean,
        default: true
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
mealPlanSchema.pre('save', function() {
    this.updatedAt = Date.now();
});

module.exports = mongoose.model('MealPlan', mealPlanSchema);
