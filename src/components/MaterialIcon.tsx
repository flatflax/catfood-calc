/**
 * Material Icons 组件
 * https://fonts.google.com/icons
 */

interface MaterialIconProps {
  name: string;
  className?: string;
  style?: React.CSSProperties;
  filled?: boolean;
}

export function MaterialIcon({ name, className = '', style, filled = true }: MaterialIconProps) {
  return (
    <span 
      className={`material-icons${filled ? '' : '-outlined'} ${className}`}
      style={style}
    >
      {name}
    </span>
  );
}

// 图标映射表
export const Icons = {
  // 导航
  calculator: 'calculate',
  recipes: 'menu_book',
  cats: 'pets',
  ingredients: 'restaurant',
  
  // 食材分类
  redMeat: 'set_meal',
  whiteMeat: 'egg_alt',
  organ: 'psychology',
  bone: 'kebab_dining',
  supplement: 'medication',
  other: 'inventory_2',
  
  // 操作
  add: 'add',
  edit: 'edit',
  delete: 'delete',
  save: 'save',
  close: 'close',
  check: 'check',
  clear: 'clear',
  export: 'ios_share',
  filter: 'filter_list',
  search: 'search',
  menu: 'menu',
  more: 'more_vert',
  
  // 状态
  warning: 'warning',
  error: 'error',
  success: 'check_circle',
  info: 'info',
  
  // 营养
  protein: 'fitness_center',
  fat: 'water_drop',
  energy: 'bolt',
  weight: 'scale',
  cost: 'attach_money',
  
  // 其他
  cat: 'pets',
  home: 'home',
  settings: 'settings',
  help: 'help',
  arrowBack: 'arrow_back',
  arrowForward: 'arrow_forward',
} as const;
