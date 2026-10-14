"use client";

// Import libraries
import { Dispatch } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2, Star } from "lucide-react";
import { Product } from "@/types/product";
import { formatPrice } from "@/lib/formatPrice";
import { CartActions } from "@/reducers/cartReducer";

// Type Product Card
type ProductCardProps = {
  product: Product;
  quantity: number;
  dispatch: Dispatch<CartActions>
};

// Initialize the product card component
export default function ProductCard({ product, quantity, dispatch }: ProductCardProps) {

  const soldOut = product.stock === 0;

  return (
    <article
      className={`group flex items-center gap-4 rounded-2xl border bg-white p-3.5 hover:shadow-md transition-all dark:bg-neutral-950 ${quantity > 0
        ? "border-orange-500/60 ring-1 ring-orange-500/30"
        : "border-neutral-200 dark:border-neutral-800"
        }`}
    >
      {/* Image */}
      <div className="relative size-28 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 sm:size-32 dark:bg-neutral-900/80">
        <Image
          src={product.image}
          alt={product.name}
          fill
          loading="lazy"
          sizes="(min-width: 640px) 128px, 112px"
          className={`object-contain p-2 transition-transform group-hover:scale-105 ${soldOut ? "grayscale" : ""
            }`}
        />

        {/* Badge */}
        {product.badge && !soldOut && (
          <span className="absolute left-1.5 top-1.5 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-bold uppercase text-white">
            {product.badge}
          </span>
        )}

        {/* Sold out */}
        {soldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-neutral-950/50">
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-neutral-900">
              Sold out
            </span>
          </div>
        )}
      </div>

      {/* Product information */}
      <div className="flex min-w-0 flex-1 flex-col self-stretch py-0.5">
        {/* Name (up to 2 lines) */}
        <h3 className="line-clamp-2 text-base font-bold leading-tight text-neutral-900 sm:text-lg dark:text-white">
          {product.name}
        </h3>

        {/* Rating and reviews */}
        {product.rating && (
          <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-400">
            <div className="flex items-center gap-0.5 font-bold text-amber-500 dark:text-amber-400">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
            </div>
            {product.reviews && (
              <span className="text-neutral-400 dark:text-neutral-500">
                ({product.reviews} reviews)
              </span>
            )}
          </div>
        )}

        {/* Description */}
        <p className="mt-1 line-clamp-2 text-xs text-neutral-500 sm:text-sm dark:text-neutral-400">
          {product.description}
        </p>

        {/* Price + actions */}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <span className="text-base font-extrabold text-neutral-900 sm:text-lg dark:text-white">
            {formatPrice(product.price)}
          </span>

          {!soldOut && (
            <button
              type="button"
              onClick={() => dispatch({ type: "add-to-cart", payload: { item: product } })}
              aria-label={`Add ${product.name} to bag`}
              className="flex size-7 cursor-pointer items-center justify-center rounded-full bg-neutral-900 text-white transition-transform hover:bg-neutral-700 active:scale-95 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
            >
              <Plus className="size-3.5 stroke-3" />
            </button>
          )
          }
        </div>
      </div>
    </article>
  );
}