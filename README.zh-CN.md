# 猫饭计算器 🐱

> 基于 NRC 2006 标准的猫咪自制猫饭营养计算工具

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux%20%7C%20Web-lightgrey.svg)

## 功能特性

### 🥩 食材管理
- 预置 20+ 种常见食材（红肉、白肉、内脏、骨骼、营养添加剂）
- 支持自定义食材和营养成分
- 分类筛选和搜索

### 🐱 猫咪档案
- 记录多只猫咪信息
- 根据体重、年龄、活动量自动计算每日营养需求
- 绝育状态调整

### ⚖️ 配方计算器
- 点击添加食材
- 实时营养分析（蛋白质、脂肪、钙磷比、牛磺酸等）
- 成本自动计算
- 营养满足率可视化

### 📋 配方管理
- 保存和导出配方
- 按猫咪筛选配方
- 一键复制配方详情

## 技术栈

- **框架**: React
- **跨平台**: Tauri (桌面端) + PWA (移动端)
- **状态管理**: Zustand
- **UI 设计**: Material Design 3
- **图标**: Google Material Icons

## 安装运行

```bash
# 克隆项目
git clone https://github.com/yourusername/catfood-calc.git
cd catfood-calc

# 安装依赖
npm install

# 开发模式
npm run tauri dev

# 构建
npm run tauri build
```

## 使用说明

1. **添加猫咪** - 在"猫咪"页面创建猫咪档案
2. **选择食材** - 在"计算器"页面选择食材组成配方
3. **查看分析** - 实时查看营养分析和成本
4. **保存配方** - 保存配方供日后使用

## 营养标准

基于美国国家研究委员会 (NRC) 2006 年发布的《猫狗营养需求》标准计算：

- 蛋白质需求：成猫 6.5g/100kcal，幼猫 10g/100kcal
- 脂肪需求：成猫 2.25g/100kcal，幼猫 4.5g/100kcal
- 钙磷比：理想范围 1:1 至 2:1
- 牛磺酸：最低 25mg/100kcal

## 免责声明

本工具仅供参考，不构成专业兽医建议。猫咪的饮食健康请咨询专业兽医。

## 许可证

MIT License
