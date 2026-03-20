/**
 * 成本计算引擎
 */

import { Recipe, Ingredient, RecipeCostAnalysis } from '../types';

/**
 * 计算配方成本
 */
export function calculateRecipeCost(
  recipe: Recipe,
  ingredients: Map<string, Ingredient>
): RecipeCostAnalysis {
  const ingredientCosts = recipe.ingredients.map(item => {
    const ingredient = ingredients.get(item.ingredientId);
    if (!ingredient) {
      return {
        ingredientId: item.ingredientId,
        ingredientName: '未知食材',
        weight: item.weight,
        cost: 0,
      };
    }
    
    const cost = (item.weight / 1000) * ingredient.pricePerKg;
    return {
      ingredientId: item.ingredientId,
      ingredientName: ingredient.name,
      weight: item.weight,
      cost,
    };
  });
  
  const totalCost = ingredientCosts.reduce((sum, item) => sum + item.cost, 0);
  const costPer100g = recipe.totalWeight > 0 ? (totalCost / recipe.totalWeight) * 100 : 0;
  
  // 默认每日喂食量约体重的3%（湿粮），这里先返回0，需要结合猫咪信息计算
  const costPerDay = 0;
  const costPerMonth = 0;
  
  return {
    recipeId: recipe.id,
    ingredientCosts,
    totalCost,
    costPer100g,
    costPerDay,
    costPerMonth,
  };
}

/**
 * 根据猫咪体重和配方能量计算每日成本
 * @param catWeight 猫咪体重(kg)
 * @param recipeEnergy 配方能量密度(kcal/100g)
 * @param costPer100g 每100g成本
 * @returns 每日喂食量和成本
 */
export function calculateDailyCost(
  catWeight: number,
  recipeEnergy: number,
  costPer100g: number
): { dailyAmount: number; dailyCost: number; monthlyCost: number } {
  // 估算每日能量需求 (简化版: RER * 1.2)
  const dailyEnergy = 70 * Math.pow(catWeight, 0.75) * 1.2;
  const dailyAmount = recipeEnergy > 0 ? (dailyEnergy / recipeEnergy) * 100 : 0;
  const dailyCost = (dailyAmount / 100) * costPer100g;
  const monthlyCost = dailyCost * 30;
  
  return {
    dailyAmount,
    dailyCost,
    monthlyCost,
  };
}

/**
 * 计算完整成本分析（包含每日/每月成本）
 */
export function calculateFullCostAnalysis(
  recipe: Recipe,
  ingredients: Map<string, Ingredient>,
  catWeight: number,
  recipeEnergy: number
): RecipeCostAnalysis {
  const baseAnalysis = calculateRecipeCost(recipe, ingredients);
  const { dailyAmount, dailyCost, monthlyCost } = calculateDailyCost(
    catWeight,
    recipeEnergy,
    baseAnalysis.costPer100g
  );
  
  return {
    ...baseAnalysis,
    costPerDay: dailyCost,
    costPerMonth: monthlyCost,
  };
}
