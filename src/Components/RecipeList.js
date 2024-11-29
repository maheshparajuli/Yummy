import React, { useState, useMemo, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { 
  Filter, 
  SortAsc, 
  RefreshCw, 
  PlusCircle, 
  Save, 
  Share2 
} from 'lucide-react';
import RecipeCard from './RecipeCard';
import NewRecipeModal from './NewRecipeModal';

function RecipeList() {
  const initialRecipes = [
    // ... previous recipes ...
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

  // Previous filter and search methods remain the same

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
    setRecipes(initialRecipes);
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

        {/* Previous search and filter UI remains the same */}
      </Card>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onFavorite={() => toggleFavorite(recipe.id)}
            isFavorite={favorites.includes(recipe.id)}
          />
        ))}
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