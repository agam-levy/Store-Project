import React from "react";
import { CartItem } from "../hooks/useCart";

interface Props {
  cart: CartItem[];
  totalPriceCents: number;
  onRemoveOne: (itemId: string) => void;
  onAddOne: (item: string) => void;
  onRemoveItem: (itemId: string) => void;
  onClear: () => void;
  onCheckout: (address: string) => Promise<void>;
}

export default function Cart({
  cart,
  totalPriceCents,
  onRemoveOne,
  onAddOne,
  onRemoveItem,
  onClear,
  onCheckout,
}: Props) {
  const [address, setAddress] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [msg, setMsg] = React.useState<string | null>(null);

  const submit = async () => {
    setMsg(null);
    if (cart.length === 0) {
      setMsg("Cart is empty.");
      return;
    }
    if (!address.trim()) {
      setMsg("Please enter address.");
      return;
    }

    setSubmitting(true);
    try {
      await onCheckout(address.trim());
      setAddress("");
      setMsg("Order created!");
    } catch (e) {
      const m = e instanceof Error ? e.message : "Failed to create order";
      setMsg(`${m}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-3 rounded shadow-sm mb-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="mb-0">Cart</h5>
        <button className="btn btn-sm btn-outline-danger" onClick={onClear} disabled={cart.length === 0}>
          Clear
        </button>
      </div>

      {cart.length === 0 ? (
        <p className="text-muted mb-0">No items yet.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {cart.map((x) => (
              <li key={x._id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <div className="fw-semibold">{x.name}</div>
                  <div className="text-muted">
                    ₪ {(x.sellPriceCents / 100).toFixed(2)} × {x.quantity}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => onRemoveOne(x._id)}>
                    -
                  </button>
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => onAddOne(x._id)}>
                    +
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onRemoveItem(x._id)}>
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-between mb-3">
            <span className="fw-semibold">Total</span>
            <span className="fw-semibold">₪ {(totalPriceCents / 100).toFixed(2)}</span>
          </div>

          <div className="input-group mb-2">
            <input
              className="form-control"
              placeholder="Delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <button className="btn btn-success" onClick={submit} disabled={submitting}>
              {submitting ? "Placing..." : "Checkout"}
            </button>
          </div>

          {msg && <div className="small text-muted">{msg}</div>}
        </>
      )}
    </div>
  );
}
