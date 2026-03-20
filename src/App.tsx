/**
 * 猫饭计算器 - 主应用
 */

import { useState } from 'react';
import { useAppStore } from './store';
import { CatManager } from './components/CatManager';
import { IngredientManager } from './components/IngredientManager';
import { RecipeCalculator } from './components/RecipeCalculator';
import { RecipeList } from './components/RecipeList';
import { MaterialIcon, Icons } from './components/MaterialIcon';
import './App.css';

type Tab = 'calculator' | 'recipes' | 'cats' | 'ingredients';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('calculator');
  const cats = useAppStore((state) => state.cats);
  const recipes = useAppStore((state) => state.recipes);

  const renderContent = () => {
    switch (activeTab) {
      case 'calculator':
        return <RecipeCalculator />;
      case 'recipes':
        return <RecipeList />;
      case 'cats':
        return <CatManager />;
      case 'ingredients':
        return <IngredientManager />;
      default:
        return <RecipeCalculator />;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon">
            <MaterialIcon name={Icons.cat} style={{ fontSize: '1.5rem' }} />
          </span>
          <h1>猫饭计算器</h1>
        </div>
        <div className="stats">
          <span className="stat-item">
            <MaterialIcon name={Icons.cat} style={{ fontSize: '1rem' }} />
            {cats.length} 只猫咪
          </span>
          <span className="stat-item">
            <MaterialIcon name={Icons.recipes} style={{ fontSize: '1rem' }} />
            {recipes.length} 个配方
          </span>
        </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'calculator' ? 'active' : ''}`}
          onClick={() => setActiveTab('calculator')}
        >
          <MaterialIcon name={Icons.calculator} className="nav-icon" />
          <span className="nav-text">计算器</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          <MaterialIcon name={Icons.recipes} className="nav-icon" />
          <span className="nav-text">配方</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'cats' ? 'active' : ''}`}
          onClick={() => setActiveTab('cats')}
        >
          <MaterialIcon name={Icons.cats} className="nav-icon" />
          <span className="nav-text">猫咪</span>
        </button>
        <button
          className={`nav-btn ${activeTab === 'ingredients' ? 'active' : ''}`}
          onClick={() => setActiveTab('ingredients')}
        >
          <MaterialIcon name={Icons.ingredients} className="nav-icon" />
          <span className="nav-text">食材</span>
        </button>
      </nav>

      <main className="app-main">
        {renderContent()}
      </main>

      <footer className="app-footer">
        <p>基于 NRC 2006 猫咪营养标准 | 仅供参考，请咨询专业兽医</p>
      </footer>
    </div>
  );
}

export default App;
