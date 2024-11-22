import React, { useState } from 'react';
import { Heart, Clock, ChefHat } from 'lucide-react';
import './RecipeCard.css';

function RecipeCard({ recipe, onFavorite }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    onFavorite && onFavorite(recipe.id);
  };

  return (
    <div className="rc-card">
      <div className="rc-img-wrap">
        <img
          src={recipe.image}
          alt={recipe.name}
          className="rc-img"
        />
        <button
          onClick={handleFavoriteClick}
          className="rc-fav-btn"
        >
          <Heart
            size={24}
            color="red"
            fill={isFavorite ? 'red' : 'none'}
          />
        </button>
      </div>

      <div className="rc-content">
        <h3 className="rc-title">{recipe.name}</h3>
        <p className="rc-desc">{recipe.description}</p>

        <div className="rc-meta">
          <div className="rc-time">
            <Clock size={16} />
            <span>{recipe.prepTime}</span>
          </div>

          <div className="rc-difficulty">
            <ChefHat size={16} />
            <span>{recipe.difficulty}</span>
          </div>
        </div>

        <div className="rc-footer">
          <button className="rc-btn">
            View Recipe
          </button>

          <div className="rc-rating">
            <span className="star">★</span>
            <span>{recipe.rating}/5</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeCard;