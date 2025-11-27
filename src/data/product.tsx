import { Product } from "@/type/product";

// ============================================
// PRODUCT DATA GENERATORS
// ============================================

const productCategories = [
  "T-Shirts", "Hoodies", "Shirts", "Polo Shirts", "Sweaters", "Jackets",
  "Pants", "Shorts", "Shoes", "Bags", "Accessories", "Sportswear",
  "Mugs", "Posters", "Canvas", "Stickers", "Phone Cases", "Hats"
];

const productNames: Record<string, string[]> = {
  "T-Shirts": ["Basic Tee", "Premium Cotton Tee", "Vintage Wash Tee", "Graphic Tee", "V-Neck Tee", "Oversized Tee"],
  "Hoodies": ["Classic Hoodie", "Zip-Up Hoodie", "Oversized Hoodie", "Cropped Hoodie", "Tech Fleece Hoodie"],
  "Shirts": ["Oxford Shirt", "Linen Shirt", "Flannel Shirt", "Denim Shirt", "Hawaiian Shirt"],
  "Polo Shirts": ["Classic Polo", "Slim Fit Polo", "Performance Polo", "Pique Polo"],
  "Sweaters": ["Crewneck Sweater", "Cardigan", "Turtleneck", "Cable Knit Sweater"],
  "Jackets": ["Bomber Jacket", "Denim Jacket", "Windbreaker", "Track Jacket", "Varsity Jacket"],
  "Pants": ["Slim Jeans", "Straight Jeans", "Chinos", "Cargo Pants", "Joggers"],
  "Shorts": ["Cargo Shorts", "Athletic Shorts", "Board Shorts", "Chino Shorts"],
  "Shoes": ["Sneakers", "Running Shoes", "Canvas Shoes", "Slip-Ons", "High Tops"],
  "Bags": ["Tote Bag", "Backpack", "Crossbody Bag", "Messenger Bag", "Duffle Bag"],
  "Accessories": ["Baseball Cap", "Beanie", "Belt", "Scarf", "Sunglasses", "Watch"],
  "Sportswear": ["Tank Top", "Running Tee", "Compression Shirt", "Sports Bra", "Yoga Pants"],
  "Mugs": ["Classic Mug", "Travel Mug", "Color Changing Mug", "Enamel Mug"],
  "Posters": ["Art Print", "Photo Print", "Typography Poster", "Motivational Poster"],
  "Canvas": ["Gallery Wrap Canvas", "Framed Canvas", "Multi-Panel Canvas"],
  "Stickers": ["Vinyl Sticker", "Sticker Pack", "Die-Cut Sticker", "Holographic Sticker"],
  "Phone Cases": ["Slim Case", "Tough Case", "Clear Case", "Wallet Case"],
  "Hats": ["Snapback", "Dad Hat", "Trucker Cap", "Bucket Hat", "Visor"],
};

const colors = [
  "Black", "White", "Navy", "Gray", "Red", "Blue", "Green", "Yellow",
  "Orange", "Purple", "Pink", "Beige", "Brown", "Olive", "Burgundy", "Teal"
];

const sizes: Record<string, string[]> = {
  clothing: ["XS", "S", "M", "L", "XL", "2XL", "3XL"],
  shoes: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
  oneSize: ["One Size"],
  canvas: ["8x10", "12x16", "16x20", "18x24", "24x36"],
  mug: ["11oz", "15oz"],
};

const statusOptions: Array<"in stock" | "out of stock" | "discontinued"> = [
  "in stock", "in stock", "in stock", "in stock", "out of stock", "discontinued"
];

const thumbnails = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
  "https://images.unsplash.com/photo-1556906781-9a412961c28c",
  "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
  "https://images.unsplash.com/photo-1534126511673-b6899657816a",
  "https://images.unsplash.com/photo-1602810316498-d8f7f6c88f65",
  "https://images.unsplash.com/photo-1512436991641-6745cdb1723f",
  "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
  "https://images.unsplash.com/photo-1600185365929-3b1dfc84a2c6",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c",
  "https://images.unsplash.com/photo-1523381294911-8d3cead13475",
  "https://images.unsplash.com/photo-1556906781-9a412961c28c",
  "https://images.unsplash.com/photo-1503078794009-7c1e6b2e1e12",
  "https://images.unsplash.com/photo-1550246140-29f40b909e5a",
  "https://images.unsplash.com/photo-1606890737304-57a1ca8a5b07",
  "https://images.unsplash.com/photo-1490481651871-ab68de25d43d",
  "https://images.unsplash.com/photo-1530845644570-1b25eba1efed",
  "https://images.unsplash.com/photo-1542060749-10c28b62716c",
  "https://images.unsplash.com/photo-1514996937319-344454492b37",
  "https://images.unsplash.com/photo-1551024709-8f23befc6f87",
  "https://images.unsplash.com/photo-1576566588028-4147f384b32b",
  "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd",
  "https://images.unsplash.com/photo-1544816155-12df9643f363",
  "https://images.unsplash.com/photo-1535591273668-578e31182c4f",
  "https://images.unsplash.com/photo-1541961017774-22349e4a1262",
];

function getSizesByCategory(category: string): string[] {
  if (["T-Shirts", "Hoodies", "Shirts", "Polo Shirts", "Sweaters", "Jackets", "Pants", "Shorts", "Sportswear"].includes(category)) {
    return sizes.clothing.slice(Math.floor(Math.random() * 2), Math.floor(Math.random() * 3) + 5);
  }
  if (category === "Shoes") {
    return sizes.shoes.slice(Math.floor(Math.random() * 3), Math.floor(Math.random() * 4) + 6);
  }
  if (category === "Canvas" || category === "Posters") {
    return sizes.canvas.slice(0, Math.floor(Math.random() * 2) + 3);
  }
  if (category === "Mugs") {
    return sizes.mug;
  }
  return sizes.oneSize;
}

function generateRandomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return date.toISOString().split("T")[0];
}

function generateProduct(index: number): Product {
  const category = productCategories[index % productCategories.length];
  const categoryNames = productNames[category] || ["Item"];
  const baseName = categoryNames[index % categoryNames.length];
  const variant = index % 5 === 0 ? "Premium" : index % 3 === 0 ? "Classic" : "";
  const name = variant ? `${variant} ${baseName}` : baseName;
  
  const selectedColors = colors.slice(
    index % colors.length,
    (index % colors.length) + Math.floor(Math.random() * 4) + 1
  );
  
  const basePrice = category === "Canvas" || category === "Shoes" || category === "Jackets"
    ? 45 + Math.floor(Math.random() * 50)
    : category === "Stickers"
    ? 5 + Math.floor(Math.random() * 10)
    : category === "Mugs"
    ? 12 + Math.floor(Math.random() * 15)
    : 18 + Math.floor(Math.random() * 35);

  return {
    id: `p${index + 1}`,
    thumbnail: thumbnails[index % thumbnails.length],
    name,
    sku: `${category.toUpperCase().replace(/\s/g, "-").slice(0, 6)}-${String(index + 1).padStart(3, "0")}`,
    category,
    sizes: getSizesByCategory(category),
    colors: selectedColors.length > 0 ? selectedColors : [colors[0]],
    price: basePrice,
    status: statusOptions[index % statusOptions.length],
    updatedAt: generateRandomDate(new Date("2024-06-01"), new Date("2024-11-27")),
  };
}

// Generate 100 products
export const mockProducts: Product[] = Array.from({ length: 100 }, (_, i) => generateProduct(i));
