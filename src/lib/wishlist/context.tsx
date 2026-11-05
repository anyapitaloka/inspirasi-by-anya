"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Product } from "../types";

interface WishlistContextType {
  wishlistIds: string[];
  isSaved: (productId: string) => boolean;
  toggleWishlist: (product: { id: string; name: string }) => boolean; // returns true if now saved
  count: number;
}

const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: [],
  isSaved: () => false,
  toggleWishlist: () => false,
  count: 0,
});

const STORAGE_KEY = "inspirasi_anya_wishlist_v1";

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setWishlistIds(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not load wishlist from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch (e) {
      console.warn("Could not save wishlist to localStorage", e);
    }
  }, [wishlistIds, isLoaded]);

  const isSaved = (productId: string) => {
    return wishlistIds.includes(productId);
  };

  const toggleWishlist = (product: { id: string; name: string }) => {
    const exists = wishlistIds.includes(product.id);
    let updated: string[];
    if (exists) {
      updated = wishlistIds.filter((id) => id !== product.id);
    } else {
      updated = [product.id, ...wishlistIds];
    }
    setWishlistIds(updated);
    return !exists;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        isSaved,
        toggleWishlist,
        count: wishlistIds.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
