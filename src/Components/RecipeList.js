import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import RecipeCard from './RecipeCard';
import '../Styles/RecipeList.css';

function RecipeList() {
  const initialRecipes = [
    {
      id: 1,
      name: 'Spaghetti Bolognese',
      description: 'A classic Italian pasta dish with rich meat sauce.',
      image: '/api/placeholder/200/200',
      category: 'Italian',
      rating: 4.5,
      difficulty: 'Medium',
      prepTime: '45 mins',
      ingredients: ['pasta', 'ground beef', 'tomato sauce', 'onions', 'garlic'],
      servings: 4,
      calories: 650
    },
    {
      id: 2,
      name: 'Chicken Curry',
      description: 'A flavorful curry with tender chicken pieces.',
      image: '/api/placeholder/200/200',
      category: 'Indian',
      rating: 4.8,
      difficulty: 'Hard',
      prepTime: '60 mins',
      ingredients: ['chicken', 'curry powder', 'coconut milk', 'onions', 'spices'],
      servings: 6,
      calories: 450
    },
    {
      id: 3,
      name: 'Vegetable Stir-Fry',
      description: 'A quick and healthy stir-fry with fresh vegetables.',
      image: '/api/placeholder/200/200',
      category: 'Asian',
      rating: 4.2,
      difficulty: 'Easy',
      prepTime: '20 mins',
      ingredients: ['mixed vegetables', 'soy sauce', 'garlic', 'ginger', 'oil'],
      servings: 2,
      calories: 300
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [recipes, setRecipes] = useState(initialRecipes);
  const [filterSettings, setFilterSettings] = useState({
    difficulty: 'All',
    minRating: 0,
    maxPrepTime: 120,
    maxCalories: 1000,
    dietary: 'All'
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Search functionality
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters(term, filterCategory, filterSettings);
  };

  // Category filter
  const handleCategoryFilter = (category) => {
    setFilterCategory(category);
    applyFilters(searchTerm, category, filterSettings);
  };

  // Advanced filtering
  const handleFilterChange = (key, value) => {
    const newSettings = { ...filterSettings, [key]: value };
    setFilterSettings(newSettings);
    applyFilters(searchTerm, filterCategory, newSettings);
  };

  // Combined filter application
  const applyFilters = (search, category, filters) => {
    let filteredRecipes = initialRecipes;

    // Search term filter
    if (search) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.name.toLowerCase().includes(search) ||
        recipe.description.toLowerCase().includes(search) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(search))
      );
    }

    // Category filter
    if (category !== 'All') {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.category === category);
    }

    // Advanced filters
    if (filters.difficulty !== 'All') {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.difficulty === filters.difficulty);
    }

    filteredRecipes = filteredRecipes.filter(recipe => {
      const prepTimeMinutes = parseInt(recipe.prepTime);
      return recipe.rating >= filters.minRating &&
             prepTimeMinutes <= filters.maxPrepTime &&
             recipe.calories <= filters.maxCalories;
    });

    setRecipes(filteredRecipes);
  };

  // Favorite toggle
  const toggleFavorite = (recipeId) => {
    setFavorites(prevFavorites =>
      prevFavorites.includes(recipeId)
        ? prevFavorites.filter(id => id !== recipeId)
        : [...prevFavorites, recipeId]
    );
  };

  // Sort recipes
  const handleSortRecipes = (sortType) => {
    const sortedRecipes = [...recipes].sort((a, b) => {
      switch(sortType) {
        case 'rating':
          return b.rating - a.rating;
        case 'difficulty':
          const difficultyOrder = {'Easy': 1, 'Medium': 2, 'Hard': 3};
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        case 'prepTime':
          return parseInt(a.prepTime) - parseInt(b.prepTime);
        case 'calories':
          return a.calories - b.calories;
        default:
          return 0;
      }
    });
    setRecipes(sortedRecipes);
  };

  // Recipe statistics
  const recipeStats = useMemo(() => {
    return {
      totalRecipes: recipes.length,
      averageRating: (recipes.reduce((acc, recipe) => acc + recipe.rating, 0) / recipes.length).toFixed(1),
      averagePrepTime: Math.round(recipes.reduce((acc, recipe) => acc + parseInt(recipe.prepTime), 0) / recipes.length),
      favoriteCount: favorites.length
    };
  }, [recipes, favorites]);

  return (
    <div className="recipe-list-container">
      <Card className="p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Recipe Collection</h2>
          <div className="text-sm">
            <span className="mr-4">Total Recipes: {recipeStats.totalRecipes}</span>
            <span className="mr-4">Avg Rating: {recipeStats.averageRating}⭐</span>
            <span className="mr-4">Avg Prep Time: {recipeStats.averagePrepTime}mins</span>
            <span>Favorites: {recipeStats.favoriteCount}❤️</span>
          </div>
        </div>

        <div className="recipe-controls space-y-4">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border rounded"
          />
          
          <div className="flex space-x-2">
            {['All', 'Italian', 'Indian', 'Asian'].map(category => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-4 py-2 rounded ${
                  filterCategory === category 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <select 
              onChange={(e) => handleSortRecipes(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Sort By</option>
              <option value="rating">Rating</option>
              <option value="difficulty">Difficulty</option>
              <option value="prepTime">Prep Time</option>
              <option value="calories">Calories</option>
            </select>

            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              {showAdvancedFilters ? 'Hide Filters' : 'Advanced Filters'}
            </button>
          </div>

          {showAdvancedFilters && (
            <div className="space-y-4 p-4 bg-gray-50 rounded">
              <div>
                <label className="block mb-2">Difficulty</label>
                <select 
                  value={filterSettings.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="p-2 border rounded"
                >
                  {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2">Minimum Rating: {filterSettings.minRating}</label>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={filterSettings.minRating}
                  onChange={(e) => handleFilterChange('minRating', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-2">Max Prep Time: {filterSettings.maxPrepTime} mins</label>
                <input
                  type="range"
                  min="0"
                  max="120"
                  step="15"
                  value={filterSettings.maxPrepTime}
                  onChange={(e) => handleFilterChange('maxPrepTime', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-2">Max Calories: {filterSettings.maxCalories}</label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={filterSettings.maxCalories}
                  onChange={(e) => handleFilterChange('maxCalories', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onFavorite={() => toggleFavorite(recipe.id)}
            isFavorite={favorites.includes(recipe.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default RecipeList;