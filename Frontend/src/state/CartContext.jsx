import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

const readStoredCart = () => {
  try {
    const raw = localStorage.getItem("shopeasy-cart");
    const storedCart = raw ? JSON.parse(raw) : [];
    return Array.isArray(storedCart) ? storedCart : [];
  } catch {
    localStorage.removeItem("shopeasy-cart");
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readStoredCart);

  const persist = (nextItems) => {
    localStorage.setItem("shopeasy-cart", JSON.stringify(nextItems));
    setItems(nextItems);
  };

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
      subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addItem: (product, quantity = 1) => {
        const existing = items.find((item) => item._id === product._id);
        const nextQuantity = Math.max(1, Number(quantity) || 1);
        const nextItems = existing
          ? items.map((item) =>
              item._id === product._id
                ? { ...item, quantity: Math.min(item.quantity + nextQuantity, item.stock) }
                : item
            )
          : [...items, { ...product, quantity: Math.min(nextQuantity, product.stock) }];
        persist(nextItems);
      },
      updateQuantity: (productId, quantity) => {
        const nextItems = items.map((item) =>
          item._id === productId
            ? { ...item, quantity: Math.max(1, Math.min(quantity, item.stock)) }
            : item
        );
        persist(nextItems);
      },
      removeItem: (productId) => {
        persist(items.filter((item) => item._id !== productId));
      },
      clearCart: () => persist([]),
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);
