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
    <div className="card">
      <div className="card-img-wrap">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="card-img"
        />
        <button
          onClick={handleFavoriteClick}
          className="card-fav-btn"
        >
          <Heart
            size={24}
            color="red"
            fill={isFavorite ? 'red' : 'none'}
          />
        </button>
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{recipe.name}</h3>
        <p className="card-desc">{recipe.description}</p>
        
        <div className="card-meta">
          <div className="card-time">
            <Clock size={16} />
            <span>{recipe.prepTime}</span>
          </div>
          
          <div className="card-difficulty">
            <ChefHat size={16} />
            <span>{recipe.difficulty}</span>
          </div>
        </div>

        <div className="card-footer">
          <button className="card-btn">
            View Recipe
          </button>
          
          <div className="card-rating">
            <span className="star">★</span>
            <span>{recipe.rating}/5</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;