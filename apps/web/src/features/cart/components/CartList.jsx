"use client";

import CartItem from "./CartItem";

export default function CartList({ items, onUpdateQty, onRemove }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onUpdateQty={(qty) => onUpdateQty(item.id, qty)}
          onRemove={() => onRemove(item.id)}
        />
      ))}
    </div>
  );
}
