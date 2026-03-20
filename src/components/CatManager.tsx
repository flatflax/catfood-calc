/**
 * 猫咪管理组件 - Material Design 3 风格
 */

import { useState } from 'react';
import { useAppStore } from '../store';
import { Cat, LifeStage, ActivityLevel } from '../types';
import { calculateDER } from '../utils/nutritionCalculator';
import { MaterialIcon, Icons } from './MaterialIcon';
import './CatManager.css';

export function CatManager() {
  const cats = useAppStore((state) => state.cats);
  const addCat = useAppStore((state) => state.addCat);
  const updateCat = useAppStore((state) => state.updateCat);
  const deleteCat = useAppStore((state) => state.deleteCat);

  const [showForm, setShowForm] = useState(false);
  const [editingCat, setEditingCat] = useState<Cat | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    weight: 4,
    lifeStage: LifeStage.ADULT,
    activityLevel: ActivityLevel.MODERATE,
    isNeutered: true,
    targetBodyCondition: 'ideal' as const,
    note: '',
  });

  const resetForm = () => {
    setFormData({
      name: '',
      weight: 4,
      lifeStage: LifeStage.ADULT,
      activityLevel: ActivityLevel.MODERATE,
      isNeutered: true,
      targetBodyCondition: 'ideal',
      note: '',
    });
    setEditingCat(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCat) {
      updateCat(editingCat.id, formData);
    } else {
      addCat(formData);
    }
    setShowForm(false);
    resetForm();
  };

  const handleEdit = (cat: Cat) => {
    setEditingCat(cat);
    setFormData({
      name: cat.name,
      weight: cat.weight,
      lifeStage: cat.lifeStage,
      activityLevel: cat.activityLevel,
      isNeutered: cat.isNeutered,
      targetBodyCondition: cat.targetBodyCondition || 'ideal',
      note: cat.note || '',
    });
    setShowForm(true);
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

  const getActivityName = (level: ActivityLevel) => {
    const names: Record<ActivityLevel, string> = {
      [ActivityLevel.SEDENTARY]: '低活动量',
      [ActivityLevel.MODERATE]: '中等活动量',
      [ActivityLevel.ACTIVE]: '高活动量',
    };
    return names[level];
  };

  const getLifeStageIcon = (stage: LifeStage) => {
    const icons: Record<LifeStage, string> = {
      [LifeStage.KITTEN]: 'child_care',
      [LifeStage.ADULT]: 'pets',
      [LifeStage.SENIOR]: 'elderly',
      [LifeStage.PREGNANT]: 'pregnant_woman',
      [LifeStage.LACTATING]: 'breastfeeding',
    };
    return icons[stage];
  };

  return (
    <div className="cat-manager">
      {/* Header */}
      <div className="manager-header">
        <h2>
          <MaterialIcon name={Icons.cats} />
          猫咪档案
        </h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <MaterialIcon name={Icons.add} style={{ fontSize: '20px' }} />
          添加猫咪
        </button>
      </div>

      {/* Form Dialog */}
      {showForm && (
        <div className="dialog-overlay" onClick={() => setShowForm(false)}>
          <div className="dialog" onClick={(e) => e.stopPropagation()}>
            <div className="dialog-header">
              <h3 className="dialog-title">
                {editingCat ? '编辑猫咪' : '添加猫咪'}
              </h3>
              <button
                className="dialog-close"
                onClick={() => setShowForm(false)}
              >
                <MaterialIcon name={Icons.close} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="dialog-content">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">名字 *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    placeholder="猫咪的名字"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">体重 (kg) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="30"
                    className="form-input"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: parseFloat(e.target.value) })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">生命阶段 *</label>
                  <select
                    className="form-select"
                    value={formData.lifeStage}
                    onChange={(e) =>
                      setFormData({ ...formData, lifeStage: e.target.value as LifeStage })
                    }
                  >
                    {Object.values(LifeStage).map((stage) => (
                      <option key={stage} value={stage}>
                        {getLifeStageName(stage)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">活动水平 *</label>
                  <select
                    className="form-select"
                    value={formData.activityLevel}
                    onChange={(e) =>
                      setFormData({ ...formData, activityLevel: e.target.value as ActivityLevel })
                    }
                  >
                    {Object.values(ActivityLevel).map((level) => (
                      <option key={level} value={level}>
                        {getActivityName(level)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">是否绝育</label>
                  <div className="radio-group">
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="neutered"
                        checked={formData.isNeutered}
                        onChange={() => setFormData({ ...formData, isNeutered: true })}
                      />
                      <span>已绝育</span>
                    </label>
                    <label className="radio-label">
                      <input
                        type="radio"
                        name="neutered"
                        checked={!formData.isNeutered}
                        onChange={() => setFormData({ ...formData, isNeutered: false })}
                      />
                      <span>未绝育</span>
                    </label>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">目标体型</label>
                  <select
                    className="form-select"
                    value={formData.targetBodyCondition}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetBodyCondition: e.target.value as 'underweight' | 'ideal' | 'overweight',
                      })
                    }
                  >
                    <option value="underweight">偏瘦</option>
                    <option value="ideal">理想</option>
                    <option value="overweight">偏胖</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">备注</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="其他信息..."
                />
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
                  {editingCat ? '保存修改' : '添加'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cats Grid */}
      <div className="cats-grid">
        {cats.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              <MaterialIcon name="pets" style={{ fontSize: '64px' }} />
            </div>
            <h3 className="empty-title">还没有添加猫咪</h3>
            <p className="empty-description">
              添加您的第一只猫咪，开始计算营养需求
            </p>
            <button
              className="btn btn-primary"
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
            >
              <MaterialIcon name={Icons.add} />
              添加第一只猫咪
            </button>
          </div>
        ) : (
          cats.map((cat) => (
            <div key={cat.id} className="cat-card">
              {/* Card Header with Avatar */}
              <div className="cat-card-header">
                <div className="cat-avatar">
                  <MaterialIcon name={getLifeStageIcon(cat.lifeStage)} />
                </div>
                <div className="cat-info">
                  <h4 className="cat-name">{cat.name}</h4>
                  <span className="cat-chip">
                    {getLifeStageName(cat.lifeStage)}
                  </span>
                </div>
                <div className="cat-actions-menu">
                  <button
                    className="icon-btn"
                    onClick={() => handleEdit(cat)}
                    title="编辑"
                  >
                    <MaterialIcon name={Icons.edit} />
                  </button>
                  <button
                    className="icon-btn danger"
                    onClick={() => {
                      if (confirm(`确定要删除 ${cat.name} 吗？`)) {
                        deleteCat(cat.id);
                      }
                    }}
                    title="删除"
                  >
                    <MaterialIcon name={Icons.delete} />
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="cat-stats-row">
                <div className="stat-box">
                  <MaterialIcon name="monitor_weight" className="stat-icon" />
                  <span className="stat-value">{cat.weight}</span>
                  <span className="stat-unit">kg</span>
                </div>
                <div className="stat-box highlight">
                  <MaterialIcon name="local_fire_department" className="stat-icon" />
                  <span className="stat-value">{calculateDER(cat).toFixed(0)}</span>
                  <span className="stat-unit">kcal/天</span>
                </div>
              </div>

              {/* Details */}
              <div className="cat-details">
                <div className="detail-row">
                  <span className="detail-label">
                    <MaterialIcon name="directions_run" style={{ fontSize: '16px' }} />
                    活动量
                  </span>
                  <span className="detail-value">{getActivityName(cat.activityLevel)}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">
                    <MaterialIcon name="health_and_safety" style={{ fontSize: '16px' }} />
                    绝育状态
                  </span>
                  <span className="detail-value">
                    {cat.isNeutered ? (
                      <span className="badge success">已绝育</span>
                    ) : (
                      <span className="badge">未绝育</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Note */}
              {cat.note && (
                <div className="cat-note">
                  <MaterialIcon name="notes" style={{ fontSize: '16px' }} />
                  <p>{cat.note}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
