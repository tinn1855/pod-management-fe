export const PRODUCT_SIZES = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "2XL",
  "3XL",
  "4XL",
  "5XL",
] as const;

export const PRODUCT_COLORS = [
  { name: "White", value: "White", hex: "#FFFFFF" },
  { name: "Black", value: "Black", hex: "#000000" },
  { name: "Red", value: "Red", hex: "#FF0000" },
  { name: "Blue", value: "Blue", hex: "#0000FF" },
  { name: "Green", value: "Green", hex: "#008000" },
  { name: "Yellow", value: "Yellow", hex: "#FFFF00" },
  { name: "Purple", value: "Purple", hex: "#800080" },
  { name: "Pink", value: "Pink", hex: "#FFC0CB" },
  { name: "Orange", value: "Orange", hex: "#FFA500" },
  { name: "Grey", value: "Grey", hex: "#808080" },
  { name: "Navy", value: "Navy", hex: "#000080" },
  { name: "Maroon", value: "Maroon", hex: "#800000" },
] as const;

export const getSize = (size: string) => {
  return PRODUCT_SIZES.find((s) => s === size);
};

export const getColor = (colorName: string) => {
  return PRODUCT_COLORS.find((c) => c.name === colorName);
};
