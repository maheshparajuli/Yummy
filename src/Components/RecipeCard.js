import React, { useState } from 'react';
import { Heart, Clock, ChefHat } from 'lucide-react';
import '../Styles/RecipeCard.css';

function RecipeCard({ recipe, onFavorite }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    onFavorite && onFavorite(recipe.id);
  };

  return (
    <div className="recipe-card relative group">
      <div className="relative">
        <img 
          src={recipe.image} 
          alt={recipe.name} 
          className="recipe-card-image w-full h-48 object-cover" 
        />
        <button 
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md"
        >
          <Heart 
            size={24} 
            color="red" 
            fill={isFavorite ? 'red' : 'none'}
          />
        </button>
      </div>
      
      <div className="p-4">
        <h3 className="recipe-card-title text-xl font-bold mb-2">{recipe.name}</h3>
        <p className="recipe-card-description text-gray-600 mb-4">{recipe.description}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Clock size={16} className="text-gray-500" />
            <span className="text-sm">{recipe.prepTime}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <ChefHat size={16} className="text-gray-500" />
            <span className="text-sm">{recipe.difficulty}</span>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button 
            className="recipe-card-button bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            View Recipe
          </button>
          
          <div className="flex items-center">
            <span className="mr-2 text-yellow-500">★</span>
            <span>{recipe.rating}/5</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;