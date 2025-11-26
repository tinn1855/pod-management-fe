export type Product = {
  id: string;
  thumbnail: string;
  name: string;
  sku?: string;
  category: string;
  sizes: string[];
  colors: string[];
  price: number;
  status: "in stock" | "out of stock" | "discontinued";
  updatedAt: string;
  description?: string;
};
