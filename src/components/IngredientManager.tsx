/**
 * 食材管理组件 - Material Design 3 风格
 */

import { useState } from 'react';
import { useAppStore } from '../store';
import { Ingredient, IngredientCategory } from '../types';
import { MaterialIcon, Icons } from './MaterialIcon';
import './IngredientManager.css';

const emptyNutrition = {
  protein: 0,
  fat: 0,
  carbohydrate: 0,
  fiber: 0,
  moisture: 0,
  ash: 0,
  calcium: 0,
  phosphorus: 0,
  magnesium: 0,
  potassium: 0,
  sodium: 0,
};

export function IngredientManager() {
  const ingredients = useAppStore((state) => state.ingredients);
  const addIngredient = useAppStore((state) => state.addIngredient);
  const updateIngredient = useAppStore((state) => state.updateIngredient);
  const deleteIngredient = useAppStore((state) => state.deleteIngredient);
  const resetIngredients = useAppStore((state) => state.resetIngredients);

  const [showForm, setShowForm] = useState(false);
  const [editingIngredient, setEditingIngredient] = useState<Ingredient | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<IngredientCategory | 'all'>('all');
  const [formData, setFormData] = useState<{
    name: string;
    category: IngredientCategory;
    pricePerKg: number;
    ediblePortion: number;
    nutritionPer100g: typeof emptyNutrition & { taurine?: number; vitamin_a?: number; vitamin_d?: number; vitamin_e?: number };
  }>({
    name: '',
    category: IngredientCategory.RED_MEAT,
    pricePerKg: 0,
    ediblePortion: 1,
    nutritionPer100g: { ...emptyNutrition },
  });

  const resetForm = () => {
    setFormData({
      name: '',
      category: IngredientCategory.RED_MEAT,
      pricePerKg: 0,
      ediblePortion: 1,
      nutritionPer100g: { ...emptyNutrition },
    });
    setEditingIngredient(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      isDefault: false,
      note: '',
    };
    
    if (editingIngredient) {
      updateIngredient(editingIngredient.id, data);
    } else {
      addIngredient(data);
    }
    setShowForm(false);
    resetForm();
  };

  const handleEdit = (ingredient: Ingredient) => {
    if (ingredient.isDefault) {
      alert('默认食材不能编辑，请复制后修改');
      return;
    }
    setEditingIngredient(ingredient);
    setFormData({
      name: ingredient.name,
      category: ingredient.category,
      pricePerKg: ingredient.pricePerKg,
      ediblePortion: ingredient.ediblePortion,
      nutritionPer100g: { ...ingredient.nutritionPer100g },
    });
    setShowForm(true);
  };

  const filteredIngredients = selectedCategory === 'all' 
    ? ingredients 
    : ingredients.filter(ing => ing.category === selectedCategory);

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

  const getCategoryIcon = (category: IngredientCategory) => {
    const icons: Record<IngredientCategory, string> = {
      [IngredientCategory.RED_MEAT]: 'set_meal',
      [IngredientCategory.WHITE_MEAT]: 'egg_alt',
      [IngredientCategory.ORGAN]: 'psychology',
      [IngredientCategory.BONE]: 'kebab_dining',
      [IngredientCategory.SUPPLEMENT]: 'medication',
      [IngredientCategory.OTHER]: 'inventory_2',
    };
    return icons[category];
  };

  return (
    <div className="ingredient-manager">
      {/* Header */}
      <div className="manager-header">
        <h2>
          <MaterialIcon name={Icons.ingredients} />
          食材库
        </h2>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={resetIngredients}>
            <MaterialIcon name="restart_alt" />
            重置默认
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <MaterialIcon name={Icons.add} />
            添加食材
          </button>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div className="category-chips">
        <button
          className={`chip ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          <MaterialIcon name="apps" style={{ fontSize: '16px' }} />
          全部 ({ingredients.length})
        </button>
        {Object.values(IngredientCategory).map((cat) => (
          <button
            key={cat}
            className={`chip ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            <MaterialIcon name={getCategoryIcon(cat)} style={{ fontSize: '16px' }} />
            {getCategoryName(cat)} 
            ({ingredients.filter(i => i.category === cat).length})
          </button>
        ))}
      </div>

      {/* Add/Edit Dialog */}
      {showForm && (
        <div className="dialog-overlay" onClick={() => setShowForm(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3 className="dialog-title">
                {editingIngredient ? '编辑食材' : '添加食材'}
              </h3>
              <button className="icon-btn" onClick={() => setShowForm(false)}>
                <MaterialIcon name={Icons.close} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="dialog-content">
              <div className="form-section">
                <h4 className="section-title">基本信息</h4>
                <div className="form-grid-3">
                  <div className="form-group">
                    <label className="form-label">名称 *</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="食材名称"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">分类 *</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as IngredientCategory })}
                    >
                      {Object.values(IngredientCategory).map((cat) => (
                        <option key={cat} value={cat}>{getCategoryName(cat)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">价格 (元/kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="form-input"
                      value={formData.pricePerKg}
                      onChange={(e) => setFormData({ ...formData, pricePerKg: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4 className="section-title">营养成分 (每100g)</h4>
                <div className="form-grid-4">
                  <div className="form-group">
                    <label className="form-label">蛋白质 (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="form-input"
                      value={formData.nutritionPer100g.protein}
                      onChange={(e) => setFormData({
                        ...formData,
                        nutritionPer100g: { ...formData.nutritionPer100g, protein: parseFloat(e.target.value) || 0 }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">脂肪 (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="form-input"
                      value={formData.nutritionPer100g.fat}
                      onChange={(e) => setFormData({
                        ...formData,
                        nutritionPer100g: { ...formData.nutritionPer100g, fat: parseFloat(e.target.value) || 0 }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">水分 (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      className="form-input"
                      value={formData.nutritionPer100g.moisture}
                      onChange={(e) => setFormData({
                        ...formData,
                        nutritionPer100g: { ...formData.nutritionPer100g, moisture: parseFloat(e.target.value) || 0 }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">灰分 (g)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="form-input"
                      value={formData.nutritionPer100g.ash}
                      onChange={(e) => setFormData({
                        ...formData,
                        nutritionPer100g: { ...formData.nutritionPer100g, ash: parseFloat(e.target.value) || 0 }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">钙 (mg)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="form-input"
                      value={formData.nutritionPer100g.calcium}
                      onChange={(e) => setFormData({
                        ...formData,
                        nutritionPer100g: { ...formData.nutritionPer100g, calcium: parseFloat(e.target.value) || 0 }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">磷 (mg)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="form-input"
                      value={formData.nutritionPer100g.phosphorus}
                      onChange={(e) => setFormData({
                        ...formData,
                        nutritionPer100g: { ...formData.nutritionPer100g, phosphorus: parseFloat(e.target.value) || 0 }
                      })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">牛磺酸 (mg)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      className="form-input"
                      value={formData.nutritionPer100g.taurine || 0}
                      onChange={(e) => setFormData({
                        ...formData,
                        nutritionPer100g: { ...formData.nutritionPer100g, taurine: parseFloat(e.target.value) || 0 }
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="dialog-actions">
                <button
                  type="button"
                  className="btn btn-text"
                  onClick={() => setShowForm(false)}
                >
                  取消
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingIngredient ? '保存修改' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ingredients List */}
      <div className="ingredients-list">
        {filteredIngredients.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <MaterialIcon name="restaurant" style={{ fontSize: '64px' }} />
            </div>
            <h3 className="empty-title">该分类下没有食材</h3>
            <p className="empty-description">添加一些食材到库中吧</p>
          </div>
        ) : (
          filteredIngredients.map((ing) => (
            <div key={ing.id} className={`ingredient-item ${ing.isDefault ? 'default' : 'custom'}`}>
              <div className="ingredient-main">
                <div className="ingredient-icon-box">
                  <MaterialIcon name={getCategoryIcon(ing.category)} />
                </div>
                <div className="ingredient-info">
                  <span className="ingredient-name">
                    {ing.name}
                    {ing.isDefault && <span className="default-badge">默认</span>}
                  </span>
                  <span className="ingredient-category">{getCategoryName(ing.category)}</span>
                </div>
              </div>
              
              <div className="ingredient-nutrition">
                <div className="nutrition-tag">
                  <MaterialIcon name="fitness_center" style={{ fontSize: '12px' }} />
                  <span className="tag-value">{ing.nutritionPer100g.protein}g</span>
                  <span className="tag-label">蛋白</span>
                </div>
                <div className="nutrition-tag">
                  <MaterialIcon name="water_drop" style={{ fontSize: '12px' }} />
                  <span className="tag-value">{ing.nutritionPer100g.fat}g</span>
                  <span className="tag-label">脂肪</span>
                </div>
                <div className="nutrition-tag">
                  <MaterialIcon name="opacity" style={{ fontSize: '12px' }} />
                  <span className="tag-value">{ing.nutritionPer100g.moisture}g</span>
                  <span className="tag-label">水分</span>
                </div>
              </div>

              <div className="ingredient-price">
                <MaterialIcon name="attach_money" style={{ fontSize: '16px' }} />
                <span>{ing.pricePerKg}</span>
                <span className="price-unit">/kg</span>
              </div>

              <div className="ingredient-actions">
                {!ing.isDefault && (
                  <>
                    <button
                      className="icon-btn"
                      onClick={() => handleEdit(ing)}
                      title="编辑"
                    >
                      <MaterialIcon name={Icons.edit} />
                    </button>
                    <button
                      className="icon-btn danger"
                      onClick={() => {
                        if (confirm(`确定要删除 ${ing.name} 吗？`)) {
                          deleteIngredient(ing.id);
                        }
                      }}
                      title="删除"
                    >
                      <MaterialIcon name={Icons.delete} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
