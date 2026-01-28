# Recipe Book Backend API Documentation

## Overview

This is a RESTful API for a recipe book application. The API provides endpoints for user authentication, recipe management, favorites, and meal planning.

**Base URL:** `http://localhost:5001/api`

**Default Test User:**
- Email: `emily.johnson@example.com`
- Password: `password123`
- Username: `emilycooks`

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)

### Installation

1. Navigate to the backend directory:
```bash
cd recipe-book-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (copy from `.env.example`):
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/recipe_db
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
```

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the server:
```bash
npm run dev
```

---

## Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Rate Limiting

- **General API:** 100 requests per 15 minutes
- **Authentication:** 10 requests per hour
- **Meal Plan Creation:** 10 requests per minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Time when limit resets

---

## API Endpoints

### Health Check

#### Check API Status
```
GET /health
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Recipe Book API is running",
    "timestamp": "2026-01-27T10:00:00.000Z"
}
```

---

## Authentication Endpoints

### Register User

```
POST /api/auth/register
```

**Request Body:**
```json
{
    "firstName": "Emily",
    "lastName": "Johnson",
    "email": "emily@example.com",
    "password": "password123",
    "username": "emilycooks",
    "bio": "Passionate home cook and food enthusiast"
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {
        "id": "507f1f77bcf86cd799439011",
        "firstName": "Emily",
        "lastName": "Johnson",
        "email": "emily@example.com",
        "username": "emilycooks",
        "image": "https://dummyjson.com/icon/emilys/128",
        "bio": "Passionate home cook and food enthusiast",
        "role": "user",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

**Error Responses:**
- `400 Bad Request`: User with this email already exists
- `400 Bad Request`: Username is already taken
- `400 Bad Request`: Validation error (missing required fields)
- `500 Internal Server Error`: Server error

---

### Login User

```
POST /api/auth/login
```

**Request Body:**
```json
{
    "email": "emily.johnson@example.com",
    "password": "password123"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "id": "507f1f77bcf86cd799439011",
        "firstName": "Emily",
        "lastName": "Johnson",
        "email": "emily.johnson@example.com",
        "username": "emilycooks",
        "image": "https://dummyjson.com/icon/emilys/128",
        "bio": "Passionate home cook and food enthusiast",
        "role": "user",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

**Error Responses:**
- `400 Bad Request`: Please provide email and password
- `401 Unauthorized`: Invalid credentials
- `500 Internal Server Error`: Server error

---

### Get Current User

```
GET /api/auth/me
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "507f1f77bcf86cd799439011",
        "firstName": "Emily",
        "lastName": "Johnson",
        "email": "emily.johnson@example.com",
        "username": "emilycooks",
        "image": "https://dummyjson.com/icon/emilys/128",
        "bio": "Passionate home cook and food enthusiast",
        "favoriteRecipes": [
            {
                "_id": "507f1f77bcf86cd799439022",
                "name": "Spaghetti Carbonara",
                "image": "https://...",
                "rating": 4.8
            }
        ],
        "createdRecipes": [...],
        "role": "user",
        "createdAt": "2026-01-27T10:00:00.000Z",
        "updatedAt": "2026-01-27T10:00:00.000Z"
    }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authorized, no token provided
- `401 Unauthorized`: Not authorized, token invalid or expired

---

### Refresh Token

```
POST /api/auth/refresh
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Token refreshed successfully",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
}
```

---

## User Profile Endpoints

### Get User Profile

```
GET /api/users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "id": "507f1f77bcf86cd799439011",
        "firstName": "Emily",
        "lastName": "Johnson",
        "email": "emily.johnson@example.com",
        "username": "emilycooks",
        "image": "https://dummyjson.com/icon/emilys/128",
        "bio": "Passionate home cook and food enthusiast",
        "favoriteRecipes": [...],
        "createdRecipes": [...],
        "role": "user",
        "createdAt": "2026-01-27T10:00:00.000Z",
        "updatedAt": "2026-01-27T10:00:00.000Z"
    }
}
```

---

### Update User Profile

```
PUT /api/users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "firstName": "Emily",
    "lastName": "Smith",
    "username": "emilychef",
    "image": "https://example.com/new-avatar.jpg",
    "bio": "Professional chef and cookbook author"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Profile updated successfully",
    "data": {
        "id": "507f1f77bcf86cd799439011",
        "firstName": "Emily",
        "lastName": "Smith",
        "email": "emily.johnson@example.com",
        "username": "emilychef",
        "image": "https://example.com/new-avatar.jpg",
        "bio": "Professional chef and cookbook author",
        "role": "user",
        "createdAt": "2026-01-27T10:00:00.000Z",
        "updatedAt": "2026-01-27T12:00:00.000Z"
    }
}
```

**Error Responses:**
- `400 Bad Request`: Username is already taken

---

### Update Password

```
PUT /api/users/password
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "currentPassword": "password123",
    "newPassword": "newpassword456"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Password updated successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Please provide current password and new password
- `400 Bad Request`: New password must be at least 6 characters
- `401 Unauthorized`: Current password is incorrect

---

### Get Favorite Recipes

```
GET /api/users/favorites
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "recipes": [
            {
                "_id": "507f1f77bcf86cd799439022",
                "name": "Spaghetti Carbonara",
                "image": "https://cdn.dummyjson.com/recipe-images/14.webp",
                "rating": 4.8,
                "cuisine": "Italian"
            }
        ],
        "pagination": {
            "total": 5,
            "page": 1,
            "limit": 10,
            "totalPages": 1,
            "hasNextPage": false,
            "hasPrevPage": false
        }
    }
}
```

---

### Add to Favorites

```
POST /api/users/favorites/:recipeId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Recipe added to favorites",
    "data": {
        "favoriteRecipes": ["507f1f77bcf86cd799439022", "507f1f77bcf86cd799439023"]
    }
}
```

**Error Responses:**
- `400 Bad Request`: Recipe already in favorites
- `404 Not Found`: Recipe not found

---

### Remove from Favorites

```
DELETE /api/users/favorites/:recipeId
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Recipe removed from favorites",
    "data": {
        "favoriteRecipes": ["507f1f77bcf86cd799439023"]
    }
}
```

**Error Responses:**
- `400 Bad Request`: Recipe not in favorites

---

### Delete Account

```
DELETE /api/users/profile
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Account deleted successfully"
}
```

---

## Recipe Endpoints

### Get All Recipes

```
GET /api/recipes
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| cuisine | string | Filter by cuisine |
| difficulty | string | Filter by difficulty (Easy, Medium, Hard) |
| mealType | string | Filter by meal type |
| tag | string | Filter by tag |
| maxPrepTime | number | Max prep time in minutes |
| maxCookTime | number | Max cook time in minutes |
| maxTotalTime | number | Max total time (prep + cook) |
| maxCalories | number | Max calories per serving |
| search | string | Search in name/tags |
| sortBy | string | Sort field (e.g., "rating", "-prepTimeMinutes") |

**Example:**
```
GET /api/recipes?page=1&limit=10&cuisine=Italian&difficulty=Easy&maxTotalTime=30&sortBy=-rating
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "recipes": [
            {
                "_id": "507f1f77bcf86cd799439022",
                "name": "Classic Margherita Pizza",
                "ingredients": [
                    "2 1/4 cups all-purpose flour",
                    "1 tsp instant yeast",
                    "..."
                ],
                "instructions": [
                    "Mix flour, yeast, and salt in a large bowl.",
                    "..."
                ],
                "prepTimeMinutes": 20,
                "cookTimeMinutes": 75,
                "servings": 4,
                "difficulty": "Medium",
                "cuisine": "Italian",
                "caloriesPerServing": 285,
                "tags": ["pizza", "italian", "vegetarian", "classic"],
                "image": "https://cdn.dummyjson.com/recipe-images/1.webp",
                "rating": 4.8,
                "reviewCount": 124,
                "mealType": ["Lunch", "Dinner"],
                "userId": {
                    "_id": "507f1f77bcf86cd799439011",
                    "firstName": "Emily",
                    "lastName": "Johnson",
                    "username": "emilycooks"
                },
                "createdAt": "2026-01-01T10:00:00.000Z"
            }
        ],
        "pagination": {
            "total": 20,
            "page": 1,
            "limit": 10,
            "totalPages": 2,
            "hasNextPage": true,
            "hasPrevPage": false
        }
    }
}
```

---

### Get Single Recipe

```
GET /api/recipes/:id
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "_id": "507f1f77bcf86cd799439022",
        "name": "Classic Margherita Pizza",
        "ingredients": [
            "2 1/4 cups all-purpose flour",
            "1 tsp instant yeast",
            "1 tsp salt",
            "1 tbsp olive oil",
            "3/4 cup warm water",
            "1/2 cup tomato sauce",
            "8 oz fresh mozzarella",
            "Fresh basil leaves",
            "Extra virgin olive oil for drizzling"
        ],
        "instructions": [
            "Mix flour, yeast, and salt in a large bowl.",
            "Add olive oil and warm water, mix until dough forms.",
            "Knead for 10 minutes until smooth and elastic.",
            "Let dough rise for 1 hour in a covered bowl.",
            "Preheat oven to 475°F (245°C) with pizza stone.",
            "Roll out dough on floured surface to 12-inch circle.",
            "Spread tomato sauce evenly, leaving 1-inch border.",
            "Top with torn mozzarella pieces.",
            "Bake for 12-15 minutes until crust is golden.",
            "Top with fresh basil and drizzle with olive oil."
        ],
        "prepTimeMinutes": 20,
        "cookTimeMinutes": 75,
        "servings": 4,
        "difficulty": "Medium",
        "cuisine": "Italian",
        "caloriesPerServing": 285,
        "tags": ["pizza", "italian", "vegetarian", "classic"],
        "image": "https://cdn.dummyjson.com/recipe-images/1.webp",
        "rating": 4.8,
        "reviewCount": 124,
        "mealType": ["Lunch", "Dinner"],
        "userId": {
            "_id": "507f1f77bcf86cd799439011",
            "firstName": "Emily",
            "lastName": "Johnson",
            "username": "emilycooks",
            "image": "https://dummyjson.com/icon/emilys/128"
        },
        "createdAt": "2026-01-01T10:00:00.000Z",
        "updatedAt": "2026-01-27T10:00:00.000Z"
    }
}
```

**Error Responses:**
- `404 Not Found`: Recipe not found

---

### Get Recipes by Cuisine

```
GET /api/recipes/cuisine/:cuisine
```

**Example:**
```
GET /api/recipes/cuisine/Italian?page=1&limit=10
```

**Response:** Same format as Get All Recipes

---

### Get Recipes by Meal Type

```
GET /api/recipes/meal/:mealType
```

**Meal Types:** `Breakfast`, `Lunch`, `Dinner`, `Snack`, `Dessert`, `Appetizer`, `Beverage`, `Side Dish`

**Example:**
```
GET /api/recipes/meal/Dinner?page=1&limit=10
```

**Response:** Same format as Get All Recipes

---

### Search Recipes

```
GET /api/recipes/search?q=<query>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| q | string | Search query (required) |
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |

**Example:**
```
GET /api/recipes/search?q=chicken&page=1&limit=10
```

**Response:** Same format as Get All Recipes

**Error Responses:**
- `400 Bad Request`: Search query is required

---

### Get All Cuisines

```
GET /api/recipes/cuisines
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": [
        "Italian",
        "Indian",
        "Mexican",
        "Thai",
        "Japanese",
        "French",
        "Greek",
        "Korean",
        "Russian",
        "Vietnamese",
        "Middle Eastern",
        "British",
        "American"
    ]
}
```

---

### Get All Tags

```
GET /api/recipes/tags
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": [
        "pizza",
        "italian",
        "vegetarian",
        "chicken",
        "curry",
        "spicy",
        "healthy",
        "quick",
        "dessert",
        "breakfast",
        "comfort-food",
        "grilled",
        "baking"
    ]
}
```

---

### Create Recipe (Authenticated)

```
POST /api/recipes
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "name": "Homemade Pasta",
    "ingredients": [
        "2 cups all-purpose flour",
        "3 large eggs",
        "1/2 tsp salt",
        "1 tbsp olive oil"
    ],
    "instructions": [
        "Mound flour on work surface, make a well in center.",
        "Add eggs, salt, and oil to well.",
        "Gradually incorporate flour into eggs.",
        "Knead for 10 minutes until smooth.",
        "Rest dough for 30 minutes.",
        "Roll out and cut into desired shapes.",
        "Cook in boiling salted water for 2-3 minutes."
    ],
    "prepTimeMinutes": 45,
    "cookTimeMinutes": 5,
    "servings": 4,
    "difficulty": "Medium",
    "cuisine": "Italian",
    "caloriesPerServing": 250,
    "tags": ["pasta", "italian", "homemade", "vegetarian"],
    "image": "https://example.com/pasta.jpg",
    "mealType": ["Lunch", "Dinner"]
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "message": "Recipe created successfully",
    "data": {
        "_id": "507f1f77bcf86cd799439099",
        "name": "Homemade Pasta",
        "ingredients": [...],
        "instructions": [...],
        "prepTimeMinutes": 45,
        "cookTimeMinutes": 5,
        "servings": 4,
        "difficulty": "Medium",
        "cuisine": "Italian",
        "caloriesPerServing": 250,
        "tags": ["pasta", "italian", "homemade", "vegetarian"],
        "image": "https://example.com/pasta.jpg",
        "rating": 0,
        "reviewCount": 0,
        "mealType": ["Lunch", "Dinner"],
        "userId": "507f1f77bcf86cd799439011",
        "createdAt": "2026-01-27T10:00:00.000Z"
    }
}
```

---

### Update Recipe (Owner Only)

```
PUT /api/recipes/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "name": "Updated Homemade Pasta",
    "servings": 6,
    "caloriesPerServing": 220
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Recipe updated successfully",
    "data": {
        "_id": "507f1f77bcf86cd799439099",
        "name": "Updated Homemade Pasta",
        "servings": 6,
        "caloriesPerServing": 220,
        "updatedAt": "2026-01-27T12:00:00.000Z"
    }
}
```

**Error Responses:**
- `403 Forbidden`: Not authorized to update this recipe
- `404 Not Found`: Recipe not found

---

### Delete Recipe (Owner Only)

```
DELETE /api/recipes/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Recipe deleted successfully"
}
```

**Error Responses:**
- `403 Forbidden`: Not authorized to delete this recipe
- `404 Not Found`: Recipe not found

---

## Meal Plan Endpoints

### Create Meal Plan

```
POST /api/meal-plans
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "name": "Weekly Healthy Eating",
    "startDate": "2026-01-27",
    "endDate": "2026-02-02",
    "meals": [
        {
            "day": "2026-01-27",
            "items": [
                {
                    "recipe": "507f1f77bcf86cd799439022",
                    "mealType": "Breakfast",
                    "servings": 2
                },
                {
                    "recipe": "507f1f77bcf86cd799439023",
                    "mealType": "Lunch",
                    "servings": 1
                }
            ]
        }
    ],
    "notes": "Focus on high protein meals"
}
```

**Response (201 Created):**
```json
{
    "success": true,
    "message": "Meal plan created successfully",
    "data": {
        "_id": "507f1f77bcf86cd799439088",
        "user": "507f1f77bcf86cd799439011",
        "name": "Weekly Healthy Eating",
        "startDate": "2026-01-27T00:00:00.000Z",
        "endDate": "2026-02-02T00:00:00.000Z",
        "meals": [...],
        "notes": "Focus on high protein meals",
        "isActive": true,
        "createdAt": "2026-01-27T10:00:00.000Z"
    }
}
```

**Error Responses:**
- `400 Bad Request`: Start date must be before end date
- `404 Not Found`: Recipe not found

---

### Get My Meal Plans

```
GET /api/meal-plans
```

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| page | number | Page number (default: 1) |
| limit | number | Items per page (default: 10) |
| active | boolean | Filter by active status |

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "mealPlans": [
            {
                "_id": "507f1f77bcf86cd799439088",
                "name": "Weekly Healthy Eating",
                "startDate": "2026-01-27T00:00:00.000Z",
                "endDate": "2026-02-02T00:00:00.000Z",
                "meals": [
                    {
                        "day": "2026-01-27T00:00:00.000Z",
                        "items": [
                            {
                                "recipe": {
                                    "_id": "507f1f77bcf86cd799439022",
                                    "name": "Shakshuka",
                                    "image": "https://...",
                                    "prepTimeMinutes": 15,
                                    "cookTimeMinutes": 25
                                },
                                "mealType": "Breakfast",
                                "servings": 2
                            }
                        ]
                    }
                ],
                "isActive": true
            }
        ],
        "pagination": {
            "total": 3,
            "page": 1,
            "limit": 10,
            "totalPages": 1,
            "hasNextPage": false,
            "hasPrevPage": false
        }
    }
}
```

---

### Get Meal Plan by ID

```
GET /api/meal-plans/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "success": true,
    "data": {
        "_id": "507f1f77bcf86cd799439088",
        "user": "507f1f77bcf86cd799439011",
        "name": "Weekly Healthy Eating",
        "startDate": "2026-01-27T00:00:00.000Z",
        "endDate": "2026-02-02T00:00:00.000Z",
        "meals": [
            {
                "day": "2026-01-27T00:00:00.000Z",
                "items": [
                    {
                        "recipe": {
                            "_id": "507f1f77bcf86cd799439022",
                            "name": "Shakshuka",
                            "image": "https://...",
                            "ingredients": [...],
                            "prepTimeMinutes": 15,
                            "cookTimeMinutes": 25,
                            "servings": 4,
                            "caloriesPerServing": 295
                        },
                        "mealType": "Breakfast",
                        "servings": 2
                    }
                ]
            }
        ],
        "notes": "Focus on high protein meals",
        "isActive": true,
        "createdAt": "2026-01-27T10:00:00.000Z",
        "updatedAt": "2026-01-27T10:00:00.000Z"
    }
}
```

**Error Responses:**
- `403 Forbidden`: Not authorized to access this meal plan
- `404 Not Found`: Meal plan not found

---

### Update Meal Plan

```
PUT /api/meal-plans/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "name": "Updated Weekly Plan",
    "notes": "Modified for lower carbs",
    "isActive": true
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Meal plan updated successfully",
    "data": {
        "_id": "507f1f77bcf86cd799439088",
        "name": "Updated Weekly Plan",
        "notes": "Modified for lower carbs",
        "updatedAt": "2026-01-27T12:00:00.000Z"
    }
}
```

**Error Responses:**
- `403 Forbidden`: Not authorized to update this meal plan
- `404 Not Found`: Meal plan not found

---

### Delete Meal Plan

```
DELETE /api/meal-plans/:id
```

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Meal plan deleted successfully"
}
```

**Error Responses:**
- `403 Forbidden`: Not authorized to delete this meal plan
- `404 Not Found`: Meal plan not found

---

### Add Recipe to Meal Plan

```
POST /api/meal-plans/:id/recipes
```

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
    "day": "2026-01-28",
    "recipeId": "507f1f77bcf86cd799439025",
    "mealType": "Dinner",
    "servings": 2
}
```

**Meal Types:** `Breakfast`, `Lunch`, `Dinner`, `Snack`

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Recipe added to meal plan",
    "data": {
        "_id": "507f1f77bcf86cd799439088",
        "meals": [...]
    }
}
```

**Error Responses:**
- `403 Forbidden`: Not authorized to modify this meal plan
- `404 Not Found`: Recipe not found
- `404 Not Found`: Meal plan not found

---

## Error Response Format

All error responses follow this format:

```json
{
    "success": false,
    "message": "Error description here"
}
```

---

## Status Codes Summary

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input or validation error |
| 401 | Unauthorized - Authentication required or invalid token |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

---

## Data Models

### User
```json
{
    "firstName": "string (required)",
    "lastName": "string (required)",
    "email": "string (required, unique)",
    "password": "string (required, min 6 chars)",
    "username": "string (required, unique, 3-30 chars)",
    "image": "string (URL)",
    "bio": "string (max 500 chars)",
    "favoriteRecipes": "array of Recipe ObjectIds",
    "createdRecipes": "array of Recipe ObjectIds",
    "role": "user | admin"
}
```

### Recipe
```json
{
    "name": "string (required, max 200 chars)",
    "ingredients": "array of strings (required)",
    "instructions": "array of strings (required)",
    "prepTimeMinutes": "number (required)",
    "cookTimeMinutes": "number (required)",
    "servings": "number (required, min 1)",
    "difficulty": "Easy | Medium | Hard (required)",
    "cuisine": "string (required)",
    "caloriesPerServing": "number",
    "tags": "array of strings",
    "image": "string (URL, required)",
    "rating": "number (0-5)",
    "reviewCount": "number",
    "mealType": "array of: Breakfast | Lunch | Dinner | Snack | Dessert | Appetizer | Beverage | Side Dish",
    "userId": "ObjectId (required)"
}
```

### Meal Plan
```json
{
    "user": "ObjectId (required)",
    "name": "string (required, max 100 chars)",
    "startDate": "date (required)",
    "endDate": "date (required)",
    "meals": [
        {
            "day": "date (required)",
            "items": [
                {
                    "recipe": "ObjectId (required)",
                    "mealType": "Breakfast | Lunch | Dinner | Snack (required)",
                    "servings": "number (default: 1)"
                }
            ]
        }
    ],
    "notes": "string (max 500 chars)",
    "isActive": "boolean (default: true)"
}
```

---

## Sample Cuisines Available

The seeded database includes recipes from the following cuisines:
- Italian
- Indian  
- Mexican
- Thai
- Japanese
- French
- Greek
- Korean
- Russian
- Vietnamese
- Middle Eastern
- British
- American

---

## Sample Recipes Included

The seeded database includes 20 diverse recipes including:
1. Classic Margherita Pizza (Italian)
2. Chicken Tikka Masala (Indian)
3. Classic Beef Tacos (Mexican)
4. Pad Thai (Thai)
5. Japanese Miso Soup (Japanese)
6. French Croissants (French)
7. Greek Moussaka (Greek)
8. Korean Bibimbap (Korean)
9. Classic Beef Stroganoff (Russian)
10. Vietnamese Pho (Vietnamese)
11. Shakshuka (Middle Eastern)
12. Classic Fish and Chips (British)
13. Chicken Caesar Salad (American)
14. Spaghetti Carbonara (Italian)
15. Thai Green Curry (Thai)
16. Beef Bulgogi (Korean)
17. Tiramisu (Italian)
18. Falafel with Tahini Sauce (Middle Eastern)
19. Chocolate Lava Cakes (French)
20. Butter Chicken (Indian)
