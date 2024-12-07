import React, { useState, useEffect, useCallback } from 'react';
import { 
  Heart, 
  Clock, 
  ChefHat, 
  Info, 
  Utensils, 
  Flame, 
  ShareTwo, 
  Copy,
  Scissors,
  Scale
} from 'lucide-react';
import './RecipeCard.css';

function RecipeCard({ recipe, onFavorite, isFavorite: propIsFavorite, onShare }) {
  const [isFavorite, setIsFavorite] = useState(propIsFavorite || false);
  const [showDetails, setShowDetails] = useState(false);
  const [servings, setServings] = useState(recipe.servings || 2);

  useEffect(() => {
    setIsFavorite(propIsFavorite);
  }, [propIsFavorite]);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const handleShareRecipe = useCallback(() => {
    // Enhanced sharing functionality
    const shareText = `Check out the recipe for ${recipe.name}! 
Preparation Time: ${recipe.prepTime} mins
Difficulty: ${recipe.difficulty}
Rating: ${recipe.rating}/5`;

    if (navigator.share) {
      navigator.share({
        title: recipe.name,
        text: shareText,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback for browsers without native share
      navigator.clipboard.writeText(shareText)
        .then(() => alert('Recipe details copied to clipboard!'))
        .catch(err => console.error('Could not copy text: ', err));
    }
  }, [recipe]);

  const adjustServings = (direction) => {
    setServings(prev => {
      const newServings = direction === 'increase' 
        ? Math.min(prev + 1, 10) 
        : Math.max(prev - 1, 1);
      return newServings;
    });
  };

  const copyIngredients = () => {
    if (recipe.ingredients) {
      const ingredientsList = recipe.ingredients
        .map((ingredient, index) => `${index + 1}. ${ingredient}`)
        .join('\n');
      
      navigator.clipboard.writeText(ingredientsList)
        .then(() => alert('Ingredients copied to clipboard!'))
        .catch(err => console.error('Could not copy ingredients: ', err));
    }
  };

  const calculateScaledNutrition = () => {
    if (!recipe.nutritionalInfo || !recipe.servings) return recipe.nutritionalInfo;

    const scaleFactor = servings / recipe.servings;
    const scaledNutrition = {};

    Object.entries(recipe.nutritionalInfo).forEach(([key, value]) => {
      // Remove 'g' and convert to number
      const numericValue = parseFloat(value);
      
      if (!isNaN(numericValue)) {
        scaledNutrition[key] = `${(numericValue * scaleFactor).toFixed(1)}g`;
      } else {
        scaledNutrition[key] = value;
      }
    });

    return scaledNutrition;
  };

  const scaledNutrition = calculateScaledNutrition();

  return (
    <div className="recipe-card">
      <div className="recipe-img-wrap">
        <img src={recipe.image} alt={recipe.name} className="recipe-img" />
        <button 
          onClick={() => { 
            setIsFavorite(!isFavorite); 
            onFavorite?.(recipe.id); 
          }} 
          className="favorite-btn"
        >
          <Heart size={24} color="red" fill={isFavorite ? 'red' : 'none'} />
        </button>
      </div>

      <div className="recipe-content">
        <h3>{recipe.name}</h3>
        <div className="recipe-meta">
          <div title="Preparation Time"><Clock size={16} /><span>{recipe.prepTime} mins</span></div>
          <div title="Difficulty"><ChefHat size={16} /><span>{recipe.difficulty}</span></div>
          <div title="Calories"><Flame size={16} /><span>{recipe.calories} cal</span></div>
        </div>

        <div className="recipe-actions">
          <button onClick={toggleDetails}>{showDetails ? 'Hide' : 'View'} Details</button>
          <div className="recipe-rating">★ {recipe.rating}/5</div>
        </div>

        {showDetails && (
          <>
            <div className="recipe-details">
              <div className="servings-control">
                <Utensils size={16} />
                <span>Servings:</span>
                <div className="servings-adjust">
                  <button onClick={() => adjustServings('decrease')}>-</button>
                  <span>{servings}</span>
                  <button onClick={() => adjustServings('increase')}>+</button>
                </div>
              </div>

              {recipe.ingredients && (
                <div className="ingredients-section">
                  <h4>Ingredients</h4>
                  <button onClick={copyIngredients} className="copy-ingredients-btn">
                    <Copy size={16} /> Copy Ingredients
                  </button>
                  <ul>
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index}>{ingredient}</li>
                    ))}
                  </ul>
                </div>
              )}

              {scaledNutrition && (
                <div className="nutrition-section">
                  <h4>Nutrition <Scale size={16} /></h4>
                  <table>
                    <tbody>
                      {Object.entries(scaledNutrition).map(([key, value]) => (
                        <tr key={key}>
                          <td>{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                          <td>{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="recipe-share-actions">
                <button onClick={handleShareRecipe}>
                  <ShareTwo size={16} /> Share Recipe
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RecipeCard;