# CatFood Calculator 🐱

> A homemade cat food nutrition calculator based on NRC 2006 standards

[中文](./README.zh-CN.md) | English

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Web-lightgrey.svg)

## Features

### 🥩 Ingredient Management
- 20+ preset common ingredients (red meat, white meat, organs, bones, supplements)
- Support custom ingredients and nutrition data
- Category filtering and search

### 🐱 Cat Profiles
- Record multiple cats' information
- Auto-calculate daily nutrition needs based on weight, age, and activity level
- Neutering status adjustment

### ⚖️ Recipe Calculator
- Click to add ingredients
- Real-time nutrition analysis (protein, fat, calcium-phosphorus ratio, taurine, etc.)
- Automatic cost calculation
- Nutrition fulfillment visualization

### 📋 Recipe Management
- Save and export recipes
- Filter recipes by cat
- One-click copy recipe details

## Tech Stack

- **Framework**: React + TypeScript + Vite
- **Cross-platform**: Tauri (Desktop) + PWA (Mobile)
- **State Management**: Zustand
- **UI Design**: Material Design 3
- **Icons**: Google Material Icons

## Installation

```bash
# Clone the project
git clone https://github.com/yourusername/catfood-calc.git
cd catfood-calc

# Install dependencies
npm install

# Development mode
npm run tauri dev

# Build
npm run tauri build
```

## Usage

1. **Add Cat** - Create cat profiles in the "Cats" page
2. **Select Ingredients** - Choose ingredients to compose recipes in the "Calculator" page
3. **View Analysis** - Check nutrition analysis and cost in real-time
4. **Save Recipe** - Save recipes for future use

## Nutrition Standards

Based on the National Research Council (NRC) 2006 "Nutrient Requirements of Dogs and Cats":

- Protein requirement: Adult cats 6.5g/100kcal, Kittens 10g/100kcal
- Fat requirement: Adult cats 2.25g/100kcal, Kittens 4.5g/100kcal
- Calcium-Phosphorus ratio: Ideal range 1:1 to 2:1
- Taurine: Minimum 25mg/100kcal

## Disclaimer

This tool is for reference only and does not constitute professional veterinary advice. Please consult a professional veterinarian for your cat's dietary health.

## License

MIT License
