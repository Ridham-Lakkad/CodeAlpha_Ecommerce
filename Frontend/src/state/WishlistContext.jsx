import { createContext, useContext, useMemo, useState } from "react";

const WishlistContext = createContext(null);

const readStoredWishlist = () => {
  try {
    const raw = localStorage.getItem("apna-bazaar-wishlist");
    const storedWishlist = raw ? JSON.parse(raw) : [];
    return Array.isArray(storedWishlist) ? storedWishlist : [];
  } catch {
    localStorage.removeItem("apna-bazaar-wishlist");
    return [];
  }
};

export const WishlistProvider = ({ children }) => {
  const [items, setItems] = useState(readStoredWishlist);

  const persist = (nextItems) => {
    localStorage.setItem("apna-bazaar-wishlist", JSON.stringify(nextItems));
    setItems(nextItems);
  };

  const value = useMemo(
    () => ({
      items,
      itemCount: items.length,
      hasItem: (productId) => items.some((item) => item._id === productId),
      toggleItem: (product) => {
        const exists = items.some((item) => item._id === product._id);
        persist(
          exists ? items.filter((item) => item._id !== product._id) : [...items, product]
        );
      },
    }),
    [items]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

export const useWishlist = () => useContext(WishlistContext);
