import { useMemo, useState } from "react";
import { StoreItem } from "../api/store_items";

export type CartItem = StoreItem & { quantity: number };

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);

  //add item to cart, if item already in cart, increase quantity
  const addToCart = (item: StoreItem) => {
    setCart((prev) => {
      const exists = prev.find((x) => x._id === item._id);
      if (exists) {
        return prev.map((x) =>
          x._id === item._id ? { ...x, quantity: x.quantity + 1 } : x
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };


  const removeOne = (itemId: string) => {
    setCart((prev) =>
      prev
        .map((x) => (x._id === itemId ? { ...x, quantity: x.quantity - 1 } : x))
        .filter((x) => x.quantity > 0)
    );
  };

  const addOne = (itemId: string) => {
    setCart((prev) =>
      prev.map((x) =>
        x._id === itemId
          ? { ...x, quantity: x.quantity + 1 }
          : x
      )
    );
  };

  

  const removeItem = (itemId: string) => {
    setCart((prev) => prev.filter((x) => x._id !== itemId));
  };

  const clearCart = () => setCart([]);

  const totalItems = useMemo(
    () => cart.reduce((sum, x) => sum + x.quantity, 0),
    [cart]
  );

  const totalPriceCents = useMemo(
    () => cart.reduce((sum, x) => sum + x.sellPriceCents * x.quantity, 0),
    [cart]
  );

  return {
    cart,
    addToCart,
    removeOne,
    addOne,
    removeItem,
    clearCart,
    totalItems,
    totalPriceCents,
  };
}
