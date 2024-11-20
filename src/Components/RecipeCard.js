import React from 'react';
import '../Styles/RecipeCard.css'; 

function RecipeCard({ recipe }) {
  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.name} className="recipe-card-image" />
      <h3 className="recipe-card-title">{recipe.name}</h3>
      <p className="recipe-card-description">{recipe.description}</p>
      <button className="recipe-card-button">View Recipe</button>
    </div>
  );
}

export default RecipeCard;
