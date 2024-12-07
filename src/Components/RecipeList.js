import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Filter, 
  SortAsc, 
  RefreshCw, 
  PlusCircle, 
  Save, 
  Share2,
  Search
} from 'lucide-react';
import RecipeCard from './RecipeCard';
import NewRecipeModal from './NewRecipeModal';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

function RecipeList() {
  const initialRecipes = [
    {
      id: 4,
      name: 'Greek Salad',
      description: 'Fresh Mediterranean salad with crisp vegetables.',
      image: '/api/placeholder/200/200',
      category: 'Mediterranean',
      rating: 4.7,
      difficulty: 'Easy',
      prepTime: '15',
      ingredients: ['cucumber', 'tomatoes', 'feta', 'olives', 'olive oil'],
      servings: 2,
      calories: 250,
      nutritionalInfo: {
        protein: '5g',
        carbs: '10g',
        fat: '15g',
        fiber: '3g'
      }
    },
    {
      id: 5,
      name: 'Veggie Stir Fry',
      description: 'Colorful vegetable stir fry with tofu.',
      image: '/api/placeholder/200/200',
      category: 'Asian',
      rating: 4.5,
      difficulty: 'Medium',
      prepTime: '30',
      ingredients: ['tofu', 'broccoli', 'carrots', 'soy sauce', 'ginger'],
      servings: 2,
      calories: 300,
      nutritionalInfo: {
        protein: '12g',
        carbs: '25g',
        fat: '10g',
        fiber: '5g'
      }
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
  const [isNewRecipeModalOpen, setIsNewRecipeModalOpen] = useState(false);

  // Categories from existing recipes
  const categories = useMemo(() => {
    const allCategories = recipes.map(recipe => recipe.category);
    return ['All', ...new Set(allCategories)];
  }, [recipes]);

  const toggleFavorite = (recipeId) => {
    setFavorites((prevFavorites) => 
      prevFavorites.includes(recipeId)
        ? prevFavorites.filter((id) => id !== recipeId)
        : [...prevFavorites, recipeId]
    );
  };

  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      // Search filter
      const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm.toLowerCase()));

      // Category filter
      const matchesCategory = filterCategory === 'All' || recipe.category === filterCategory;

      // Difficulty filter
      const matchesDifficulty = filterSettings.difficulty === 'All' || 
        recipe.difficulty === filterSettings.difficulty;

      // Rating filter
      const matchesRating = recipe.rating >= filterSettings.minRating;

      // Prep Time filter
      const matchesPrepTime = parseInt(recipe.prepTime) <= filterSettings.maxPrepTime;

      // Calories filter
      const matchesCalories = recipe.calories <= filterSettings.maxCalories;

      return matchesSearch && 
             matchesCategory && 
             matchesDifficulty && 
             matchesRating && 
             matchesPrepTime && 
             matchesCalories;
    });
  }, [recipes, searchTerm, filterCategory, filterSettings]);

  const exportRecipes = useCallback(() => {
    const recipeJson = JSON.stringify(recipes, null, 2);
    const blob = new Blob([recipeJson], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = 'recipes.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  }, [recipes]);

  const shareRecipes = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'My Recipes',
        text: `Check out these ${recipes.length} delicious recipes!`,
        url: window.location.href
      }).catch(console.error);
    } else {
      alert('Sharing not supported in this browser');
    }
  }, [recipes]);

  const addNewRecipe = (newRecipe) => {
    const recipeWithId = { ...newRecipe, id: Date.now() };
    setRecipes(prev => [...prev, recipeWithId]);
    setIsNewRecipeModalOpen(false);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterCategory('All');
    setFilterSettings({
      difficulty: 'All',
      minRating: 0,
      maxPrepTime: 120,
      maxCalories: 1000
    });
  };

  return (
    <div className="m-4 max-w-7xl mx-auto">
      <Card className="p-4 mb-4">
        <div className="flex mb-4 items-center">
          <h2 className="text-xl font-bold">Recipes</h2>
          <div className="ml-auto flex items-center space-x-2">
            <button onClick={exportRecipes} title="Export Recipes">
              <Save size={20} />
            </button>
            <button onClick={shareRecipes} title="Share Recipes">
              <Share2 size={20} />
            </button>
            <button onClick={() => setIsNewRecipeModalOpen(true)} title="Add New Recipe">
              <PlusCircle size={20} />
            </button>
            <button onClick={resetFilters} title="Reset Filters">
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* Enhanced Filtering Section */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Search Input */}
          <div className="flex-grow relative">
            <Input 
              type="text" 
              placeholder="Search recipes..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* Category Filter */}
          <Select 
            value={filterCategory} 
            onValueChange={setFilterCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Advanced Filters Toggle */}
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded"
          >
            <Filter size={16} /> Advanced Filters
          </button>
        </div>

        {/* Advanced Filters Dropdown */}
        {showFilters && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Difficulty Filter */}
            <Select 
              value={filterSettings.difficulty} 
              onValueChange={(value) => setFilterSettings(prev => ({...prev, difficulty: value}))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
                  <SelectItem key={diff} value={diff}>
                    {diff}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Min Rating Filter */}
            <Select 
              value={filterSettings.minRating.toString()} 
              onValueChange={(value) => setFilterSettings(prev => ({...prev, minRating: parseFloat(value)}))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Min Rating" />
              </SelectTrigger>
              <SelectContent>
                {[0, 1, 2, 3, 4].map(rating => (
                  <SelectItem key={rating} value={rating.toString()}>
                    {rating}+ Stars
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Max Prep Time Filter */}
            <Select 
              value={filterSettings.maxPrepTime.toString()} 
              onValueChange={(value) => setFilterSettings(prev => ({...prev, maxPrepTime: parseInt(value)}))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Max Prep Time" />
              </SelectTrigger>
              <SelectContent>
                {[15, 30, 45, 60, 120].map(time => (
                  <SelectItem key={time} value={time.toString()}>
                    {time} mins
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Max Calories Filter */}
            <Select 
              value={filterSettings.maxCalories.toString()} 
              onValueChange={(value) => setFilterSettings(prev => ({...prev, maxCalories: parseInt(value)}))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Max Calories" />
              </SelectTrigger>
              <SelectContent>
                {[250, 500, 750, 1000].map(calories => (
                  <SelectItem key={calories} value={calories.toString()}>
                    {calories} cal
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </Card>
      
      {/* Recipe Grid with Filtered Recipes */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map(recipe => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onFavorite={() => toggleFavorite(recipe.id)}
              isFavorite={favorites.includes(recipe.id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 p-4">
            No recipes match your current filters.
          </div>
        )}
      </div>

      {isNewRecipeModalOpen && (
        <NewRecipeModal 
          onClose={() => setIsNewRecipeModalOpen(false)}
          onAddRecipe={addNewRecipe}
        />
      )}
    </div>
  );
}

export default RecipeList;