export interface ProductVariant {
  id: string;
  size: string;
  color: string;
  price: number;
  stock?: number;
}

export type Product = {
  id: string;
  name: string;
  description: string;
  categoryId: number;
  price: number;
  images: string[];
  variations: {
    sizes: string[];
    colors: string[];
  };
  mockups: string[];
  isActive: boolean;
  updatedAt: string;
};

