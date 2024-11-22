import React, { useState } from 'react';
import RecipeCard from './RecipeCard';
import '../Styles/RecipeList.css';

function RecipeList() {
  const initialRecipes = [
    {
      id: 1,
      name: 'Spaghetti Bolognese',
      description: 'A classic Italian pasta dish with rich meat sauce.',
      image: 'https://via.placeholder.com/200',
      category: 'Italian',
      rating: 4.5,
      difficulty: 'Medium',
      prepTime: '45 mins',
      ingredients: ['pasta', 'ground beef', 'tomato sauce', 'onions', 'garlic']
    },
    {
      id: 2,
      name: 'Chicken Curry',
      description: 'A flavorful curry with tender chicken pieces.',
      image: 'https://via.placeholder.com/200',
      category: 'Indian',
      rating: 4.8,
      difficulty: 'Hard',
      prepTime: '60 mins',
      ingredients: ['chicken', 'curry powder', 'coconut milk', 'onions', 'spices']
    },
    {
      id: 3,
      name: 'Vegetable Stir-Fry',
      description: 'A quick and healthy stir-fry with fresh vegetables.',
      image: 'https://via.placeholder.com/200',
      category: 'Asian',
      rating: 4.2,
      difficulty: 'Easy',
      prepTime: '20 mins',
      ingredients: ['mixed vegetables', 'soy sauce', 'garlic', 'ginger', 'oil']
    },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [favorites, setFavorites] = useState([]);
  const [recipes, setRecipes] = useState(initialRecipes);

  // Search functionality
  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    const filteredRecipes = initialRecipes.filter(recipe =>
      recipe.name.toLowerCase().includes(term) ||
      recipe.description.toLowerCase().includes(term)
    );
    setRecipes(filteredRecipes);
  };

  // Category filter
  const handleCategoryFilter = (category) => {
    setFilterCategory(category);
    const filteredRecipes = category === 'All'
      ? initialRecipes
      : initialRecipes.filter(recipe => recipe.category === category);
    setRecipes(filteredRecipes);
  };

  // Favorite toggle
  const toggleFavorite = (recipeId) => {
    setFavorites(prevFavorites =>
      prevFavorites.includes(recipeId)
        ? prevFavorites.filter(id => id !== recipeId)
        : [...prevFavorites, recipeId]
    );
  };

  // Sort recipes
  const handleSortRecipes = (sortType) => {
    const sortedRecipes = [...recipes].sort((a, b) => {
      switch(sortType) {
        case 'rating':
          return b.rating - a.rating;
        case 'difficulty':
          const difficultyOrder = {'Easy': 1, 'Medium': 2, 'Hard': 3};
          return difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty];
        default:
          return 0;
      }
    });
    setRecipes(sortedRecipes);
  };

  // Advanced recipe filtering
  const filterRecipes = (difficulty = null, minRating = 0) => {
    let filteredRecipes = initialRecipes;
    
    if (difficulty) {
      filteredRecipes = filteredRecipes.filter(recipe =>
        recipe.difficulty === difficulty
      );
    }
    
    filteredRecipes = filteredRecipes.filter(recipe =>
      recipe.rating >= minRating
    );
    
    setRecipes(filteredRecipes);
  };

  return (
    <div className="recipe-list-container">
      <div className="recipe-controls">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        
        <div className="category-filters">
          {['All', 'Italian', 'Indian', 'Asian'].map(category => (
            <button
              key={category}
              onClick={() => handleCategoryFilter(category)}
              className={filterCategory === category ? 'active' : ''}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="sort-controls">
          <select onChange={(e) => handleSortRecipes(e.target.value)}>
            <option value="">Sort By</option>
            <option value="rating">Rating</option>
            <option value="difficulty">Difficulty</option>
          </select>
        </div>
      </div>
      
      <div className="recipe-grid">
        {recipes.map(recipe => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onFavorite={(recipeId) => toggleFavorite(recipeId)}
            isFavorite={favorites.includes(recipe.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default RecipeList;