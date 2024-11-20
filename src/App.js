import React from 'react';
import RecipeList from './Components/RecipeList';
import './Styles/App.css'; 

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Recipe App</h1>
      <RecipeList />
    </div>
  );
}

export default App;
