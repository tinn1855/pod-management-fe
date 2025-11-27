// ============================================
// PAGINATION
// ============================================

export const ITEMS_PER_PAGE = 10;

// ============================================
// DATE FORMATS
// ============================================

export const DATE_FORMAT = {
  SHORT: "dd/MM/yyyy",
  LONG: "dd/MM/yyyy HH:mm",
  FULL: "dd MMM yyyy, HH:mm",
  ISO: "yyyy-MM-dd",
} as const;

// ============================================
// CURRENCY
// ============================================

export const DEFAULT_CURRENCY = "USD";

export const CURRENCY_LOCALE = "en-US";

/**
 * Format a number as USD currency: $1,234,567.89
 * @param amount - The number to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: "currency",
    currency: DEFAULT_CURRENCY,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a number with thousand separators: 1,234,567
 * @param value - The number to format
 * @returns Formatted number string
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat(CURRENCY_LOCALE).format(value);
};

// ============================================
// STATUS COLORS (Tailwind classes)
// ============================================

export const USER_STATUS_COLORS = {
  active: "bg-green-500/10 text-green-600",
  inactive: "bg-gray-500/10 text-gray-600",
  pending: "bg-amber-500/10 text-amber-600",
} as const;

export const PRODUCT_STATUS_COLORS = {
  "in stock": "bg-green-500/10 text-green-600",
  "out of stock": "bg-red-500/10 text-red-600",
  discontinued: "bg-gray-500/10 text-gray-600",
} as const;

// ============================================
// ROLE COLORS (Tailwind classes)
// ============================================

export const ROLE_COLORS = {
  admin: { bg: "bg-red-600/20", text: "text-red-600", color: "bg-red-600" },
  seller: { bg: "bg-blue-600/20", text: "text-blue-600", color: "bg-blue-600" },
  designer: {
    bg: "bg-purple-600/20",
    text: "text-purple-600",
    color: "bg-purple-600",
  },
  supplier: {
    bg: "bg-green-600/20",
    text: "text-green-600",
    color: "bg-green-600",
  },
} as const;

// ============================================
// COLOR OPTIONS (for role color picker)
// ============================================

export const COLOR_OPTIONS = [
  {
    name: "Red",
    value: "red",
    bg: "bg-red-500",
    text: "text-red-500",
    bgLight: "bg-red-500/20",
  },
  {
    name: "Blue",
    value: "blue",
    bg: "bg-blue-500",
    text: "text-blue-500",
    bgLight: "bg-blue-500/20",
  },
  {
    name: "Green",
    value: "green",
    bg: "bg-green-500",
    text: "text-green-500",
    bgLight: "bg-green-500/20",
  },
  {
    name: "Purple",
    value: "purple",
    bg: "bg-purple-500",
    text: "text-purple-500",
    bgLight: "bg-purple-500/20",
  },
  {
    name: "Orange",
    value: "orange",
    bg: "bg-orange-500",
    text: "text-orange-500",
    bgLight: "bg-orange-500/20",
  },
  {
    name: "Gray",
    value: "gray",
    bg: "bg-gray-500",
    text: "text-gray-500",
    bgLight: "bg-gray-500/20",
  },
  {
    name: "Cyan",
    value: "cyan",
    bg: "bg-cyan-500",
    text: "text-cyan-500",
    bgLight: "bg-cyan-500/20",
  },
  {
    name: "Pink",
    value: "pink",
    bg: "bg-pink-500",
    text: "text-pink-500",
    bgLight: "bg-pink-500/20",
  },
] as const;

export type ColorOption = (typeof COLOR_OPTIONS)[number];

// Helper to get color classes by value
export const getColorClasses = (colorValue: string | undefined) => {
  const color = COLOR_OPTIONS.find((c) => c.value === colorValue);
  return color || COLOR_OPTIONS[1]; // Default to blue
};

// ============================================
// IDEA STATUS
// ============================================

export const IDEA_STATUS_COLORS = {
  new: {
    bg: "bg-blue-500/10",
    text: "text-blue-600",
    border: "border-blue-500",
  },
  approved: {
    bg: "bg-green-500/10",
    text: "text-green-600",
    border: "border-green-500",
  },
  in_progress: {
    bg: "bg-amber-500/10",
    text: "text-amber-600",
    border: "border-amber-500",
  },
  completed: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-600",
    border: "border-emerald-500",
  },
  rejected: {
    bg: "bg-red-500/10",
    text: "text-red-600",
    border: "border-red-500",
  },
} as const;

// ============================================
// DESIGN STATUS
// ============================================

export const DESIGN_STATUS_COLORS = {
  draft: { bg: "bg-gray-500/10", text: "text-gray-600" },
  pending_review: { bg: "bg-amber-500/10", text: "text-amber-600" },
  approved: { bg: "bg-green-500/10", text: "text-green-600" },
  rejected: { bg: "bg-red-500/10", text: "text-red-600" },
  revision: { bg: "bg-violet-500/10", text: "text-violet-600" },
} as const;

// ============================================
// TASK STATUS
// ============================================

export const TASK_STATUS_COLORS = {
  todo: { bg: "bg-gray-500/10", text: "text-gray-600" },
  in_progress: { bg: "bg-blue-500/10", text: "text-blue-600" },
  review: { bg: "bg-amber-500/10", text: "text-amber-600" },
  done: { bg: "bg-green-500/10", text: "text-green-600" },
} as const;

// ============================================
// TASK PRIORITY
// ============================================

export const TASK_PRIORITY_COLORS = {
  low: { bg: "bg-gray-500/10", text: "text-gray-600" },
  medium: { bg: "bg-blue-500/10", text: "text-blue-600" },
  high: { bg: "bg-amber-500/10", text: "text-amber-600" },
  urgent: { bg: "bg-red-500/10", text: "text-red-600" },
} as const;

// ============================================
// PRODUCTION STATUS
// ============================================

export const PRODUCTION_STATUS_COLORS = {
  queued: { bg: "bg-gray-500/10", text: "text-gray-600" },
  printing: { bg: "bg-blue-500/10", text: "text-blue-600" },
  quality_check: { bg: "bg-amber-500/10", text: "text-amber-600" },
  packing: { bg: "bg-violet-500/10", text: "text-violet-600" },
  shipped: { bg: "bg-green-500/10", text: "text-green-600" },
} as const;

// ============================================
// ACTIVITY LOG COLORS
// ============================================

export const ACTIVITY_TYPE_COLORS = {
  create: { bg: "bg-green-500/10", text: "text-green-600" },
  update: { bg: "bg-blue-500/10", text: "text-blue-600" },
  delete: { bg: "bg-red-500/10", text: "text-red-600" },
  login: { bg: "bg-violet-500/10", text: "text-violet-600" },
  logout: { bg: "bg-gray-500/10", text: "text-gray-600" },
} as const;

// ============================================
// LISTING STATUS
// ============================================

export const LISTING_STATUS_COLORS = {
  active: { bg: "bg-green-500/10", text: "text-green-600" },
  inactive: { bg: "bg-gray-500/10", text: "text-gray-600" },
  draft: { bg: "bg-amber-500/10", text: "text-amber-600" },
} as const;
