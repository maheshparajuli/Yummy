import React, { useState } from 'react';
import { Heart, Clock, ChefHat, Flame, BookOpen } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

function RecipeCard({ recipe, onFavorite, onViewRecipe }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    const newFavoriteStatus = !isFavorite;
    setIsFavorite(newFavoriteStatus);
    onFavorite && onFavorite(recipe.id, newFavoriteStatus);
  };

  const handleViewRecipe = () => {
    onViewRecipe && onViewRecipe(recipe.id);
  };

  return (
    <Card className="w-full max-w-sm overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 bg-white/70 rounded-full p-2 hover:bg-white transition-colors"
        >
          <Heart
            size={24}
            color="red"
            fill={isFavorite ? 'red' : 'none'}
            className="transition-all"
          />
        </button>
      </div>

      <CardContent className="p-4 space-y-2">
        <h3 className="text-xl font-bold text-gray-800">{recipe.name}</h3>
        <p className="text-gray-600 line-clamp-2">{recipe.description}</p>

        <div className="flex justify-between text-sm text-gray-600 mt-2">
          <div className="flex items-center space-x-1">
            <Clock size={16} />
            <span>{recipe.prepTime}</span>
          </div>

          <div className="flex items-center space-x-1">
            <ChefHat size={16} />
            <span>{recipe.difficulty}</span>
          </div>

          <div className="flex items-center space-x-1">
            <Flame size={16} />
            <span>{recipe.calories} cal</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center p-4 pt-0">
        <Button 
          variant="outline" 
          onClick={handleViewRecipe}
          className="flex items-center space-x-2"
        >
          <BookOpen size={16} />
          <span>View Recipe</span>
        </Button>

        <div className="flex items-center space-x-1 text-yellow-500">
          <span>★</span>
          <span>{recipe.rating}/5</span>
        </div>
      </CardFooter>
    </Card>
  );
}

export default RecipeCard;