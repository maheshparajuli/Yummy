import React from 'react';
import RecipeCard from './RecipeCard';
import '../Styles/RecipeList.css'; // Import CSS

function RecipeList() {
  const recipes = [
    {
      name: 'Spaghetti Bolognese',
      description: 'A classic Italian pasta dish with rich meat sauce.',
      image: 'https://via.placeholder.com/200',
    },
    {
      name: 'Chicken Curry',
      description: 'A flavorful curry with tender chicken pieces.',
      image: 'https://via.placeholder.com/200',
    },
    {
      name: 'Vegetable Stir-Fry',
      description: 'A quick and healthy stir-fry with fresh vegetables.',
      image: 'https://via.placeholder.com/200',
    },
  ];

  return (
    <div className="recipe-list">
      {recipes.map((recipe, index) => (
        <RecipeCard key={index} recipe={recipe} />
      ))}
    </div>
  );
}

export default RecipeList;
