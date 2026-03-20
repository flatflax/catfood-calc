/**
 * 营养计算引擎
 * 基于 NRC 2006 猫咪营养标准
 */

import {
  Cat,
  LifeStage,
  ActivityLevel,
  Ingredient,
  Recipe,
  RecipeIngredient,
  DailyNutritionRequirement,
  RecipeNutritionAnalysis,
  NutritionComparison,
} from '../types';

// ==================== 常量定义 ====================

/** 代谢能转换系数 (Atwater系数) */
const ENERGY_FACTORS = {
  protein: 3.5,     // kcal/g
  fat: 8.5,         // kcal/g
  carbohydrate: 3.5, // kcal/g
};

/** RER系数 (静息能量需求) */
const RER_FACTOR = 70;

/** 生命阶段能量乘数 */
const LIFE_STAGE_MULTIPLIERS: Record<LifeStage, number> = {
  [LifeStage.KITTEN]: 2.5,        // 幼猫
  [LifeStage.ADULT]: 1.0,         // 成猫
  [LifeStage.SENIOR]: 0.9,        // 老年猫
  [LifeStage.PREGNANT]: 1.8,      // 怀孕期
  [LifeStage.LACTATING]: 2.0,     // 哺乳期
};

/** 活动水平能量乘数 */
const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  [ActivityLevel.SEDENTARY]: 1.0,
  [ActivityLevel.MODERATE]: 1.2,
  [ActivityLevel.ACTIVE]: 1.4,
};

/** 绝育调整系数 */
const NEUTERED_FACTOR = 0.9;

/** 蛋白质需求 (g/100kcal) - NRC标准 */
const PROTEIN_REQUIREMENTS: Record<LifeStage, number> = {
  [LifeStage.KITTEN]: 10.0,
  [LifeStage.ADULT]: 6.5,
  [LifeStage.SENIOR]: 7.0,
  [LifeStage.PREGNANT]: 8.0,
  [LifeStage.LACTATING]: 9.0,
};

/** 脂肪需求 (g/100kcal) - NRC标准 */
const FAT_REQUIREMENTS: Record<LifeStage, number> = {
  [LifeStage.KITTEN]: 4.5,
  [LifeStage.ADULT]: 2.25,
  [LifeStage.SENIOR]: 2.5,
  [LifeStage.PREGNANT]: 3.0,
  [LifeStage.LACTATING]: 4.0,
};

// ==================== 计算函数 ====================

/**
 * 计算猫咪每日能量需求 (DER)
 * 公式: DER = RER × 生命阶段系数 × 活动系数 × 绝育系数
 * RER = 70 × (体重^0.75)
 */
export function calculateDER(cat: Cat): number {
  const rer = RER_FACTOR * Math.pow(cat.weight, 0.75);
  const lifeStageMultiplier = LIFE_STAGE_MULTIPLIERS[cat.lifeStage];
  const activityMultiplier = ACTIVITY_MULTIPLIERS[cat.activityLevel];
  const neuteredMultiplier = cat.isNeutered ? NEUTERED_FACTOR : 1.0;
  
  return rer * lifeStageMultiplier * activityMultiplier * neuteredMultiplier;
}

/**
 * 计算每日营养需求
 */
export function calculateDailyRequirement(cat: Cat): DailyNutritionRequirement {
  const der = calculateDER(cat);
  const lifeStage = cat.lifeStage;
  
  // 基础营养需求计算
  const protein = (der / 100) * PROTEIN_REQUIREMENTS[lifeStage];
  const fat = (der / 100) * FAT_REQUIREMENTS[lifeStage];
  
  return {
    catId: cat.id,
    der,
    protein,
    fat,
    carbohydrate: der * 0.01, // 猫对碳水需求很低
    calcium: der * 0.18,     // 180mg/100kcal
    phosphorus: der * 0.15,  // 150mg/100kcal
    magnesium: der * 0.015,  // 15mg/100kcal
    potassium: der * 0.15,    // 150mg/100kcal
    sodium: der * 0.08,       // 80mg/100kcal
    taurine: der * 0.025,    // 25mg/100kcal (最低)
    vitamin_a: der * 9.4,    // 9.4 IU/100kcal
    vitamin_d: der * 0.06,   // 0.06 IU/100kcal
    vitamin_e: der * 0.025,  // 0.025 mg/100kcal
  };
}

/**
 * 计算食材的代谢能 (kcal/100g)
 */
export function calculateIngredientEnergy(ingredient: Ingredient): number {
  const { protein, fat, carbohydrate } = ingredient.nutritionPer100g;
  return (protein * ENERGY_FACTORS.protein) +
         (fat * ENERGY_FACTORS.fat) +
         (carbohydrate * ENERGY_FACTORS.carbohydrate);
}

/**
 * 计算配方的营养分析
 */
export function analyzeRecipe(
  recipe: Recipe,
  ingredients: Map<string, Ingredient>
): RecipeNutritionAnalysis {
  let totalEnergy = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbohydrate = 0;
  let totalMoisture = 0;
  let totalAsh = 0;
  let totalCalcium = 0;
  let totalPhosphorus = 0;
  let totalMagnesium = 0;
  let totalPotassium = 0;
  let totalSodium = 0;
  let totalTaurine = 0;
  let totalVitaminA = 0;
  let totalVitaminD = 0;
  let totalVitaminE = 0;
  
  for (const item of recipe.ingredients) {
    const ingredient = ingredients.get(item.ingredientId);
    if (!ingredient) continue;
    
    const weight = item.weight;
    const ratio = weight / 100; // 转换为100g的倍数
    const nutrition = ingredient.nutritionPer100g;
    
    totalEnergy += calculateIngredientEnergy(ingredient) * ratio;
    totalProtein += nutrition.protein * ratio;
    totalFat += nutrition.fat * ratio;
    totalCarbohydrate += nutrition.carbohydrate * ratio;
    totalMoisture += nutrition.moisture * ratio;
    totalAsh += nutrition.ash * ratio;
    totalCalcium += nutrition.calcium * ratio;
    totalPhosphorus += nutrition.phosphorus * ratio;
    totalMagnesium += nutrition.magnesium * ratio;
    totalPotassium += nutrition.potassium * ratio;
    totalSodium += nutrition.sodium * ratio;
    totalTaurine += (nutrition.taurine || 0) * ratio;
    totalVitaminA += (nutrition.vitamin_a || 0) * ratio;
    totalVitaminD += (nutrition.vitamin_d || 0) * ratio;
    totalVitaminE += (nutrition.vitamin_e || 0) * ratio;
  }
  
  const dryMatterWeight = recipe.totalWeight - totalMoisture;
  
  // 计算干物质占比
  const proteinDmPercent = dryMatterWeight > 0 ? (totalProtein / dryMatterWeight) * 100 : 0;
  const fatDmPercent = dryMatterWeight > 0 ? (totalFat / dryMatterWeight) * 100 : 0;
  const carbohydrateDmPercent = dryMatterWeight > 0 ? (totalCarbohydrate / dryMatterWeight) * 100 : 0;
  
  return {
    recipeId: recipe.id,
    totalWeight: recipe.totalWeight,
    dryMatterWeight,
    energy: totalEnergy,
    protein: totalProtein,
    fat: totalFat,
    carbohydrate: totalCarbohydrate,
    moisture: totalMoisture,
    calcium: totalCalcium,
    phosphorus: totalPhosphorus,
    caP_ratio: totalPhosphorus > 0 ? totalCalcium / totalPhosphorus : 0,
    magnesium: totalMagnesium,
    potassium: totalPotassium,
    sodium: totalSodium,
    taurine: totalTaurine,
    vitamin_a: totalVitaminA,
    vitamin_d: totalVitaminD,
    vitamin_e: totalVitaminE,
    proteinDmPercent,
    fatDmPercent,
    carbohydrateDmPercent,
  };
}

/**
 * 对比营养需求与实际摄入
 */
export function compareNutrition(
  requirement: DailyNutritionRequirement,
  actual: RecipeNutritionAnalysis
): NutritionComparison {
  const ratios = {
    protein: requirement.protein > 0 ? (actual.protein / requirement.protein) : 0,
    fat: requirement.fat > 0 ? (actual.fat / requirement.fat) : 0,
    calcium: requirement.calcium > 0 ? (actual.calcium / requirement.calcium) : 0,
    phosphorus: requirement.phosphorus > 0 ? (actual.phosphorus / requirement.phosphorus) : 0,
    taurine: requirement.taurine > 0 ? (actual.taurine / requirement.taurine) : 0,
    energy: requirement.der > 0 ? (actual.energy / requirement.der) : 0,
  };
  
  const warnings: string[] = [];
  
  // 检查营养不足
  if (ratios.protein < 0.8) warnings.push('蛋白质含量不足，建议增加肉类');
  if (ratios.fat < 0.8) warnings.push('脂肪含量不足');
  if (ratios.taurine < 1.0) warnings.push('牛磺酸不足，建议添加心脏或补充剂');
  if (ratios.calcium < 0.8) warnings.push('钙含量不足，建议添加骨骼或钙粉');
  if (ratios.phosphorus < 0.8) warnings.push('磷含量不足');
  
  // 检查营养过量
  if (ratios.protein > 1.5) warnings.push('蛋白质含量过高');
  if (ratios.fat > 1.5) warnings.push('脂肪含量过高');
  
  // 检查钙磷比
  if (actual.caP_ratio < 1.0) warnings.push('钙磷比偏低，理想范围为1.0-1.5:1');
  if (actual.caP_ratio > 2.0) warnings.push('钙磷比偏高，理想范围为1.0-1.5:1');
  
  // 检查水分
  const moisturePercent = (actual.moisture / actual.totalWeight) * 100;
  if (moisturePercent < 60) warnings.push('水分含量偏低，建议增加水分摄入');
  
  return {
    requirement,
    actual,
    ratios,
    warnings,
  };
}

/**
 * 计算建议喂食量
 * @param dailyEnergy 每日能量需求
 * @param recipeEnergy 配方能量密度 (kcal/100g)
 */
export function calculateFeedingAmount(
  dailyEnergy: number,
  recipeEnergy: number
): number {
  if (recipeEnergy <= 0) return 0;
  return (dailyEnergy / recipeEnergy) * 100; // 返回克数
}

/**
 * 验证配方完整性
 * 检查是否包含必需的食材类别
 */
export function validateRecipe(
  recipe: Recipe,
  ingredients: Map<string, Ingredient>
): { valid: boolean; missing: string[] } {
  const hasCategory = (category: string) => 
    recipe.ingredients.some(item => {
      const ing = ingredients.get(item.ingredientId);
      return ing?.category === category;
    });
  
  const missing: string[] = [];
  
  if (!hasCategory('meat')) missing.push('肌肉肉类');
  if (!hasCategory('organ')) missing.push('内脏');
  if (!hasCategory('bone') && !hasCategory('supplement')) {
    missing.push('骨骼或钙补充剂');
  }
  
  return {
    valid: missing.length === 0,
    missing,
  };
}
