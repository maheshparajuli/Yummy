import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import RecipeCard from './RecipeCard';

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
      prepTime: '45',
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
      prepTime: '60',
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
      prepTime: '20',
      ingredients: ['mixed vegetables', 'soy sauce', 'garlic', 'ginger', 'oil'],
      servings: 2,
      calories: 300
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [recipes, setRecipes] = useState(initialRecipes);
  const [filterSettings, setFilterSettings] = useState({
    difficulty: 'All',
    minRating: 0,
    maxPrepTime: 120,
    maxCalories: 1000
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    applyFilters(term, filterCategory, filterSettings);
  };

  const handleCategoryFilter = (category) => {
    setFilterCategory(category);
    applyFilters(searchTerm, category, filterSettings);
  };

  const handleFilterChange = (key, value) => {
    const newSettings = { ...filterSettings, [key]: value };
    setFilterSettings(newSettings);
    applyFilters(searchTerm, filterCategory, newSettings);
  };

  const applyFilters = (search, category, filters) => {
    let filtered = [...initialRecipes];

    if (search) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(search) ||
        recipe.description.toLowerCase().includes(search) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(search))
      );
    }

    if (category !== 'All') {
      filtered = filtered.filter(recipe => recipe.category === category);
    }

    if (filters.difficulty !== 'All') {
      filtered = filtered.filter(recipe => recipe.difficulty === filters.difficulty);
    }

    filtered = filtered.filter(recipe => {
      return recipe.rating >= filters.minRating &&
             parseInt(recipe.prepTime) <= filters.maxPrepTime &&
             recipe.calories <= filters.maxCalories;
    });

    setRecipes(filtered);
  };

  const toggleFavorite = (recipeId) => {
    setFavorites(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const handleSort = (type) => {
    const sorted = [...recipes].sort((a, b) => {
      switch(type) {
        case 'rating':
          return b.rating - a.rating;
        case 'difficulty':
          const order = { Easy: 1, Medium: 2, Hard: 3 };
          return order[a.difficulty] - order[b.difficulty];
        case 'time':
          return parseInt(a.prepTime) - parseInt(b.prepTime);
        case 'calories':
          return a.calories - b.calories;
        default:
          return 0;
      }
    });
    setRecipes(sorted);
  };

  const stats = useMemo(() => ({
    total: recipes.length,
    avgRating: (recipes.reduce((sum, r) => sum + r.rating, 0) / recipes.length).toFixed(1),
    avgTime: Math.round(recipes.reduce((sum, r) => sum + parseInt(r.prepTime), 0) / recipes.length),
    favorites: favorites.length
  }), [recipes, favorites]);

  return (
    <div className="mx-auto max-w-7xl p-4">
      <Card className="p-4 mb-4">
        <div className="flex items-center mb-4">
          <h2 className="text-xl font-semibold">Recipes</h2>
          <div className="ml-auto text-sm">
            <span className="mr-4">{stats.total} recipes</span>
            <span className="mr-4">{stats.avgRating}⭐</span>
            <span className="mr-4">{stats.avgTime}m</span>
            <span>{stats.favorites}❤️</span>
          </div>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border rounded"
          />
          
          <div className="flex gap-2">
            {['All', 'Italian', 'Indian', 'Asian'].map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryFilter(cat)}
                className={`px-3 py-1 rounded ${
                  filterCategory === cat 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <select 
              onChange={(e) => handleSort(e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">Sort by</option>
              <option value="rating">Rating</option>
              <option value="time">Time</option>
              <option value="calories">Calories</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-3 py-1 bg-gray-100 rounded"
            >
              {showFilters ? 'Hide' : 'Filters'}
            </button>
          </div>

          {showFilters && (
            <div className="p-4 bg-gray-50 rounded space-y-4">
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
                <label className="block mb-2">Min Rating: {filterSettings.minRating}</label>
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
                <label className="block mb-2">Max Time: {filterSettings.maxPrepTime}m</label>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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