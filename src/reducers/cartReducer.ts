// Import libraries
import { products } from "@/data/products";
import { CartItem, Product } from "@/types/product";

// Define the Actions
export type CartActions = 
    { type: "add-to-cart", payload: { item: Product } } |
    { type: "remove-from-cart", payload: { id: Product['id'] } } | 
    { type: "decrease-quantity", payload: { id: Product['id'] } } | 
    { type: "increase-quantity", payload: { id: Product['id'] } } | 
    { type: "clear-cart" } | 
    { type: "load-cart", payload: { cart: CartItem[] } }
    
// Define the state from cart
export type CartState = {
    data: Product[],
    cart: CartItem[]
}

// Initialize the initial state
export const initialState : CartState = {
    data: products,
    cart: [],
}

// Declare the maximum and minimum quantity to add
export const max_items = 6;

// Reducer (pure function: same input, same output, no side effects)
export const cartReducer = (state: CartState = initialState, action: CartActions) => {
    // Delcare a variable to update the cart
    let updateCart : CartItem[] = [];

    // Action add to cart
    if(action.type === "add-to-cart") {
        const itemExist = state.cart.find(product => product.id === action.payload.item.id);
        if(itemExist) {
            updateCart = state.cart.map( item => {
                if(item.id === action.payload.item.id) {
                    if(item.quantity < max_items) {
                        return { ...item, quantity: item.quantity + 1 }
                    } else {
                        return item;
                    }
                } else {
                    return item;
                }
            });
        } else {
            const newItem : CartItem = { ...action.payload.item, quantity: 1 }
            updateCart = [ ...state.cart, newItem ];
        }
        
        return {
            ...state,
            cart: updateCart,
        }
    }

    // Action remove from cart
    if(action.type === "remove-from-cart") {
        return {
            ...state,
            cart: state.cart.filter(item => item.id !== action.payload.id),
        }
    }
    
    // Action decrease quantity 
    if(action.type === "decrease-quantity") {
        const updateCart = state.cart.map(item => 
            item.id === action.payload.id 
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        // When it reaches 0, it leaves the cart
        .filter(item => item.quantity > 0);

        return {
            ...state,
            cart: updateCart,
        }
    }

    // Action increase quantity
    if(action.type === "increase-quantity") {
        const cart = state.cart.map(item => { 
            if(item.id === action.payload.id && item.quantity < max_items) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        });
        return {
            ...state,
            cart
        }
    }

    // Action clear cart
    if(action.type === "clear-cart") {
        return {
            ...state,
            cart: []
        }
    }

    // Action load cart (from localStorage)
    if(action.type === "load-cart") {
        return {
            ...state,
            cart: action.payload.cart
        }
    }
    return state;
}