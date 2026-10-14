"use client";

// Import libraries
import { Dispatch, SetStateAction, useState } from "react";
import SearchBar from "./SearchBar";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import type { CartItem, CategoryFilter } from "@/types/product";
import { CartActions, max_items } from "@/reducers/cartReducer";
import Image from "next/image";
import { formatPrice } from "@/lib/formatPrice";

// Props types for links
type NavLink = {
    label: string;
    value: CategoryFilter;
}

// Type for panel names
type PanelName = "user" | "cart" | "mobile";

// Type for PanelActivation state
type ActivePanel = PanelName | null;

// Props for header
type HeaderProps = {
    cart: CartItem[];
    dispatch: Dispatch<CartActions>;
    activeCategory: CategoryFilter;
    onCategoryChange: (category: CategoryFilter) => void;
    query: string;
    onQueryChange: (value: string) => void;
}

// Props for PanelSync component
type PanelSyncProps = {
    name: PanelName;
    open: boolean;
    close: () => void;
    activePanel: ActivePanel;
    setActivePanel: Dispatch<SetStateAction<ActivePanel>>;
}

// Initialize the links to navigation
const links: NavLink[] = [
    { label: "All", value: "all" },
    { label: "Burgers", value: "burgers" },
    { label: "Sides", value: "sides" },
    { label: "Drinks", value: "drinks" },
    { label: "Desserts", value: "desserts" },
];

// Initialize the Header component
export default function Header({
    cart,
    dispatch,
    activeCategory,
    onCategoryChange,
    query,
    onQueryChange
}: HeaderProps) {
    // Only one panel can be active at a time
    const [activePanel, setActivePanel] = useState<ActivePanel>(null);

    // Derived values: calculate from the cart, never stored
    const cartCount = cart.length;
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Mobile open menu
    const mobileOpen = activePanel === "mobile";

    const cartOpen = activePanel === "cart";
    const closeCart = () => setActivePanel(null);

    // Toggle the mobile menu open/close
    const toggleMobile = () => setActivePanel(mobileOpen ? null : "mobile");
    const closeMobile = () => setActivePanel(null);

    return (
        <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950">
            <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6">
                {/* Logo */}
                <button
                    type="button"
                    onClick={() => onCategoryChange("all")}
                    aria-label="Bunbox, show all products"
                    className="group flex cursor-pointer items-center gap-2 text-xl font-bold text-neutral-900 dark:text-white"
                >
                    <img src="/logo-delivery.png" alt="" className="size-5 dark:invert" />
                    <span className="text-xl font-bold text-neutral-900 dark:text-white">
                        bun
                        <span className="inline-block -rotate-12 transition-transform duration-300 group-hover:rotate-0">b</span>
                        <span className="inline-block rotate-0 transition-transform duration-300 group-hover:rotate-0">o</span>
                        <span className="inline-block rotate-9 transition-transform duration-300 group-hover:rotate-0">x</span>
                        <span className="text-orange-600">.</span>
                    </span>
                </button>

                {/* Desktop Navigation (category filters) */}
                <nav aria-label="main navigation" className="ml-6 hidden lg:block">
                    <ul className="flex items-center gap-7">
                        {links.map((link) => {
                            const isActive = activeCategory === link.value;

                            return (
                                <li key={link.value}>
                                    <button
                                        type="button"
                                        onClick={() => onCategoryChange(link.value)}
                                        aria-pressed={isActive}
                                        className={`relative cursor-pointer py-1 text-[13px] font-medium uppercase transition-colors duration-200 hover:text-orange-600 after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full after:origin-left after:bg-orange-600 after:transition-transform after:duration-300 after:content-[''] dark:hover:text-orange-500 ${isActive
                                            ? "text-orange-600 after:scale-x-100 dark:text-orange-500"
                                            : "text-neutral-800 after:scale-x-0 hover:after:scale-x-100 dark:text-neutral-50"
                                            }`}
                                    >
                                        {link.label}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Search bar */}
                <SearchBar
                    query={query}
                    setQuery={onQueryChange}
                    className="ml-auto hidden w-full max-w-72 lg:block"
                />

                {/* Actions */}
                <div className="ml-auto flex items-center gap-3 lg:ml-0">
                    {/* Button toggle theme */}
                    <ThemeToggle />

                    {/* Cart button */}
                    <button
                        type="button"
                        onClick={() => setActivePanel("cart")}
                        aria-label={`Shopping bag, ${cartCount} ${cartCount === 1 ? "product" : "products"}`}
                        aria-haspopup="dialog"
                        className="relative flex size-10 cursor-pointer items-center justify-center rounded-full text-neutral-700 outline-none transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-orange-500/40 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white"
                    >
                        <ShoppingBag className="size-5" />
                        {cartCount > 0 && (
                            <span className="absolute right-0 top-0 flex h-4.5 min-w-4.5 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-semibold text-white ring-2 ring-white dark:ring-neutral-950">
                                {cartCount}
                            </span>
                        )}
                    </button>

                    {/* Cart drawer (Dialog: blocks scroll, traps focus, closes with Esc / outside click) */}
                    <Dialog open={cartOpen} onClose={closeCart} className="relative z-50">
                        <DialogBackdrop
                            transition
                            className="fixed inset-0 bg-black/50 transition-opacity duration-300 ease-out data-closed:opacity-0"
                        />

                        <div className="fixed inset-0 flex justify-end">
                            <DialogPanel
                                transition
                                className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out data-closed:translate-x-full dark:bg-neutral-950"
                            >
                                {/* Header */}
                                <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4 dark:border-neutral-800">
                                    <div>
                                        <DialogTitle className="text-base font-semibold text-neutral-900 dark:text-white">
                                            Your bag
                                        </DialogTitle>
                                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                                            {cartCount} {cartCount === 1 ? "item" : "items"}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={closeCart}
                                        aria-label="Close bag"
                                        className="flex size-9 cursor-pointer items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                    >
                                        <X className="size-5" />
                                    </button>
                                </div>

                                {cart.length === 0 ? (
                                    <div className="flex flex-1 flex-col items-center justify-center px-5 text-center">
                                        <div className="flex size-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 dark:bg-neutral-900 dark:text-neutral-500">
                                            <ShoppingBag size={26} />
                                        </div>
                                        <p className="mt-4 text-sm font-medium text-neutral-900 dark:text-white">
                                            Your bag is empty
                                        </p>
                                        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                                            You haven&apos;t added any products to your bag yet.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                onCategoryChange("all");
                                                closeCart();
                                            }}
                                            className="mt-5 inline-flex h-10 cursor-pointer items-center justify-center rounded-full bg-neutral-900 px-6 text-sm font-medium text-white transition-colors hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
                                        >
                                            Start shopping
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Scrollable list */}
                                        <ul className="flex-1 divide-y divide-neutral-100 overflow-y-auto px-5 dark:divide-neutral-800">
                                            {cart.map((item) => (
                                                <li key={item.id} className="flex items-center gap-3 py-3">
                                                    <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100 dark:bg-neutral-900">
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            fill
                                                            sizes="64px"
                                                            className="object-contain p-1"
                                                        />
                                                    </div>

                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">
                                                            {item.name}
                                                        </p>
                                                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                            {formatPrice(item.price * item.quantity)}
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                item.quantity === 1
                                                                    ? dispatch({ type: "remove-from-cart", payload: { id: item.id } })
                                                                    : dispatch({ type: "decrease-quantity", payload: { id: item.id } })
                                                            }
                                                            aria-label={item.quantity === 1 ? `Remove ${item.name}` : `Decrease ${item.name}`}
                                                            className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-neutral-900 text-white transition-transform active:scale-95 dark:bg-white dark:text-neutral-900"
                                                        >
                                                            {item.quantity === 1 ? <Trash2 className="size-3" /> : <Minus className="size-3 stroke-3" />}
                                                        </button>

                                                        <span className="min-w-4 text-center text-sm font-bold text-neutral-900 dark:text-white">
                                                            {item.quantity}
                                                        </span>

                                                        <button
                                                            type="button"
                                                            onClick={() => dispatch({ type: "increase-quantity", payload: { id: item.id } })}
                                                            disabled={item.quantity >= Math.min(max_items, item.stock)}
                                                            aria-label={`Increase ${item.name}`}
                                                            className="flex size-6 cursor-pointer items-center justify-center rounded-full bg-neutral-900 text-white transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-neutral-900"
                                                        >
                                                            <Plus className="size-3 stroke-3" />
                                                        </button>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>

                                        {/* Footer */}
                                        <div className="space-y-3 border-t border-neutral-100 px-5 py-4 dark:border-neutral-800">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-neutral-500 dark:text-neutral-400">Subtotal</span>
                                                <span className="text-base font-bold text-neutral-900 dark:text-white">
                                                    {formatPrice(cartTotal)}
                                                </span>
                                            </div>

                                            <button
                                                type="button"
                                                className="h-11 w-full cursor-pointer rounded-full bg-orange-600 text-sm font-semibold text-white transition-colors hover:bg-orange-700"
                                            >
                                                Checkout
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => dispatch({ type: "clear-cart" })}
                                                className="w-full cursor-pointer text-center text-sm font-medium text-neutral-500 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                                            >
                                                Clear bag
                                            </button>
                                        </div>
                                    </>
                                )}
                            </DialogPanel>
                        </div>
                    </Dialog>

                    {/* Mobile button */}
                    <button
                        type="button"
                        onClick={toggleMobile}
                        aria-expanded={mobileOpen}
                        aria-label="Toggle menu"
                        className="relative size-10 cursor-pointer rounded-full text-neutral-800 transition-colors duration-200 hover:bg-neutral-100 lg:hidden dark:text-neutral-200 dark:hover:bg-neutral-800"
                    >
                        <span
                            className={`absolute left-2.5 top-3.25 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-in-out ${mobileOpen ? "translate-y-1.5 rotate-45" : ""
                                }`}
                        />
                        <span
                            className={`absolute left-2.5 top-4.75 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-in-out ${mobileOpen ? "scale-x-0 opacity-0" : "opacity-100"
                                }`}
                        />
                        <span
                            className={`absolute left-2.5 top-6.25 h-0.5 w-5 rounded-full bg-current transition-all duration-300 ease-in-out ${mobileOpen ? "-translate-y-1.5 -rotate-45" : ""
                                }`}
                        />
                    </button>
                </div>
            </div>

            {/* Mobile menu (animated height) */}
            <div
                className={`grid transition-all duration-300 ease-in-out lg:hidden ${mobileOpen
                    ? "visible grid-rows-[1fr] opacity-100"
                    : "invisible grid-rows-[0fr] opacity-0"
                    }`}
            >
                <div className="overflow-hidden bg-white dark:bg-neutral-950">
                    <div className="border-t border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-800">
                        {/* Mobile search */}
                        <div
                            style={{ transitionDelay: mobileOpen ? "100ms" : "0ms" }}
                            className={`transition-all duration-300 ease-out ${mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                                }`}
                        >
                            <SearchBar query={query} setQuery={onQueryChange} />
                        </div>

                        {/* Mobile links (category filters) */}
                        <nav aria-label="mobile navigation" className="mt-3">
                            <ul className="flex flex-col">
                                {links.map((link, index) => {
                                    const isActive = activeCategory === link.value;

                                    return (
                                        <li
                                            key={link.value}
                                            style={{
                                                transitionDelay: mobileOpen
                                                    ? `${index * 50 + 160}ms`
                                                    : "0ms",
                                            }}
                                            className={`border-b border-neutral-100 transition-all duration-300 ease-out last:border-b-0 dark:border-neutral-800 ${mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
                                                }`}
                                        >
                                            <button
                                                type="button"
                                                aria-pressed={isActive}
                                                onClick={() => {
                                                    onCategoryChange(link.value);
                                                    closeMobile();
                                                }}
                                                className={`block w-full cursor-pointer py-3 text-left text-[13px] font-medium uppercase transition-colors duration-200 hover:text-orange-500 ${isActive
                                                    ? "text-orange-600 dark:text-orange-500"
                                                    : "text-neutral-600 dark:text-neutral-300"
                                                    }`}
                                            >
                                                {link.label}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}