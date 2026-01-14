import StoreItemCard from "./components/cardStoreItem";
import Cart from "./components/cart";
import { useStoreItems } from "./hooks/getStoreItems";
import { useCart } from "./hooks/useCart";
import { createOrder } from "./api/orders";

export default function App() {
  const { items, loading, error } = useStoreItems();
  const { cart, addToCart, removeOne,addOne,removeItem, clearCart, totalPriceCents } = useCart();

  const checkout = async (address: string) => {
    const payload = {
      address,
      storeItems: cart.map((x) => ({
        item_id: x._id,
        quantity: x.quantity,
      })),
    };
  
    await createOrder(payload); 
    clearCart();
  };
  
  

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-danger">{error}</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f7f7f8",
        paddingTop: 40,
      }}
    >
    
    
      <div className="container">
        <h1
          className="text-center mb-4"
          style={{
            fontWeight: 800,
            fontSize: "3rem",
            fontFamily: "Roboto",
            color: "#000000",
          }}
        >
          Record Store
        </h1>

        <Cart
            cart={cart}
            totalPriceCents={totalPriceCents}
            onRemoveOne={removeOne}
            onAddOne={addOne}
            onRemoveItem={removeItem}
            onClear={clearCart}
            onCheckout={checkout}
        />


        <div className="row">
          {items.map((item) => (
            <StoreItemCard key={item._id} item={item} onAddToCart={addToCart} />
          ))}
        </div>
      </div>
    </div>
  );
}
