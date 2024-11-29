import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

function NewRecipeModal({ onClose, onAddRecipe }) {
  const [recipe, setRecipe] = useState({
    name: '',
    description: '',
    category: 'Italian',
    difficulty: 'Easy',
    prepTime: '30',
    servings: 4,
    calories: 500,
    ingredients: [''],
    image: '/api/placeholder/200/200'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({ ...prev, [name]: value }));
  };

  const updateIngredient = (index, value) => {
    const newIngredients = [...recipe.ingredients];
    newIngredients[index] = value;
    setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const addIngredient = () => {
    setRecipe(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
  };

  const removeIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    setRecipe(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddRecipe({
      ...recipe,
      id: Date.now(),
      rating: 0
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Recipe</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={recipe.name}
            onChange={handleChange}
            placeholder="Recipe Name"
            required
            className="w-full p-2 border rounded"
          />

          <textarea
            name="description"
            value={recipe.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="w-full p-2 border rounded"
          />

          <div className="grid grid-cols-2 gap-2">
            <select
              name="category"
              value={recipe.category}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              {['Italian', 'Indian', 'Asian', 'Mediterranean'].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select
              name="difficulty"
              value={recipe.difficulty}
              onChange={handleChange}
              className="p-2 border rounded"
            >
              {['Easy', 'Medium', 'Hard'].map(diff => (
                <option key={diff} value={diff}>{diff}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <input
              type="number"
              name="prepTime"
              value={recipe.prepTime}
              onChange={handleChange}
              placeholder="Prep Time"
              className="p-2 border rounded"
            />
            <input
              type="number"
              name="servings"
              value={recipe.servings}
              onChange={handleChange}
              placeholder="Servings"
              className="p-2 border rounded"
            />
            <input
              type="number"
              name="calories"
              value={recipe.calories}
              onChange={handleChange}
              placeholder="Calories"
              className="p-2 border rounded"
            />
          </div>

          <div>
            <label className="block mb-2">Ingredients</label>
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={ingredient}
                  onChange={(e) => updateIngredient(index, e.target.value)}
                  placeholder="Ingredient"
                  className="flex-grow p-2 border rounded mr-2"
                />
                <button 
                  type="button"
                  onClick={() => removeIngredient(index)}
                  className="p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <button 
              type="button"
              onClick={addIngredient}
              className="flex items-center p-2 bg-gray-100 rounded"
            >
              <Plus size={16} className="mr-2" /> Add Ingredient
            </button>
          </div>

          <button 
            type="submit" 
            className="w-full p-2 bg-blue-500 text-white rounded"
          >
            Add Recipe
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewRecipeModal;