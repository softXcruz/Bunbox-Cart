"use client";

// Import libraries
import { CategoryFilter } from "@/types/product"
import { useEffect, useReducer, useRef, useState } from "react"
import Header from "./Header";
import ProductCard from "./ProductCard";
import { cartReducer, initialState } from "@/reducers/cartReducer";
import { normalizeText } from "@/lib/normaliceText";

// initialize the StoreFront component
export default function Storefront() {
    // Define the catetgory filter state
    const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
    const [query, setQuery] = useState<string>("");

    // Initialize reducer
    const [state, dispatch] = useReducer(cartReducer, initialState);
        
    // Avoid saving the empty cart before the saved one is loaded
    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("bunbox-cart");
        if (saved) {
            try {
                dispatch({ type: "load-cart", payload: { cart: JSON.parse(saved) } });
            } catch {
                localStorage.removeItem("bunbox-cart");
            }
        }
        setHasLoaded(true);
    }, []);

    // Filter products by name, description
    const term = normalizeText(query.trim());

    const filteredProducts = state.data.filter((product) => {
        const matchesCategory =
            activeCategory === "all" || product.category === activeCategory;

        const matchesSearch =
            !term ||
            normalizeText(product.name).includes(term) ||
            normalizeText(product.description).includes(term);

        return matchesCategory && matchesSearch;
    });

    // Save the cart every time it changes
    useEffect(() => {
        if (!hasLoaded) return;
        localStorage.setItem("bunbox-cart", JSON.stringify(state.cart));
    }, [state.cart, hasLoaded]);
    
    return (
        <>  
            <Header
                cart={state.cart}
                dispatch={dispatch}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
                query={query}
                onQueryChange={setQuery}
            />
            
            <main className="mx-auto max-w-6xl px-3 md:px-8 py-8">
                {filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center py-20 text-center">
                        <p className="text-lg font-semibold text-neutral-900 dark:text-white">
                            No products found
                        </p>
                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            {query
                                ? <>We couldn&apos;t find anything for &quot;{query}&quot; in this category.</>
                                : "There are no products in this category."}
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setQuery("");
                                setActiveCategory("all");
                            }}
                            className="mt-5 inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-neutral-900 px-6 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                dispatch={dispatch}
                                quantity={state.cart.find((item) => item.id === product.id)?.quantity ?? 0}
                            />
                        ))}
                    </div>
                )}
            </main>
        </>
    )
}
