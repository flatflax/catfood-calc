/**
 * 状态管理
 * 使用 Zustand 进行状态管理
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AppState,
  Cat,
  Ingredient,
  Recipe,
  AppSettings,
  LifeStage,
  ActivityLevel,
  IngredientCategory,
} from '../types';
import { getDefaultIngredients, getSampleCats } from '../utils/defaultData';

// ==================== State 定义 ====================

interface AppStore extends AppState {
  // Actions - Cats
  addCat: (cat: Omit<Cat, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateCat: (id: string, updates: Partial<Cat>) => void;
  deleteCat: (id: string) => void;
  getCat: (id: string) => Cat | undefined;
  
  // Actions - Ingredients
  addIngredient: (ingredient: Omit<Ingredient, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateIngredient: (id: string, updates: Partial<Ingredient>) => void;
  deleteIngredient: (id: string) => void;
  getIngredient: (id: string) => Ingredient | undefined;
  getIngredientsByCategory: (category: IngredientCategory) => Ingredient[];
  resetIngredients: () => void;
  
  // Actions - Recipes
  addRecipe: (recipe: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRecipe: (id: string, updates: Partial<Recipe>) => void;
  deleteRecipe: (id: string) => void;
  getRecipe: (id: string) => Recipe | undefined;
  getRecipesByCat: (catId: string) => Recipe[];
  
  // Actions - Settings
  updateSettings: (settings: Partial<AppSettings>) => void;
  
  // Computed
  ingredientsMap: Map<string, Ingredient>;
}

// ==================== Store 创建 ====================

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      // Initial State
      cats: getSampleCats(),
      ingredients: getDefaultIngredients(),
      recipes: [],
      settings: {
        currency: 'CNY',
        weightUnit: 'g',
        language: 'zh-CN',
        theme: 'auto',
      },
      
      // ==================== Cats Actions ====================
      
      addCat: (catData) => {
        const newCat: Cat = {
          ...catData,
          id: `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          cats: [...state.cats, newCat],
        }));
      },
      
      updateCat: (id, updates) => {
        set((state) => ({
          cats: state.cats.map((cat) =>
            cat.id === id
              ? { ...cat, ...updates, updatedAt: Date.now() }
              : cat
          ),
        }));
      },
      
      deleteCat: (id) => {
        set((state) => ({
          cats: state.cats.filter((cat) => cat.id !== id),
          // 同时删除关联的配方
          recipes: state.recipes.filter((recipe) => recipe.targetCatId !== id),
        }));
      },
      
      getCat: (id) => {
        return get().cats.find((cat) => cat.id === id);
      },
      
      // ==================== Ingredients Actions ====================
      
      addIngredient: (ingredientData) => {
        const newIngredient: Ingredient = {
          ...ingredientData,
          id: `ing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          ingredients: [...state.ingredients, newIngredient],
        }));
      },
      
      updateIngredient: (id, updates) => {
        set((state) => ({
          ingredients: state.ingredients.map((ing) =>
            ing.id === id
              ? { ...ing, ...updates, updatedAt: Date.now() }
              : ing
          ),
        }));
      },
      
      deleteIngredient: (id) => {
        // 不允许删除默认食材
        const ingredient = get().ingredients.find((ing) => ing.id === id);
        if (ingredient?.isDefault) {
          console.warn('Cannot delete default ingredient');
          return;
        }
        set((state) => ({
          ingredients: state.ingredients.filter((ing) => ing.id !== id),
        }));
      },
      
      getIngredient: (id) => {
        return get().ingredients.find((ing) => ing.id === id);
      },
      
      getIngredientsByCategory: (category) => {
        return get().ingredients.filter((ing) => ing.category === category);
      },
      
      resetIngredients: () => {
        set({
          ingredients: getDefaultIngredients(),
        });
      },
      
      // ==================== Recipes Actions ====================
      
      addRecipe: (recipeData) => {
        const newRecipe: Recipe = {
          ...recipeData,
          id: `recipe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          recipes: [...state.recipes, newRecipe],
        }));
      },
      
      updateRecipe: (id, updates) => {
        set((state) => ({
          recipes: state.recipes.map((recipe) =>
            recipe.id === id
              ? { ...recipe, ...updates, updatedAt: Date.now() }
              : recipe
          ),
        }));
      },
      
      deleteRecipe: (id) => {
        set((state) => ({
          recipes: state.recipes.filter((recipe) => recipe.id !== id),
        }));
      },
      
      getRecipe: (id) => {
        return get().recipes.find((recipe) => recipe.id === id);
      },
      
      getRecipesByCat: (catId) => {
        return get().recipes.filter((recipe) => recipe.targetCatId === catId);
      },
      
      // ==================== Settings Actions ====================
      
      updateSettings: (settings) => {
        set((state) => ({
          settings: { ...state.settings, ...settings },
        }));
      },
      
      // ==================== Computed ====================
      
      get ingredientsMap() {
        const map = new Map<string, Ingredient>();
        get().ingredients.forEach((ing) => {
          map.set(ing.id, ing);
        });
        return map;
      },
    }),
    {
      name: 'catfood-calc-storage',
      version: 1,
    }
  )
);

// ==================== Selectors ====================

export const selectCats = (state: AppStore) => state.cats;
export const selectIngredients = (state: AppStore) => state.ingredients;
export const selectRecipes = (state: AppStore) => state.recipes;
export const selectSettings = (state: AppStore) => state.settings;

export const selectCatById = (id: string) => (state: AppStore) =>
  state.cats.find((cat) => cat.id === id);

export const selectIngredientsByCategory = (category: IngredientCategory) =>
  (state: AppStore) =>
    state.ingredients.filter((ing) => ing.category === category);

export const selectRecipesByCat = (catId: string) => (state: AppStore) =>
  state.recipes.filter((recipe) => recipe.targetCatId === catId);
