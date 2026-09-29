// Define category names as constants to avoid duplication
const CATEGORIES = {
  // Expense categories
  FOOD: "Food",
  TRANSPORTATION: "Transportation",
  RENT_BILLS: "Rent & Bills",
  SHOPPING: "Shopping",
  TRAVEL: "Travel",
  LEISURE: "Leisure",
  EDUCATION: "Education",
  WELLNESS_BEAUTY: "Wellness and Beauty",
  OTHER: "Other",
  GIFTS: "Gifts",
  // Income categories
  PAYCHECK: "Paycheck",
  GIFT: "Gift",
} as const;

type ColorConfig = {
  /** Solid fill, used for progress segments. */
  bg: string;
  /** Solid border, used for accents. */
  border: string;
  /** Tinted background plus matching icon colour, used for icon tiles. */
  tile: string;
};

const categoryColors: Record<string, ColorConfig> = {
  [CATEGORIES.FOOD]: {
    bg: "bg-emerald-500",
    border: "border-emerald-500",
    tile: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  [CATEGORIES.TRANSPORTATION]: {
    bg: "bg-blue-500",
    border: "border-blue-500",
    tile: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  },
  [CATEGORIES.RENT_BILLS]: {
    bg: "bg-purple-500",
    border: "border-purple-500",
    tile: "bg-purple-500/15 text-purple-600 dark:text-purple-400",
  },
  [CATEGORIES.SHOPPING]: {
    bg: "bg-pink-500",
    border: "border-pink-500",
    tile: "bg-pink-500/15 text-pink-600 dark:text-pink-400",
  },
  [CATEGORIES.TRAVEL]: {
    bg: "bg-amber-500",
    border: "border-amber-500",
    tile: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
  [CATEGORIES.LEISURE]: {
    bg: "bg-indigo-500",
    border: "border-indigo-500",
    tile: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400",
  },
  [CATEGORIES.EDUCATION]: {
    bg: "bg-cyan-500",
    border: "border-cyan-500",
    tile: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
  },
  [CATEGORIES.WELLNESS_BEAUTY]: {
    bg: "bg-rose-500",
    border: "border-rose-500",
    tile: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  },
  [CATEGORIES.OTHER]: {
    bg: "bg-gray-500",
    border: "border-gray-500",
    tile: "bg-gray-500/15 text-gray-600 dark:text-gray-400",
  },
  [CATEGORIES.GIFTS]: {
    bg: "bg-red-500",
    border: "border-red-500",
    tile: "bg-red-500/15 text-red-600 dark:text-red-400",
  },
  [CATEGORIES.PAYCHECK]: {
    bg: "bg-green-600",
    border: "border-green-600",
    tile: "bg-green-600/15 text-green-700 dark:text-green-400",
  },
  [CATEGORIES.GIFT]: {
    bg: "bg-teal-500",
    border: "border-teal-500",
    tile: "bg-teal-500/15 text-teal-600 dark:text-teal-400",
  },
};

// Default colors for unknown categories
const DEFAULT_COLORS: ColorConfig = {
  bg: "bg-gray-500",
  border: "border-gray-500",
  tile: "bg-gray-500/15 text-gray-600 dark:text-gray-400",
};

export function useCategoryColors() {
  const getCategoryColor = (categoryName: string): string => {
    return categoryColors[categoryName]?.bg || DEFAULT_COLORS.bg;
  };

  const getCategoryBorderColor = (categoryName: string): string => {
    return categoryColors[categoryName]?.border || DEFAULT_COLORS.border;
  };

  const getCategoryTileColor = (categoryName: string): string => {
    return categoryColors[categoryName]?.tile || DEFAULT_COLORS.tile;
  };

  return {
    getCategoryColor,
    getCategoryBorderColor,
    getCategoryTileColor,
  };
}
