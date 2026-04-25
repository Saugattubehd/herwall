import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try { return JSON.parse(localStorage.getItem('herwall_cart')) || []; } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('herwall_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size, quantity = 1) => {
    const sizeData = product.sizes.find(s => s.size === size);
    if (!sizeData) return;
    setCart(prev => {
      const key = `${product._id}-${size}`;
      const existing = prev.find(i => i.key === key);
      if (existing) {
        return prev.map(i => i.key === key ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, {
        key, productId: product._id, productName: product.name,
        productImage: product.images?.[0] || '',
        slug: product.slug, size, price: sizeData.price, quantity
      }];
    });
  };

  const removeFromCart = (key) => setCart(prev => prev.filter(i => i.key !== key));

  const updateQty = (key, quantity) => {
    if (quantity < 1) return removeFromCart(key);
    setCart(prev => prev.map(i => i.key === key ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const count = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
