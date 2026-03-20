/**
 * 猫饭计算器 - 核心类型定义
 * 基于 NRC (National Research Council) 猫咪营养标准
 */

// ==================== 基础枚举 ====================

/** 猫咪生命阶段 */
export enum LifeStage {
  KITTEN = 'kitten',           // 幼猫 (0-12月)
  ADULT = 'adult',             // 成猫 (1-7岁)
  SENIOR = 'senior',           // 老年猫 (7岁+)
  PREGNANT = 'pregnant',       // 怀孕期
  LACTATING = 'lactating',     // 哺乳期
}

/** 活动水平 */
export enum ActivityLevel {
  SEDENTARY = 'sedentary',     // 低活动量 (室内猫)
  MODERATE = 'moderate',       // 中等活动量
  ACTIVE = 'active',           // 高活动量
}

/** 食材分类 */
export enum IngredientCategory {
  RED_MEAT = 'red_meat',       // 红肉 (牛、羊、猪)
  WHITE_MEAT = 'white_meat',   // 白肉 (鸡、鸭、兔、火鸡)
  ORGAN = 'organ',             // 内脏
  BONE = 'bone',               // 骨骼
  SUPPLEMENT = 'supplement',   // 营养添加剂
  OTHER = 'other',             // 其他
}

/** 营养成分类型 */
export enum NutrientType {
  PROTEIN = 'protein',         // 蛋白质
  FAT = 'fat',                 // 脂肪
  CARBOHYDRATE = 'carbohydrate', // 碳水化合物
  FIBER = 'fiber',             // 纤维
  CALCIUM = 'calcium',         // 钙
  PHOSPHORUS = 'phosphorus',   // 磷
  MAGNESIUM = 'magnesium',     // 镁
  POTASSIUM = 'potassium',     // 钾
  SODIUM = 'sodium',           // 钠
  VITAMIN_A = 'vitamin_a',     // 维生素A
  VITAMIN_D = 'vitamin_d',     // 维生素D
  VITAMIN_E = 'vitamin_e',     // 维生素E
  VITAMIN_B1 = 'vitamin_b1',   // 维生素B1
  VITAMIN_B2 = 'vitamin_b2',   // 维生素B2
  VITAMIN_B6 = 'vitamin_b6',   // 维生素B6
  VITAMIN_B12 = 'vitamin_b12', // 维生素B12
  NIACIN = 'niacin',           // 烟酸
  TAURINE = 'taurine',         // 牛磺酸
  OMEGA_3 = 'omega_3',         // Omega-3
  OMEGA_6 = 'omega_6',         // Omega-6
}

// ==================== 核心数据模型 ====================

/** 营养成分含量 (每100g) */
export interface NutritionPer100g {
  protein: number;              // 蛋白质 (g)
  fat: number;                  // 脂肪 (g)
  carbohydrate: number;         // 碳水化合物 (g)
  fiber: number;                // 纤维 (g)
  moisture: number;             // 水分 (g)
  ash: number;                  // 灰分 (g)
  calcium: number;              // 钙 (mg)
  phosphorus: number;           // 磷 (mg)
  magnesium: number;            // 镁 (mg)
  potassium: number;            // 钾 (mg)
  sodium: number;               // 钠 (mg)
  vitamin_a?: number;           // 维生素A (IU)
  vitamin_d?: number;           // 维生素D (IU)
  vitamin_e?: number;           // 维生素E (mg)
  vitamin_b1?: number;          // 维生素B1 (mg)
  vitamin_b2?: number;          // 维生素B2 (mg)
  vitamin_b6?: number;          // 维生素B6 (mg)
  vitamin_b12?: number;         // 维生素B12 (μg)
  niacin?: number;              // 烟酸 (mg)
  taurine?: number;             // 牛磺酸 (mg)
  omega_3?: number;             // Omega-3 (g)
  omega_6?: number;             // Omega-6 (g)
}

/** 食材/原料 */
export interface Ingredient {
  id: string;
  name: string;                 // 名称
  category: IngredientCategory; // 分类
  nutritionPer100g: NutritionPer100g; // 营养成分(每100g)
  ediblePortion: number;        // 可食部比例 (0-1)
  pricePerKg: number;           // 每公斤价格 (元)
  note?: string;                // 备注
  isDefault: boolean;           // 是否默认食材
  createdAt: number;
  updatedAt: number;
}

/** 配方中的食材项 */
export interface RecipeIngredient {
  ingredientId: string;
  weight: number;               // 重量 (g)
}

/** 猫饭配方 */
export interface Recipe {
  id: string;
  name: string;                 // 配方名称
  description?: string;         // 描述
  ingredients: RecipeIngredient[]; // 食材列表
  totalWeight: number;          // 总重量 (g)
  targetCatId?: string;         // 目标猫咪ID
  isDefault: boolean;           // 是否默认配方
  createdAt: number;
  updatedAt: number;
}

/** 猫咪信息 */
export interface Cat {
  id: string;
  name: string;                 // 名字
  weight: number;               // 体重 (kg)
  lifeStage: LifeStage;         // 生命阶段
  activityLevel: ActivityLevel; // 活动水平
  isNeutered: boolean;          // 是否绝育
  targetBodyCondition?: 'underweight' | 'ideal' | 'overweight'; // 目标体型
  note?: string;                // 备注
  photo?: string;               // 照片路径
  createdAt: number;
  updatedAt: number;
}

/** 每日营养需求计算结果 */
export interface DailyNutritionRequirement {
  catId: string;
  der: number;                  // 每日能量需求 (kcal)
  protein: number;              // 蛋白质 (g)
  fat: number;                  // 脂肪 (g)
  carbohydrate: number;         // 碳水化合物 (g)
  calcium: number;              // 钙 (mg)
  phosphorus: number;           // 磷 (mg)
  magnesium: number;            // 镁 (mg)
  potassium: number;          // 钾 (mg)
  sodium: number;               // 钠 (mg)
  taurine: number;              // 牛磺酸 (mg)
  vitamin_a?: number;           // 维生素A (IU)
  vitamin_d?: number;           // 维生素D (IU)
  vitamin_e?: number;           // 维生素E (mg)
}

/** 配方营养分析结果 */
export interface RecipeNutritionAnalysis {
  recipeId: string;
  totalWeight: number;          // 总重量 (g)
  dryMatterWeight: number;      // 干物质重量 (g)
  energy: number;               // 总能量 (kcal)
  protein: number;              // 蛋白质 (g)
  fat: number;                  // 脂肪 (g)
  carbohydrate: number;         // 碳水化合物 (g)
  moisture: number;             // 水分 (g)
  calcium: number;              // 钙 (mg)
  phosphorus: number;           // 磷 (mg)
  caP_ratio: number;            // 钙磷比
  magnesium: number;            // 镁 (mg)
  potassium: number;            // 钾 (mg)
  sodium: number;               // 钠 (mg)
  taurine: number;              // 牛磺酸 (mg)
  vitamin_a?: number;           // 维生素A (IU)
  vitamin_d?: number;           // 维生素D (IU)
  vitamin_e?: number;           // 维生素E (mg)
  // 干物质占比
  proteinDmPercent: number;     // 蛋白质干物质占比
  fatDmPercent: number;         // 脂肪干物质占比
  carbohydrateDmPercent: number; // 碳水干物质占比
}

/** 配方成本分析 */
export interface RecipeCostAnalysis {
  recipeId: string;
  ingredientCosts: Array<{
    ingredientId: string;
    ingredientName: string;
    weight: number;
    cost: number;               // 单项成本
  }>;
  totalCost: number;            // 总成本
  costPer100g: number;          // 每100g成本
  costPerDay: number;           // 每日成本 (基于猫咪食量)
  costPerMonth: number;         // 每月成本
}

/** 营养对比结果 */
export interface NutritionComparison {
  requirement: DailyNutritionRequirement;
  actual: RecipeNutritionAnalysis;
  ratios: {
    protein: number;              // 蛋白质满足率
    fat: number;                // 脂肪满足率
    calcium: number;            // 钙满足率
    phosphorus: number;         // 磷满足率
    taurine: number;            // 牛磺酸满足率
    energy: number;             // 能量满足率
  };
  warnings: string[];           // 营养警告
}

// ==================== 应用状态 ====================

export interface AppState {
  cats: Cat[];
  ingredients: Ingredient[];
  recipes: Recipe[];
  settings: AppSettings;
}

export interface AppSettings {
  currency: 'CNY' | 'USD' | 'EUR';
  weightUnit: 'g' | 'kg' | 'oz' | 'lb';
  language: 'zh-CN' | 'en';
  theme: 'light' | 'dark' | 'auto';
}
