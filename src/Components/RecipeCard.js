import React, { useState, useEffect } from 'react';
import { Heart, Clock, ChefHat, Info, Utensils, Flame, ShareTwo } from 'lucide-react';
import './RecipeCard.css';

function RecipeCard({ recipe, onFavorite, isFavorite: propIsFavorite, onShare }) {
  const [isFavorite, setIsFavorite] = useState(propIsFavorite || false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    setIsFavorite(propIsFavorite);
  }, [propIsFavorite]);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="recipe-card">
      <div className="recipe-img-wrap">
        <img src={recipe.image} alt={recipe.name} className="recipe-img" />
        <button onClick={() => { setIsFavorite(!isFavorite); onFavorite?.(recipe.id); }} className="favorite-btn">
          <Heart size={24} color="red" fill={isFavorite ? 'red' : 'none'} />
        </button>
      </div>

      <div className="recipe-content">
        <h3>{recipe.name}</h3>
        <div className="recipe-meta">
          <div title="Preparation Time"><Clock size={16} /><span>{recipe.prepTime} mins</span></div>
          <div title="Difficulty"><ChefHat size={16} /><span>{recipe.difficulty}</span></div>
        </div>

        <div className="recipe-actions">
          <button onClick={toggleDetails}>{showDetails ? 'Hide' : 'View'} Details</button>
          <div className="recipe-rating">★ {recipe.rating}/5</div>
        </div>

        {showDetails && (
          <>
            <div className="recipe-details">
              {recipe.ingredients && (
                <div>
                  <h4>Ingredients</h4>
                  <ul>{recipe.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                  ))}</ul>
                </div>
              )}
              
              {recipe.nutritionalInfo && (
                <div>
                  <h4>Nutrition</h4>
                  <table>
                    <tbody>
                      {Object.entries(recipe.nutritionalInfo).map(([key, value]) => (
                        <tr key={key}><td>{key}</td><td>{value}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RecipeCard;