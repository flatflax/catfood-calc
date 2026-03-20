/**
 * 配方列表组件 - Material Design 3 风格
 */

import { useState, useMemo } from 'react';
import { useAppStore } from '../store';
import { Recipe, IngredientCategory } from '../types';
import { analyzeRecipe, compareNutrition, calculateDailyRequirement } from '../utils/nutritionCalculator';
import { calculateRecipeCost } from '../utils/costCalculator';
import { MaterialIcon, Icons } from './MaterialIcon';
import './RecipeList.css';

export function RecipeList() {
  const recipes = useAppStore((state) => state.recipes);
  const cats = useAppStore((state) => state.cats);
  const ingredients = useAppStore((state) => state.ingredients);
  const deleteRecipe = useAppStore((state) => state.deleteRecipe);

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [filterCat, setFilterCat] = useState<string>('all');

  const ingredientsMap = useMemo(() => {
    const map = new Map();
    ingredients.forEach((ing) => map.set(ing.id, ing));
    return map;
  }, [ingredients]);

  const filteredRecipes = useMemo(() => {
    if (filterCat === 'all') return recipes;
    return recipes.filter((r) => r.targetCatId === filterCat);
  }, [recipes, filterCat]);

  const getCatName = (catId?: string) => {
    if (!catId) return '通用';
    const cat = cats.find((c) => c.id === catId);
    return cat?.name || '未知';
  };

  const getIngredientName = (id: string) => {
    return ingredientsMap.get(id)?.name || '未知食材';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      [IngredientCategory.RED_MEAT]: 'set_meal',
      [IngredientCategory.WHITE_MEAT]: 'egg_alt',
      [IngredientCategory.ORGAN]: 'psychology',
      [IngredientCategory.BONE]: 'kebab_dining',
      [IngredientCategory.SUPPLEMENT]: 'medication',
      [IngredientCategory.OTHER]: 'inventory_2',
    };
    return icons[category] || 'inventory_2';
  };

  const exportRecipe = (recipe: Recipe) => {
    const analysis = analyzeRecipe(recipe, ingredientsMap);
    const cost = calculateRecipeCost(recipe, ingredientsMap);
    
    let content = `🐱 ${recipe.name}\n`;
    content += `=${'='.repeat(30)}\n\n`;
    content += `📋 食材清单:\n`;
    recipe.ingredients.forEach((item) => {
      const ing = ingredientsMap.get(item.ingredientId);
      if (ing) {
        content += `  • ${ing.name}: ${item.weight}g\n`;
      }
    });
    content += `\n📊 营养分析 (每100g):\n`;
    content += `  • 能量: ${(analysis.energy / (analysis.totalWeight / 100)).toFixed(1)} kcal\n`;
    content += `  • 蛋白质: ${analysis.proteinDmPercent.toFixed(1)}% (DM)\n`;
    content += `  • 脂肪: ${analysis.fatDmPercent.toFixed(1)}% (DM)\n`;
    content += `  • 钙磷比: ${analysis.caP_ratio.toFixed(2)}:1\n`;
    content += `\n💰 成本:\n`;
    content += `  • 单次: ¥${cost.totalCost.toFixed(2)}\n`;
    content += `  • 每100g: ¥${cost.costPer100g.toFixed(2)}\n`;
    content += `\n💡 基于 NRC 2006 标准计算\n`;
    
    navigator.clipboard.writeText(content).then(() => {
      alert('配方已复制到剪贴板！');
    });
  };

  return (
    <div className="recipe-list">
      {/* Header */}
      <div className="manager-header">
        <h2>
          <MaterialIcon name={Icons.recipes} />
          我的配方
        </h2>
        <div className="filter-chip-group">
          <MaterialIcon name="filter_list" style={{ fontSize: '20px', color: 'var(--md-sys-color-on-surface-variant)' }} />
          <select
            className="form-select"
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
          >
            <option value="all">全部猫咪</option>
            {cats.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="empty-state">
          <div className="empty-illustration">
            <MaterialIcon name="menu_book" style={{ fontSize: '64px' }} />
          </div>
          <h3 className="empty-title">还没有保存的配方</h3>
          <p className="empty-description">去计算器创建一个配方吧！</p>
        </div>
      ) : (
        <div className="recipes-grid">
          {filteredRecipes.map((recipe) => {
            const analysis = analyzeRecipe(recipe, ingredientsMap);
            const cost = calculateRecipeCost(recipe, ingredientsMap);
            const targetCat = cats.find((c) => c.id === recipe.targetCatId);
            const requirement = targetCat ? calculateDailyRequirement(targetCat) : null;
            const comparison = requirement ? compareNutrition(requirement, analysis) : null;
            
            return (
              <div key={recipe.id} className="recipe-card">
                {/* Card Header */}
                <div className="recipe-card-header">
                  <div className="recipe-icon">
                    <MaterialIcon name="restaurant_menu" />
                  </div>
                  <div className="recipe-info">
                    <h3 className="recipe-name">{recipe.name}</h3>
                    <div className="recipe-meta">
                      <MaterialIcon name="pets" style={{ fontSize: '14px' }} />
                      <span>{getCatName(recipe.targetCatId)}</span>
                    </div>
                  </div>
                </div>

                {/* Ingredients Preview */}
                <div className="recipe-ingredients-preview">
                  {recipe.ingredients.slice(0, 3).map((item) => {
                    const ing = ingredientsMap.get(item.ingredientId);
                    if (!ing) return null;
                    return (
                      <span key={item.ingredientId} className="ingredient-chip">
                        <MaterialIcon name={getCategoryIcon(ing.category)} style={{ fontSize: '14px' }} />
                        {ing.name}
                      </span>
                    );
                  })}
                  {recipe.ingredients.length > 3 && (
                    <span className="ingredient-chip more">
                      +{recipe.ingredients.length - 3}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="recipe-stats">
                  <div className="stat-item">
                    <MaterialIcon name="scale" style={{ fontSize: '16px' }} />
                    <span className="stat-value">{recipe.totalWeight}g</span>
                  </div>
                  <div className="stat-item">
                    <MaterialIcon name="local_fire_department" style={{ fontSize: '16px' }} />
                    <span className="stat-value">{analysis.energy.toFixed(0)}kcal</span>
                  </div>
                  <div className="stat-item highlight">
                    <MaterialIcon name="attach_money" style={{ fontSize: '16px' }} />
                    <span className="stat-value">¥{cost.totalCost.toFixed(2)}</span>
                  </div>
                </div>

                {/* Nutrition Bars */}
                {comparison && (
                  <div className="recipe-nutrition-preview">
                    <div className="nutrition-preview-item">
                      <span className="preview-label">蛋白质</span>
                      <div className="preview-bar">
                        <div
                          className={`preview-fill ${comparison.ratios.protein >= 0.8 ? 'good' : 'low'}`}
                          style={{ width: `${Math.min(comparison.ratios.protein * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                    <div className="nutrition-preview-item">
                      <span className="preview-label">脂肪</span>
                      <div className="preview-bar">
                        <div
                          className={`preview-fill ${comparison.ratios.fat >= 0.8 ? 'good' : 'low'}`}
                          style={{ width: `${Math.min(comparison.ratios.fat * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="recipe-card-actions">
                  <button
                    className="btn btn-text"
                    onClick={() => setSelectedRecipe(recipe)}
                  >
                    <MaterialIcon name="visibility" style={{ fontSize: '18px' }} />
                    详情
                  </button>
                  <button
                    className="btn btn-text"
                    onClick={() => exportRecipe(recipe)}
                  >
                    <MaterialIcon name={Icons.export} style={{ fontSize: '18px' }} />
                    导出
                  </button>
                  <button
                    className="btn btn-text danger"
                    onClick={() => {
                      if (confirm('确定要删除这个配方吗？')) {
                        deleteRecipe(recipe.id);
                      }
                    }}
                  >
                    <MaterialIcon name={Icons.delete} style={{ fontSize: '18px' }} />
                    删除
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Dialog */}
      {selectedRecipe && (
        <div className="dialog-overlay" onClick={() => setSelectedRecipe(null)}>
          <div className="dialog dialog-large" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <div className="dialog-title-section">
                <div className="dialog-icon">
                  <MaterialIcon name="restaurant_menu" />
                </div>
                <div>
                  <h3 className="dialog-title">{selectedRecipe.name}</h3>
                  <span className="dialog-subtitle">
                    <MaterialIcon name="pets" style={{ fontSize: '14px' }} />
                    {getCatName(selectedRecipe.targetCatId)}
                  </span>
                </div>
              </div>
              <button className="icon-btn" onClick={() => setSelectedRecipe(null)}>
                <MaterialIcon name={Icons.close} />
              </button>
            </div>
            
            <div className="dialog-content">
              {/* Ingredients Section */}
              <div className="dialog-section">
                <h4 className="section-title">
                  <MaterialIcon name="restaurant" style={{ fontSize: '20px' }} />
                  食材清单
                </h4>
                <div className="detail-ingredients">
                  {selectedRecipe.ingredients.map((item) => {
                    const ing = ingredientsMap.get(item.ingredientId);
                    if (!ing) return null;
                    return (
                      <div key={item.ingredientId} className="detail-ingredient">
                        <div className="ingredient-main">
                          <MaterialIcon name={getCategoryIcon(ing.category)} />
                          <span className="ing-name">{ing.name}</span>
                        </div>
                        <div className="ingredient-stats">
                          <span className="ing-weight">{item.weight}g</span>
                          <span className="ing-percent">
                            {((item.weight / selectedRecipe.totalWeight) * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Nutrition Section */}
              {(() => {
                const analysis = analyzeRecipe(selectedRecipe, ingredientsMap);
                return (
                  <div className="dialog-section">
                    <h4 className="section-title">
                      <MaterialIcon name="nutrition" style={{ fontSize: '20px' }} />
                      营养分析
                    </h4>
                    <div className="detail-nutrition-grid">
                      <div className="nutrition-box">
                        <span className="box-label">总能量</span>
                        <span className="box-value">{analysis.energy.toFixed(0)}</span>
                        <span className="box-unit">kcal</span>
                      </div>
                      <div className="nutrition-box">
                        <span className="box-label">蛋白质</span>
                        <span className="box-value">{analysis.proteinDmPercent.toFixed(1)}</span>
                        <span className="box-unit">% DM</span>
                      </div>
                      <div className="nutrition-box">
                        <span className="box-label">脂肪</span>
                        <span className="box-value">{analysis.fatDmPercent.toFixed(1)}</span>
                        <span className="box-unit">% DM</span>
                      </div>
                      <div className="nutrition-box highlight">
                        <span className="box-label">钙磷比</span>
                        <span className="box-value">{analysis.caP_ratio.toFixed(2)}</span>
                        <span className="box-unit">:1</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Cost Section */}
              <div className="dialog-section">
                <h4 className="section-title">
                  <MaterialIcon name="attach_money" style={{ fontSize: '20px' }} />
                  成本分析
                </h4>
                {(() => {
                  const cost = calculateRecipeCost(selectedRecipe, ingredientsMap);
                  return (
                    <div className="detail-cost">
                      <div className="cost-summary">
                        <div className="cost-item large">
                          <span className="cost-label">单次成本</span>
                          <span className="cost-value">¥{cost.totalCost.toFixed(2)}</span>
                        </div>
                        <div className="cost-item">
                          <span className="cost-label">每100g</span>
                          <span className="cost-amount">¥{cost.costPer100g.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="cost-breakdown">
                        {cost.ingredientCosts.map((item) => (
                          <div key={item.ingredientId} className="cost-breakdown-item">
                            <span>{item.ingredientName}</span>
                            <span>¥{item.cost.toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="dialog-actions">
              <button className="btn btn-text" onClick={() => setSelectedRecipe(null)}>
                关闭
              </button>
              <button className="btn btn-primary" onClick={() => exportRecipe(selectedRecipe)}>
                <MaterialIcon name={Icons.export} />
                导出配方
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
