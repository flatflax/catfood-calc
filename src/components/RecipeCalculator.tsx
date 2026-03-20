/**
 * 配方计算器 - 核心组件
 * 用于创建和计算猫饭配方
 */

import { useState, useMemo, useCallback } from 'react';
import { useAppStore } from '../store';
import {
  Cat,
  Ingredient,
  Recipe,
  RecipeIngredient,
  IngredientCategory,
  LifeStage,
  ActivityLevel,
} from '../types';
import {
  calculateDailyRequirement,
  analyzeRecipe,
  compareNutrition,
  calculateFeedingAmount,
  validateRecipe,
} from '../utils/nutritionCalculator';
import { calculateRecipeCost, calculateDailyCost } from '../utils/costCalculator';
import { MaterialIcon, Icons } from './MaterialIcon';
import './RecipeCalculator.css';

export function RecipeCalculator() {
  // Store
  const cats = useAppStore((state) => state.cats);
  const ingredients = useAppStore((state) => state.ingredients);
  const addRecipe = useAppStore((state) => state.addRecipe);
  const ingredientsMap = useMemo(() => {
    const map = new Map<string, Ingredient>();
    ingredients.forEach((ing) => map.set(ing.id, ing));
    return map;
  }, [ingredients]);

  // State
  const [selectedCatId, setSelectedCatId] = useState<string>(cats[0]?.id || '');
  const [recipeName, setRecipeName] = useState('');
  const [recipeItems, setRecipeItems] = useState<RecipeIngredient[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<IngredientCategory | 'all'>('all');
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Computed
  const selectedCat = useMemo(() => 
    cats.find((c) => c.id === selectedCatId),
    [cats, selectedCatId]
  );

  const filteredIngredients = useMemo(() => {
    if (selectedCategory === 'all') return ingredients;
    return ingredients.filter((ing) => ing.category === selectedCategory);
  }, [ingredients, selectedCategory]);

  const currentRecipe = useMemo<Recipe>(() => ({
    id: 'temp',
    name: recipeName || '临时配方',
    ingredients: recipeItems,
    totalWeight: recipeItems.reduce((sum, item) => sum + item.weight, 0),
    targetCatId: selectedCatId,
    isDefault: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }), [recipeName, recipeItems, selectedCatId]);

  const nutritionAnalysis = useMemo(() => {
    if (recipeItems.length === 0) return null;
    return analyzeRecipe(currentRecipe, ingredientsMap);
  }, [currentRecipe, ingredientsMap]);

  const nutritionComparison = useMemo(() => {
    if (!nutritionAnalysis || !selectedCat) return null;
    const requirement = calculateDailyRequirement(selectedCat);
    return compareNutrition(requirement, nutritionAnalysis);
  }, [nutritionAnalysis, selectedCat]);

  const costAnalysis = useMemo(() => {
    if (recipeItems.length === 0) return null;
    return calculateRecipeCost(currentRecipe, ingredientsMap);
  }, [currentRecipe, ingredientsMap]);

  const dailyCost = useMemo(() => {
    if (!costAnalysis || !selectedCat || !nutritionAnalysis) return null;
    return calculateDailyCost(
      selectedCat.weight,
      nutritionAnalysis.energy / (nutritionAnalysis.totalWeight / 100),
      costAnalysis.costPer100g
    );
  }, [costAnalysis, selectedCat, nutritionAnalysis]);

  const validation = useMemo(() => {
    if (recipeItems.length === 0) return { valid: false, missing: [] };
    return validateRecipe(currentRecipe, ingredientsMap);
  }, [currentRecipe, ingredientsMap]);

  // Handlers
  const addIngredient = useCallback((ingredientId: string) => {
    setRecipeItems((prev) => {
      const existing = prev.find((item) => item.ingredientId === ingredientId);
      if (existing) {
        return prev.map((item) =>
          item.ingredientId === ingredientId
            ? { ...item, weight: item.weight + 50 }
            : item
        );
      }
      return [...prev, { ingredientId, weight: 50 }];
    });
  }, []);

  const updateIngredientWeight = useCallback((ingredientId: string, weight: number) => {
    setRecipeItems((prev) =>
      prev.map((item) =>
        item.ingredientId === ingredientId ? { ...item, weight } : item
      )
    );
  }, []);

  const removeIngredient = useCallback((ingredientId: string) => {
    setRecipeItems((prev) =>
      prev.filter((item) => item.ingredientId !== ingredientId)
    );
  }, []);

  const handleSaveRecipe = () => {
    if (!recipeName.trim() || recipeItems.length === 0) return;
    addRecipe({
      name: recipeName,
      ingredients: recipeItems,
      totalWeight: recipeItems.reduce((sum, item) => sum + item.weight, 0),
      targetCatId: selectedCatId,
      isDefault: false,
    });
    setShowSaveModal(true);
    setTimeout(() => setShowSaveModal(false), 2000);
  };

  const clearRecipe = () => {
    setRecipeName('');
    setRecipeItems([]);
  };

  // Render helpers
  const getCategoryName = (category: IngredientCategory) => {
    const names: Record<IngredientCategory, string> = {
      [IngredientCategory.RED_MEAT]: '红肉',
      [IngredientCategory.WHITE_MEAT]: '白肉',
      [IngredientCategory.ORGAN]: '内脏',
      [IngredientCategory.BONE]: '骨骼',
      [IngredientCategory.SUPPLEMENT]: '营养添加剂',
      [IngredientCategory.OTHER]: '其他',
    };
    return names[category];
  };

  const getLifeStageName = (stage: LifeStage) => {
    const names: Record<LifeStage, string> = {
      [LifeStage.KITTEN]: '幼猫',
      [LifeStage.ADULT]: '成猫',
      [LifeStage.SENIOR]: '老年猫',
      [LifeStage.PREGNANT]: '怀孕期',
      [LifeStage.LACTATING]: '哺乳期',
    };
    return names[stage];
  };

  return (
    <div className="recipe-calculator">
      {/* Header */}
      <div className="calculator-header">
        <h2>
          <MaterialIcon name={Icons.calculator} /> 配方计算器
        </h2>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={clearRecipe}>
            <MaterialIcon name={Icons.clear} style={{ fontSize: '18px', marginRight: '4px' }} />
            清空
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSaveRecipe}
            disabled={!recipeName.trim() || recipeItems.length === 0}
          >
          <MaterialIcon name={Icons.save} style={{ fontSize: '18px', marginRight: '4px' }} />
            保存配方
          </button>
        </div>
      </div>

      {/* Cat Selection */}
      <div className="card cat-selection">
        <div className="form-group">
          <label className="form-label">选择猫咪</label>
          <select
            className="form-select"
            value={selectedCatId}
            onChange={(e) => setSelectedCatId(e.target.value)}
          >
            {cats.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({cat.weight}kg, {getLifeStageName(cat.lifeStage)})
              </option>
            ))}
          </select>
        </div>
{selectedCat && (
              <div className="calculator-cat-info">
                <div className="calculator-cat-info-item">
                  <span className="label">每日能量需求:</span>
                  <span className="value">
                    {calculateDailyRequirement(selectedCat).der.toFixed(0)} kcal
                  </span>
                </div>
                <div className="calculator-cat-info-item">
                  <span className="label">建议喂食量:</span>
                  <span className="value">
                    {nutritionAnalysis
                      ? calculateFeedingAmount(
                          calculateDailyRequirement(selectedCat).der,
                          nutritionAnalysis.energy / (nutritionAnalysis.totalWeight / 100)
                        ).toFixed(0)
                      : '-'} g/天
                  </span>
                </div>
              </div>
            )}
      </div>

      <div className="calculator-grid">
        {/* Left Panel - Ingredients */}
        <div className="ingredients-panel">
          <div className="card">
            <h3 className="card-title">
            <MaterialIcon name={Icons.ingredients} /> 食材库
          </h3>
            
            {/* Category Filter */}
            <div className="category-tabs">
              <button
                className={`category-tab ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('all')}
              >
                全部
              </button>
              {Object.values(IngredientCategory).map((cat) => (
                <button
                  key={cat}
                  className={`category-tab ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {getCategoryName(cat)}
                </button>
              ))}
            </div>

            {/* Ingredients List */}
            <div className="ingredients-grid">
              {filteredIngredients.map((ing) => {
                const addedItem = recipeItems.find(item => item.ingredientId === ing.id);
                const isAdded = !!addedItem;
                return (
                  <button
                    key={ing.id}
                    className={`ingredient-btn ${isAdded ? 'added' : ''}`}
                    onClick={() => addIngredient(ing.id)}
                  >
                    <span className="ingredient-name">{ing.name}</span>
                    <span className="ingredient-price">
                      {isAdded ? (
                        <span className="added-badge">已添加 {addedItem.weight}g ✓</span>
                      ) : (
                        `¥${ing.pricePerKg}/kg`
                      )}
                    </span>
                    {isAdded && (
                      <span className="add-more-hint">点击增加50g</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel - Recipe Builder */}
        <div className="recipe-panel">
          <div className="card">
            <h3 className="card-title"><MaterialIcon name={Icons.recipes} /> 配方</h3>
            
            <div className="form-group">
              <label className="form-label">配方名称</label>
              <input
                type="text"
                className="form-input"
                value={recipeName}
                onChange={(e) => setRecipeName(e.target.value)}
                placeholder="输入配方名称..."
              />
            </div>

            {recipeItems.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon"><MaterialIcon name={Icons.ingredients} /></span>
                <p>点击左侧食材添加到配方</p>
              </div>
            ) : (
              <div className="recipe-items">
                {recipeItems.map((item) => {
                  const ingredient = ingredientsMap.get(item.ingredientId);
                  if (!ingredient) return null;
                  return (
                    <div key={item.ingredientId} className="recipe-item">
                      <div className="recipe-item-info">
                        <span className="recipe-item-name">{ingredient.name}</span>
                        <span className="recipe-item-category">
                          {getCategoryName(ingredient.category)}
                        </span>
                      </div>
                      <div className="recipe-item-actions">
                        <input
                          type="number"
                          className="weight-input"
                          value={item.weight}
                          onChange={(e) =>
                            updateIngredientWeight(
                              item.ingredientId,
                              parseFloat(e.target.value) || 0
                            )
                          }
                          min="0"
                          step="5"
                        />
                        <span className="weight-unit">g</span>
                        <button
                          className="btn-remove"
                          onClick={() => removeIngredient(item.ingredientId)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
                
                <div className="recipe-total">
                  <span>总重量</span>
                  <span className="total-weight">
                    {recipeItems.reduce((sum, item) => sum + item.weight, 0)}g
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Validation */}
          {validation.missing.length > 0 && (
            <div className="card validation-card">
              <h4 className="validation-title"><MaterialIcon name={Icons.warning} /> 配方建议</h4>
              <ul className="validation-list">
                {validation.missing.map((item, idx) => (
                  <li key={idx}>缺少: {item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Nutrition Analysis */}
          {nutritionAnalysis && (
            <div className="card nutrition-card">
              <h4 className="card-title"><MaterialIcon name={Icons.info} /> 营养分析</h4>
              
              <div className="nutrition-grid">
                <div className="nutrition-item">
                  <span className="nutrition-label">总能量</span>
                  <span className="nutrition-value">
                    {nutritionAnalysis.energy.toFixed(0)} kcal
                  </span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">蛋白质</span>
                  <span className="nutrition-value">
                    {nutritionAnalysis.protein.toFixed(1)}g
                    <small>({nutritionAnalysis.proteinDmPercent.toFixed(1)}% DM)</small>
                  </span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">脂肪</span>
                  <span className="nutrition-value">
                    {nutritionAnalysis.fat.toFixed(1)}g
                    <small>({nutritionAnalysis.fatDmPercent.toFixed(1)}% DM)</small>
                  </span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">钙磷比</span>
                  <span className={`nutrition-value ${
                    nutritionAnalysis.caP_ratio >= 1 && nutritionAnalysis.caP_ratio <= 2
                      ? 'good'
                      : 'warning'
                  }`}>
                    {nutritionAnalysis.caP_ratio.toFixed(2)}:1
                  </span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">水分</span>
                  <span className="nutrition-value">
                    {((nutritionAnalysis.moisture / nutritionAnalysis.totalWeight) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="nutrition-item">
                  <span className="nutrition-label">牛磺酸</span>
                  <span className="nutrition-value">
                    {nutritionAnalysis.taurine.toFixed(0)}mg
                  </span>
                </div>
              </div>

              {/* Comparison */}
              {nutritionComparison && (
                <div className="comparison-section">
                  <div className="comparison-header">
                    <h5>营养满足率</h5>
                    <span className="comparison-hint">
                      💡 肉类天然含磷和牛磺酸，&gt;100%表示充足
                    </span>
                  </div>
                  <div className="comparison-bars">
                    {Object.entries(nutritionComparison.ratios).map(([key, ratio]) => (
                      <div key={key} className="comparison-bar">
                        <span className="bar-label">
                          {key === 'protein' && '蛋白质'}
                          {key === 'fat' && '脂肪'}
                          {key === 'calcium' && '钙'}
                          {key === 'phosphorus' && '磷'}
                          {key === 'taurine' && '牛磺酸'}
                          {key === 'energy' && '能量'}
                        </span>
                        <div className="bar-track">
                          <div
                            className={`bar-fill ${
                              ratio >= 0.8 && ratio <= 1.5 ? 'good' : ratio < 0.8 ? 'low' : 'high'
                            }`}
                            style={{ width: `${Math.min(ratio * 100, 100)}%` }}
                          />
                        </div>
                        <span className="bar-value">{(ratio * 100).toFixed(0)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Warnings */}
              {nutritionComparison?.warnings.length > 0 && (
                <div className="warnings">
                  {nutritionComparison.warnings.map((warning, idx) => (
                    <div key={idx} className="warning-item">
                      <MaterialIcon name={Icons.warning} /> {warning}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Cost Analysis */}
          {costAnalysis && (
            <div className="card cost-card">
              <h4 className="card-title"><MaterialIcon name={Icons.cost} /> 成本分析</h4>
              <div className="cost-grid">
                <div className="cost-item">
                  <span className="cost-label">单次成本</span>
                  <span className="cost-value">¥{costAnalysis.totalCost.toFixed(2)}</span>
                </div>
                <div className="cost-item">
                  <span className="cost-label">每100g</span>
                  <span className="cost-value">¥{costAnalysis.costPer100g.toFixed(2)}</span>
                </div>
                {dailyCost && (
                  <>
                    <div className="cost-item">
                      <span className="cost-label">每日成本</span>
                      <span className="cost-value">¥{dailyCost.dailyCost.toFixed(2)}</span>
                    </div>
                    <div className="cost-item">
                      <span className="cost-label">每月成本</span>
                      <span className="cost-value">¥{dailyCost.monthlyCost.toFixed(2)}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-content">
              <span className="modal-icon"><MaterialIcon name={Icons.success} /></span>
              <p>配方已保存!</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
