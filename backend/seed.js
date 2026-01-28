const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Import models
const User = require('./model/User.js');
const Recipe = require('./model/Recipe.js');

// Connect to database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe_db');
        console.log('MongoDB Connected for seeding...');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

// Default user data
const defaultUser = {
    firstName: 'Emily',
    lastName: 'Johnson',
    email: 'emily.johnson@example.com',
    password: 'password123',
    username: 'emilycooks',
    image: 'https://dummyjson.com/icon/emilys/128',
    bio: 'Passionate home cook and food enthusiast. Love exploring cuisines from around the world!',
    role: 'user'
};

// Recipe data (20 recipes across various cuisines)
const recipesData = [
    {
        name: 'Classic Margherita Pizza',
        ingredients: [
            '2 1/4 cups all-purpose flour',
            '1 tsp instant yeast',
            '1 tsp salt',
            '1 tbsp olive oil',
            '3/4 cup warm water',
            '1/2 cup tomato sauce',
            '8 oz fresh mozzarella',
            'Fresh basil leaves',
            'Extra virgin olive oil for drizzling'
        ],
        instructions: [
            'Mix flour, yeast, and salt in a large bowl.',
            'Add olive oil and warm water, mix until dough forms.',
            'Knead for 10 minutes until smooth and elastic.',
            'Let dough rise for 1 hour in a covered bowl.',
            'Preheat oven to 475°F (245°C) with pizza stone.',
            'Roll out dough on floured surface to 12-inch circle.',
            'Spread tomato sauce evenly, leaving 1-inch border.',
            'Top with torn mozzarella pieces.',
            'Bake for 12-15 minutes until crust is golden.',
            'Top with fresh basil and drizzle with olive oil.'
        ],
        prepTimeMinutes: 20,
        cookTimeMinutes: 75,
        servings: 4,
        difficulty: 'Medium',
        cuisine: 'Italian',
        caloriesPerServing: 285,
        tags: ['pizza', 'italian', 'vegetarian', 'classic'],
        image: 'https://cdn.dummyjson.com/recipe-images/1.webp',
        rating: 4.8,
        reviewCount: 124,
        mealType: ['Lunch', 'Dinner']
    },
    {
        name: 'Chicken Tikka Masala',
        ingredients: [
            '1.5 lbs boneless chicken thighs',
            '1 cup plain yogurt',
            '2 tbsp garam masala',
            '1 tbsp turmeric',
            '1 tbsp cumin',
            '1 tbsp paprika',
            '4 cloves garlic, minced',
            '2 inch ginger, grated',
            '1 can (14 oz) tomato sauce',
            '1 cup heavy cream',
            '1 large onion, diced',
            'Fresh cilantro for garnish',
            'Salt to taste'
        ],
        instructions: [
            'Marinate chicken in yogurt, half the spices, garlic, and ginger for 2 hours.',
            'Grill or broil chicken until charred, about 8 minutes per side.',
            'Cut chicken into bite-sized pieces.',
            'Sauté onion in butter until golden, about 10 minutes.',
            'Add remaining spices and cook for 1 minute.',
            'Pour in tomato sauce and simmer for 15 minutes.',
            'Stir in heavy cream and bring to gentle simmer.',
            'Add chicken pieces and cook for 10 more minutes.',
            'Season with salt and garnish with cilantro.',
            'Serve hot with basmati rice or naan bread.'
        ],
        prepTimeMinutes: 30,
        cookTimeMinutes: 45,
        servings: 6,
        difficulty: 'Medium',
        cuisine: 'Indian',
        caloriesPerServing: 420,
        tags: ['indian', 'chicken', 'curry', 'spicy'],
        image: 'https://cdn.dummyjson.com/recipe-images/2.webp',
        rating: 4.9,
        reviewCount: 256,
        mealType: ['Dinner']
    },
    {
        name: 'Classic Beef Tacos',
        ingredients: [
            '1 lb ground beef',
            '1 packet taco seasoning',
            '8 hard taco shells',
            '1 cup shredded lettuce',
            '1 cup diced tomatoes',
            '1 cup shredded cheddar cheese',
            '1/2 cup sour cream',
            '1/4 cup fresh salsa',
            'Fresh cilantro',
            'Lime wedges'
        ],
        instructions: [
            'Brown ground beef in a skillet over medium-high heat.',
            'Drain excess fat from the pan.',
            'Add taco seasoning and 1/2 cup water.',
            'Simmer for 5 minutes until sauce thickens.',
            'Warm taco shells according to package directions.',
            'Fill each shell with seasoned beef.',
            'Top with lettuce, tomatoes, and cheese.',
            'Add sour cream and salsa as desired.',
            'Garnish with cilantro and serve with lime wedges.'
        ],
        prepTimeMinutes: 10,
        cookTimeMinutes: 15,
        servings: 4,
        difficulty: 'Easy',
        cuisine: 'Mexican',
        caloriesPerServing: 380,
        tags: ['mexican', 'beef', 'tacos', 'quick'],
        image: 'https://cdn.dummyjson.com/recipe-images/3.webp',
        rating: 4.6,
        reviewCount: 189,
        mealType: ['Lunch', 'Dinner']
    },
    {
        name: 'Pad Thai',
        ingredients: [
            '8 oz rice noodles',
            '2 tbsp vegetable oil',
            '3 cloves garlic, minced',
            '2 eggs, beaten',
            '1/2 lb shrimp, peeled',
            '3 tbsp fish sauce',
            '2 tbsp tamarind paste',
            '1 tbsp sugar',
            '1 cup bean sprouts',
            '3 green onions, chopped',
            '1/4 cup crushed peanuts',
            'Lime wedges',
            'Red pepper flakes'
        ],
        instructions: [
            'Soak rice noodles in warm water for 30 minutes, then drain.',
            'Mix fish sauce, tamarind paste, and sugar in a small bowl.',
            'Heat oil in a wok over high heat.',
            'Add garlic and cook for 30 seconds.',
            'Add shrimp and cook until pink, about 2 minutes.',
            'Push shrimp aside and scramble eggs in the wok.',
            'Add noodles and sauce mixture, toss to combine.',
            'Cook for 2-3 minutes until noodles are tender.',
            'Add bean sprouts and green onions, toss briefly.',
            'Serve topped with peanuts, lime wedges, and pepper flakes.'
        ],
        prepTimeMinutes: 35,
        cookTimeMinutes: 15,
        servings: 4,
        difficulty: 'Medium',
        cuisine: 'Thai',
        caloriesPerServing: 445,
        tags: ['thai', 'noodles', 'shrimp', 'stir-fry'],
        image: 'https://cdn.dummyjson.com/recipe-images/4.webp',
        rating: 4.7,
        reviewCount: 203,
        mealType: ['Lunch', 'Dinner']
    },
    {
        name: 'Japanese Miso Soup',
        ingredients: [
            '4 cups dashi stock',
            '3 tbsp white miso paste',
            '1/2 block firm tofu, cubed',
            '2 green onions, sliced',
            '1 sheet nori, cut into strips',
            '1/4 cup wakame seaweed',
            'Optional: sliced mushrooms'
        ],
        instructions: [
            'Rehydrate wakame in warm water for 5 minutes.',
            'Bring dashi stock to a gentle simmer.',
            'Add tofu cubes and cook for 2 minutes.',
            'Place miso paste in a small bowl.',
            'Add a ladle of hot broth and whisk until smooth.',
            'Remove pot from heat and stir in miso mixture.',
            'Add drained wakame and stir gently.',
            'Ladle into bowls and top with green onions.',
            'Garnish with nori strips and serve immediately.',
            'Note: Never boil miso as it destroys beneficial enzymes.'
        ],
        prepTimeMinutes: 10,
        cookTimeMinutes: 10,
        servings: 4,
        difficulty: 'Easy',
        cuisine: 'Japanese',
        caloriesPerServing: 85,
        tags: ['japanese', 'soup', 'vegetarian', 'healthy'],
        image: 'https://cdn.dummyjson.com/recipe-images/5.webp',
        rating: 4.5,
        reviewCount: 145,
        mealType: ['Breakfast', 'Lunch', 'Dinner']
    },
    {
        name: 'French Croissants',
        ingredients: [
            '4 cups all-purpose flour',
            '1/3 cup sugar',
            '1 tbsp instant yeast',
            '1 1/2 tsp salt',
            '1 1/4 cups cold milk',
            '1 1/2 cups cold unsalted butter',
            '1 egg + 1 tbsp milk for egg wash'
        ],
        instructions: [
            'Mix flour, sugar, yeast, and salt.',
            'Add cold milk and mix until dough forms.',
            'Wrap dough and refrigerate for 1 hour.',
            'Pound butter into 6-inch square between parchment.',
            'Roll dough into rectangle, place butter in center.',
            'Fold dough over butter to enclose completely.',
            'Roll out and fold in thirds (first turn).',
            'Refrigerate 30 minutes, repeat rolling 2 more times.',
            'Roll final dough to 1/4-inch thickness.',
            'Cut triangles and roll from base to tip.',
            'Proof for 2 hours until doubled.',
            'Brush with egg wash and bake at 400°F for 15-18 minutes.'
        ],
        prepTimeMinutes: 60,
        cookTimeMinutes: 18,
        servings: 12,
        difficulty: 'Hard',
        cuisine: 'French',
        caloriesPerServing: 280,
        tags: ['french', 'pastry', 'breakfast', 'baking'],
        image: 'https://cdn.dummyjson.com/recipe-images/6.webp',
        rating: 4.9,
        reviewCount: 312,
        mealType: ['Breakfast', 'Snack']
    },
    {
        name: 'Greek Moussaka',
        ingredients: [
            '2 large eggplants, sliced',
            '1 lb ground lamb',
            '1 onion, diced',
            '3 cloves garlic, minced',
            '1 can crushed tomatoes',
            '1/2 cup red wine',
            '1 tsp cinnamon',
            '1/4 tsp nutmeg',
            '4 tbsp butter',
            '4 tbsp flour',
            '2 cups milk',
            '1 cup feta cheese',
            '2 eggs'
        ],
        instructions: [
            'Salt eggplant slices and let drain for 30 minutes.',
            'Brush with oil and grill until tender.',
            'Brown lamb with onion and garlic.',
            'Add tomatoes, wine, cinnamon, and nutmeg. Simmer 20 minutes.',
            'Make béchamel: melt butter, whisk in flour, add milk gradually.',
            'Cook until thick, remove from heat.',
            'Stir in feta and beaten eggs.',
            'Layer eggplant in baking dish, top with meat sauce.',
            'Repeat layers, ending with eggplant.',
            'Pour béchamel over top.',
            'Bake at 350°F for 45 minutes until golden.'
        ],
        prepTimeMinutes: 45,
        cookTimeMinutes: 65,
        servings: 8,
        difficulty: 'Hard',
        cuisine: 'Greek',
        caloriesPerServing: 385,
        tags: ['greek', 'lamb', 'casserole', 'traditional'],
        image: 'https://cdn.dummyjson.com/recipe-images/7.webp',
        rating: 4.7,
        reviewCount: 178,
        mealType: ['Dinner']
    },
    {
        name: 'Korean Bibimbap',
        ingredients: [
            '2 cups cooked short-grain rice',
            '1/2 lb beef sirloin, sliced thin',
            '2 cups spinach',
            '1 cup bean sprouts',
            '1 carrot, julienned',
            '1 zucchini, julienned',
            '4 shiitake mushrooms, sliced',
            '4 eggs',
            '4 tbsp gochujang',
            '2 tbsp sesame oil',
            '2 tbsp soy sauce',
            'Sesame seeds'
        ],
        instructions: [
            'Marinate beef in soy sauce and sesame oil for 30 minutes.',
            'Blanch spinach, squeeze dry, season with sesame oil.',
            'Blanch bean sprouts, season similarly.',
            'Sauté carrot, zucchini, and mushrooms separately.',
            'Cook marinated beef until done.',
            'Fry eggs sunny-side up.',
            'Divide rice among 4 bowls.',
            'Arrange vegetables and beef in sections on rice.',
            'Top each bowl with a fried egg.',
            'Serve with gochujang and sesame seeds.',
            'Mix everything together before eating.'
        ],
        prepTimeMinutes: 40,
        cookTimeMinutes: 30,
        servings: 4,
        difficulty: 'Medium',
        cuisine: 'Korean',
        caloriesPerServing: 520,
        tags: ['korean', 'rice', 'healthy', 'colorful'],
        image: 'https://cdn.dummyjson.com/recipe-images/8.webp',
        rating: 4.8,
        reviewCount: 234,
        mealType: ['Lunch', 'Dinner']
    },
    {
        name: 'Classic Beef Stroganoff',
        ingredients: [
            '1.5 lbs beef sirloin, sliced',
            '8 oz mushrooms, sliced',
            '1 onion, diced',
            '3 cloves garlic, minced',
            '2 cups beef broth',
            '1 cup sour cream',
            '2 tbsp flour',
            '2 tbsp butter',
            '1 tbsp Worcestershire sauce',
            '1 tbsp Dijon mustard',
            'Fresh parsley',
            'Egg noodles for serving'
        ],
        instructions: [
            'Season beef with salt and pepper.',
            'Sear beef in batches in hot pan, set aside.',
            'Sauté mushrooms until golden, set aside.',
            'Cook onion and garlic in butter until soft.',
            'Sprinkle flour and cook 1 minute.',
            'Add broth, Worcestershire, and mustard.',
            'Simmer until sauce thickens, about 10 minutes.',
            'Return beef and mushrooms to pan.',
            'Remove from heat and stir in sour cream.',
            'Cook egg noodles according to package.',
            'Serve stroganoff over noodles with parsley.'
        ],
        prepTimeMinutes: 20,
        cookTimeMinutes: 30,
        servings: 6,
        difficulty: 'Medium',
        cuisine: 'Russian',
        caloriesPerServing: 465,
        tags: ['russian', 'beef', 'comfort-food', 'creamy'],
        image: 'https://cdn.dummyjson.com/recipe-images/9.webp',
        rating: 4.6,
        reviewCount: 167,
        mealType: ['Dinner']
    },
    {
        name: 'Vietnamese Pho',
        ingredients: [
            '2 lbs beef bones',
            '1 lb beef brisket',
            '1 onion, halved',
            '4 inch ginger, halved',
            '3 star anise',
            '4 cloves',
            '1 cinnamon stick',
            '2 tbsp fish sauce',
            '1 lb rice noodles',
            'Bean sprouts',
            'Fresh herbs (basil, cilantro, mint)',
            'Lime wedges',
            'Hoisin and sriracha sauce'
        ],
        instructions: [
            'Char onion and ginger under broiler until blackened.',
            'Toast spices in dry pan until fragrant.',
            'Cover bones with water, bring to boil, drain and rinse.',
            'Add bones to fresh water with brisket.',
            'Add charred aromatics and spices.',
            'Simmer for 3-4 hours, skimming occasionally.',
            'Remove brisket when tender, slice thin.',
            'Strain broth and season with fish sauce.',
            'Cook rice noodles according to package.',
            'Divide noodles among bowls, top with sliced beef.',
            'Ladle hot broth over top.',
            'Serve with bean sprouts, herbs, lime, and sauces.'
        ],
        prepTimeMinutes: 30,
        cookTimeMinutes: 240,
        servings: 8,
        difficulty: 'Hard',
        cuisine: 'Vietnamese',
        caloriesPerServing: 380,
        tags: ['vietnamese', 'soup', 'beef', 'noodles'],
        image: 'https://cdn.dummyjson.com/recipe-images/10.webp',
        rating: 4.9,
        reviewCount: 289,
        mealType: ['Lunch', 'Dinner']
    },
    {
        name: 'Shakshuka',
        ingredients: [
            '6 large eggs',
            '1 can (28 oz) crushed tomatoes',
            '1 red bell pepper, diced',
            '1 onion, diced',
            '4 cloves garlic, minced',
            '2 tsp cumin',
            '2 tsp paprika',
            '1 tsp cayenne pepper',
            '1/2 cup crumbled feta cheese',
            'Fresh cilantro',
            'Crusty bread for serving',
            '3 tbsp olive oil'
        ],
        instructions: [
            'Heat olive oil in a large skillet over medium heat.',
            'Sauté onion and bell pepper until softened.',
            'Add garlic and cook 1 minute.',
            'Stir in cumin, paprika, and cayenne.',
            'Add crushed tomatoes and simmer 10 minutes.',
            'Make 6 wells in the sauce.',
            'Crack an egg into each well.',
            'Cover and cook until whites are set, 5-8 minutes.',
            'Sprinkle with feta cheese.',
            'Garnish with cilantro.',
            'Serve immediately with crusty bread.'
        ],
        prepTimeMinutes: 15,
        cookTimeMinutes: 25,
        servings: 4,
        difficulty: 'Easy',
        cuisine: 'Middle Eastern',
        caloriesPerServing: 295,
        tags: ['middle-eastern', 'eggs', 'vegetarian', 'breakfast'],
        image: 'https://cdn.dummyjson.com/recipe-images/11.webp',
        rating: 4.7,
        reviewCount: 198,
        mealType: ['Breakfast', 'Lunch']
    },
    {
        name: 'Classic Fish and Chips',
        ingredients: [
            '1.5 lbs cod fillets',
            '4 large russet potatoes',
            '1 1/2 cups all-purpose flour',
            '1 cup cold beer',
            '1 tsp baking powder',
            '1 tsp salt',
            'Vegetable oil for frying',
            'Malt vinegar',
            'Tartar sauce',
            'Lemon wedges',
            'Mushy peas (optional)'
        ],
        instructions: [
            'Cut potatoes into thick chips, soak in cold water 30 minutes.',
            'Drain and dry chips thoroughly.',
            'Heat oil to 325°F, fry chips until pale, about 5 minutes.',
            'Remove and drain, increase oil to 375°F.',
            'Make batter: whisk flour, baking powder, salt, and beer.',
            'Pat fish dry and season with salt.',
            'Dip fish in batter, let excess drip off.',
            'Fry fish until golden and cooked through, 5-7 minutes.',
            'Drain on paper towels.',
            'Fry chips again until golden and crispy, 2-3 minutes.',
            'Serve fish and chips with vinegar, tartar sauce, and lemon.'
        ],
        prepTimeMinutes: 45,
        cookTimeMinutes: 25,
        servings: 4,
        difficulty: 'Medium',
        cuisine: 'British',
        caloriesPerServing: 620,
        tags: ['british', 'fish', 'fried', 'classic'],
        image: 'https://cdn.dummyjson.com/recipe-images/12.webp',
        rating: 4.5,
        reviewCount: 156,
        mealType: ['Lunch', 'Dinner']
    },
    {
        name: 'Chicken Caesar Salad',
        ingredients: [
            '2 chicken breasts',
            '1 large romaine lettuce',
            '1 cup croutons',
            '1/2 cup parmesan cheese, shaved',
            '1/2 cup Caesar dressing',
            '2 tbsp olive oil',
            'Salt and pepper',
            'Lemon wedges'
        ],
        instructions: [
            'Season chicken breasts with salt and pepper.',
            'Heat olive oil in a skillet over medium-high heat.',
            'Cook chicken 6-7 minutes per side until cooked through.',
            'Let chicken rest for 5 minutes, then slice.',
            'Wash and chop romaine lettuce.',
            'Place lettuce in a large bowl.',
            'Add sliced chicken on top.',
            'Drizzle with Caesar dressing.',
            'Top with croutons and shaved parmesan.',
            'Serve with lemon wedges on the side.'
        ],
        prepTimeMinutes: 10,
        cookTimeMinutes: 20,
        servings: 4,
        difficulty: 'Easy',
        cuisine: 'American',
        caloriesPerServing: 385,
        tags: ['american', 'salad', 'chicken', 'healthy'],
        image: 'https://cdn.dummyjson.com/recipe-images/13.webp',
        rating: 4.4,
        reviewCount: 187,
        mealType: ['Lunch', 'Dinner']
    },
    {
        name: 'Spaghetti Carbonara',
        ingredients: [
            '1 lb spaghetti',
            '8 oz guanciale or pancetta',
            '4 large egg yolks',
            '2 whole eggs',
            '1 cup pecorino romano, grated',
            '1/2 cup parmesan, grated',
            'Fresh black pepper',
            'Salt for pasta water'
        ],
        instructions: [
            'Bring large pot of salted water to boil.',
            'Cook spaghetti until al dente, reserve 1 cup pasta water.',
            'Cut guanciale into small cubes.',
            'Cook guanciale in pan until crispy.',
            'Whisk egg yolks, whole eggs, and cheeses in bowl.',
            'Add generous amount of black pepper to egg mixture.',
            'Drain pasta and add to pan with guanciale (heat off).',
            'Working quickly, add egg mixture and toss vigorously.',
            'Add pasta water as needed for creamy consistency.',
            'Serve immediately with extra cheese and pepper.'
        ],
        prepTimeMinutes: 10,
        cookTimeMinutes: 20,
        servings: 4,
        difficulty: 'Medium',
        cuisine: 'Italian',
        caloriesPerServing: 580,
        tags: ['italian', 'pasta', 'classic', 'creamy'],
        image: 'https://cdn.dummyjson.com/recipe-images/14.webp',
        rating: 4.8,
        reviewCount: 276,
        mealType: ['Lunch', 'Dinner']
    },
    {
        name: 'Thai Green Curry',
        ingredients: [
            '1 lb chicken breast, sliced',
            '2 tbsp green curry paste',
            '1 can (14 oz) coconut milk',
            '1 cup bamboo shoots',
            '1 red bell pepper, sliced',
            '1 cup Thai basil',
            '2 tbsp fish sauce',
            '1 tbsp palm sugar',
            '4 kaffir lime leaves',
            '1 cup Thai eggplant',
            'Jasmine rice for serving'
        ],
        instructions: [
            'Scoop cream from top of coconut milk into wok.',
            'Heat over medium-high until oil separates.',
            'Fry curry paste in coconut cream for 2 minutes.',
            'Add chicken and cook until no longer pink.',
            'Pour in remaining coconut milk.',
            'Add bamboo shoots, bell pepper, and eggplant.',
            'Simmer for 10 minutes.',
            'Add fish sauce and palm sugar.',
            'Tear kaffir lime leaves and add to curry.',
            'Stir in Thai basil just before serving.',
            'Serve over jasmine rice.'
        ],
        prepTimeMinutes: 15,
        cookTimeMinutes: 25,
        servings: 4,
        difficulty: 'Easy',
        cuisine: 'Thai',
        caloriesPerServing: 445,
        tags: ['thai', 'curry', 'chicken', 'spicy'],
        image: 'https://cdn.dummyjson.com/recipe-images/15.webp',
        rating: 4.7,
        reviewCount: 212,
        mealType: ['Lunch', 'Dinner']
    },
    {
        name: 'Beef Bulgogi',
        ingredients: [
            '1.5 lbs beef ribeye, thinly sliced',
            '1 Asian pear, grated',
            '4 tbsp soy sauce',
            '2 tbsp sesame oil',
            '2 tbsp brown sugar',
            '4 cloves garlic, minced',
            '1 tbsp ginger, grated',
            '1 onion, sliced',
            '2 green onions, chopped',
            'Sesame seeds',
            'Lettuce leaves for wrapping',
            'Steamed rice'
        ],
        instructions: [
            'Mix pear, soy sauce, sesame oil, sugar, garlic, and ginger.',
            'Add beef slices and marinate for at least 2 hours.',
            'Heat grill pan or skillet over high heat.',
            'Add marinated beef in single layer.',
            'Cook for 2-3 minutes per side until caramelized.',
            'Add onion slices in last minute of cooking.',
            'Transfer to serving plate.',
            'Garnish with green onions and sesame seeds.',
            'Serve with lettuce leaves for wrapping.',
            'Accompany with steamed rice and kimchi.'
        ],
        prepTimeMinutes: 20,
        cookTimeMinutes: 10,
        servings: 4,
        difficulty: 'Easy',
        cuisine: 'Korean',
        caloriesPerServing: 385,
        tags: ['korean', 'beef', 'bbq', 'grilled'],
        image: 'https://cdn.dummyjson.com/recipe-images/16.webp',
        rating: 4.8,
        reviewCount: 198,
        mealType: ['Lunch', 'Dinner']
    },
    {
        name: 'Tiramisu',
        ingredients: [
            '6 egg yolks',
            '3/4 cup sugar',
            '1 1/3 cups mascarpone cheese',
            '2 cups heavy cream',
            '2 cups espresso, cooled',
            '3 tbsp coffee liqueur',
            '24 ladyfinger cookies',
            'Cocoa powder for dusting',
            '1 tsp vanilla extract'
        ],
        instructions: [
            'Whisk egg yolks and sugar until thick and pale.',
            'Add mascarpone and vanilla, mix until smooth.',
            'In separate bowl, whip heavy cream to stiff peaks.',
            'Gently fold whipped cream into mascarpone mixture.',
            'Combine espresso and coffee liqueur.',
            'Quickly dip ladyfingers in coffee mixture.',
            'Arrange single layer in 9x13 dish.',
            'Spread half the cream mixture over ladyfingers.',
            'Repeat with another layer of dipped ladyfingers.',
            'Top with remaining cream mixture.',
            'Cover and refrigerate for at least 4 hours or overnight.',
            'Dust generously with cocoa powder before serving.'
        ],
        prepTimeMinutes: 30,
        cookTimeMinutes: 0,
        servings: 10,
        difficulty: 'Medium',
        cuisine: 'Italian',
        caloriesPerServing: 420,
        tags: ['italian', 'dessert', 'coffee', 'no-bake'],
        image: 'https://cdn.dummyjson.com/recipe-images/17.webp',
        rating: 4.9,
        reviewCount: 345,
        mealType: ['Dessert']
    },
    {
        name: 'Falafel with Tahini Sauce',
        ingredients: [
            '2 cups dried chickpeas (soaked overnight)',
            '1 onion, quartered',
            '4 cloves garlic',
            '1 cup fresh parsley',
            '1/2 cup fresh cilantro',
            '2 tsp cumin',
            '1 tsp coriander',
            '1/4 tsp cayenne',
            '1 tsp salt',
            '1/2 tsp baking powder',
            '2 tbsp flour',
            'Oil for frying',
            '1/2 cup tahini',
            '1/4 cup lemon juice',
            'Pita bread'
        ],
        instructions: [
            'Drain soaked chickpeas and pat dry.',
            'Process chickpeas, onion, garlic, herbs, and spices.',
            'Pulse until mixture holds together but has texture.',
            'Transfer to bowl, add baking powder and flour.',
            'Refrigerate mixture for 1 hour.',
            'Make tahini sauce: whisk tahini, lemon juice, and water.',
            'Form chickpea mixture into small patties or balls.',
            'Heat oil to 350°F for deep frying.',
            'Fry falafel until deep golden brown, 3-4 minutes.',
            'Drain on paper towels.',
            'Serve in pita with tahini, vegetables, and pickles.'
        ],
        prepTimeMinutes: 75,
        cookTimeMinutes: 20,
        servings: 6,
        difficulty: 'Medium',
        cuisine: 'Middle Eastern',
        caloriesPerServing: 320,
        tags: ['middle-eastern', 'vegetarian', 'vegan', 'falafel'],
        image: 'https://cdn.dummyjson.com/recipe-images/18.webp',
        rating: 4.6,
        reviewCount: 167,
        mealType: ['Lunch', 'Dinner', 'Snack']
    },
    {
        name: 'Chocolate Lava Cakes',
        ingredients: [
            '4 oz bittersweet chocolate',
            '1/2 cup unsalted butter',
            '1 cup powdered sugar',
            '2 whole eggs',
            '2 egg yolks',
            '6 tbsp all-purpose flour',
            '1 tsp vanilla extract',
            'Pinch of salt',
            'Butter for greasing ramekins',
            'Cocoa powder for dusting',
            'Vanilla ice cream for serving'
        ],
        instructions: [
            'Preheat oven to 425°F.',
            'Grease 4 ramekins with butter and dust with cocoa.',
            'Melt chocolate and butter together in microwave.',
            'Stir until smooth and let cool slightly.',
            'Whisk in powdered sugar until smooth.',
            'Add eggs and yolks, whisk vigorously.',
            'Fold in flour, vanilla, and salt.',
            'Divide batter among prepared ramekins.',
            'Bake for 12-14 minutes until edges are set.',
            'Center should still jiggle slightly.',
            'Let cool 1 minute, then invert onto plates.',
            'Serve immediately with vanilla ice cream.'
        ],
        prepTimeMinutes: 15,
        cookTimeMinutes: 14,
        servings: 4,
        difficulty: 'Medium',
        cuisine: 'French',
        caloriesPerServing: 485,
        tags: ['french', 'dessert', 'chocolate', 'baking'],
        image: 'https://cdn.dummyjson.com/recipe-images/19.webp',
        rating: 4.9,
        reviewCount: 278,
        mealType: ['Dessert']
    },
    {
        name: 'Butter Chicken',
        ingredients: [
            '1.5 lbs chicken thighs, cubed',
            '1 cup plain yogurt',
            '2 tbsp garam masala',
            '1 tbsp turmeric',
            '4 tbsp butter',
            '1 onion, diced',
            '4 cloves garlic, minced',
            '2 inch ginger, grated',
            '1 can (14 oz) tomato puree',
            '1 cup heavy cream',
            '2 tbsp honey',
            '1 tsp kashmiri chili powder',
            'Fresh cilantro',
            'Naan bread'
        ],
        instructions: [
            'Marinate chicken in yogurt, half the garam masala, and turmeric.',
            'Refrigerate for at least 2 hours.',
            'Grill or pan-fry chicken until cooked through.',
            'Melt butter in large pan over medium heat.',
            'Sauté onion until golden, about 10 minutes.',
            'Add garlic, ginger, and remaining spices. Cook 2 minutes.',
            'Pour in tomato puree and simmer 15 minutes.',
            'Blend sauce until smooth, return to pan.',
            'Add heavy cream and honey, stir well.',
            'Add cooked chicken and simmer 10 minutes.',
            'Garnish with cilantro and serve with naan.'
        ],
        prepTimeMinutes: 25,
        cookTimeMinutes: 40,
        servings: 6,
        difficulty: 'Medium',
        cuisine: 'Indian',
        caloriesPerServing: 465,
        tags: ['indian', 'chicken', 'curry', 'creamy'],
        image: 'https://cdn.dummyjson.com/recipe-images/20.webp',
        rating: 4.9,
        reviewCount: 312,
        mealType: ['Dinner']
    }
];

// Seed function
const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing data
        console.log('Clearing existing data...');
        await User.deleteMany({});
        await Recipe.deleteMany({});

        // Create default user
        console.log('Creating default user...');
        const user = await User.create(defaultUser);
        console.log(`Default user created: ${user.email}`);

        // Add userId to all recipes
        const recipesWithUser = recipesData.map(recipe => ({
            ...recipe,
            userId: user._id
        }));

        // Create recipes
        console.log('Creating recipes...');
        const recipes = await Recipe.insertMany(recipesWithUser);
        console.log(`${recipes.length} recipes created`);

        // Update user's created recipes
        await User.findByIdAndUpdate(user._id, {
            createdRecipes: recipes.map(r => r._id)
        });

        console.log('\n========================================');
        console.log('Database seeded successfully!');
        console.log('========================================');
        console.log('\nDefault User Credentials:');
        console.log(`Email: ${defaultUser.email}`);
        console.log(`Password: ${defaultUser.password}`);
        console.log(`Username: ${defaultUser.username}`);
        console.log('========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

// Run seed
seedDatabase();
