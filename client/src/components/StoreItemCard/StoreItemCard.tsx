import { StoreItem } from "../../api/store_items";
import styles from "./StoreItemCard.module.css";

interface Props {
  item: StoreItem;
  onAddToCart: (item: StoreItem) => void;
}

export default function StoreItemCard({ item, onAddToCart }: Props) {
  return (
    <div className="col-md-4 mb-4">
      <div className={`card h-100 ${styles.card}`}>
        <img
          src={item.imageUrl || "https://via.placeholder.com/600x300"}
          className={`card-img-top ${styles.image}`}
          alt={item.name}
        />

        <div className="card-body">
          <h5 className="card-title">{item.name}</h5>

          <p className={styles.price}>
            ₪ {(item.sellPriceCents / 100).toFixed(2)}
          </p>

          <p className="text-muted">Color: {item.color}</p>
          <p className="text-muted">Stock: {item.stock}</p>

          <button
            className="btn btn-primary"
            onClick={() => onAddToCart(item)}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
