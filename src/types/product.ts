// Define the category type
export type Category = "burgers" | "sides" | "drinks" | "desserts";
export type CategoryFilter = Category | "all";

// Define the product type 
export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    category: Category;
    image: string;
    rating?: number;
    reviews?: number;
    badge?: string;
    stock: number;
}

// Type of cart item
export type CartItem = Product & {
    quantity: number;
};