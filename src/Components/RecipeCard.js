import React, { useState, useEffect } from 'react';
import { Heart, Clock, ChefHat, Info, Utensils, Flame, ShareTwo } from 'lucide-react';
import './RecipeCard.css';

function RecipeCard({ recipe, onFavorite, isFavorite: propIsFavorite, onShare }) {
  const [isFavorite, setIsFavorite] = useState(propIsFavorite || false);
  const [showIngredients, setShowIngredients] = useState(false);
  const [showNutritionalInfo, setShowNutritionalInfo] = useState(false);

  useEffect(() => {
    setIsFavorite(propIsFavorite);
  }, [propIsFavorite]);

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
    onFavorite && onFavorite(recipe.id);
  };

  const toggleIngredients = () => {
    setShowIngredients(!showIngredients);
  };

  const toggleNutritionalInfo = () => {
    setShowNutritionalInfo(!showNutritionalInfo);
  };

  const handleShareClick = () => {
    onShare && onShare(recipe);
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
          title="Add to Favorites"
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
          <div className="rc-time" title="Preparation Time">
            <Clock size={16} />
            <span>{recipe.prepTime} mins</span>
          </div>

          <div className="rc-difficulty" title="Difficulty Level">
            <ChefHat size={16} />
            <span>{recipe.difficulty}</span>
          </div>

          <div className="rc-calories" title="Calories">
            <Flame size={16} />
            <span>{recipe.calories} kcal</span>
          </div>

          <div className="rc-servings" title="Servings">
            <Utensils size={16} />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        <div className="rc-footer">
          <div className="rc-actions">
            <button
              className="rc-btn"
              onClick={toggleIngredients}
              title={showIngredients ? 'Hide Ingredients' : 'View Ingredients'}
            >
              {showIngredients ? 'Hide Ingredients' : 'View Ingredients'}
            </button>
            <button
              className="rc-btn"
              onClick={toggleNutritionalInfo}
              title={showNutritionalInfo ? 'Hide Nutrition' : 'View Nutrition'}
            >
              {showNutritionalInfo ? 'Hide Nutrition' : 'View Nutrition'}
            </button>
            <button
              className="rc-btn"
              onClick={handleShareClick}
              title="Share Recipe"
            >
              <ShareTwo size={16} />
            </button>
          </div>

          <div className="rc-rating" title="User Rating">
            <span className="star">★</span>
            <span>{recipe.rating}/5</span>
          </div>
        </div>

        {showIngredients && (
          <ul className="rc-ingredients">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="rc-ingredient">
                {ingredient}
              </li>
            ))}
          </ul>
        )}

        {showNutritionalInfo && recipe.nutritionalInfo && (
          <div className="rc-nutritional-info">
            <h4>Nutritional Information</h4>
            <table>
              <tbody>
                {Object.entries(recipe.nutritionalInfo).map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default RecipeCard;