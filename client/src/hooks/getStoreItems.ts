import { useEffect, useState } from "react";
import { getStoreItems, StoreItem } from "../api/store_items";

export function useStoreItems() {
  const [items, setItems] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getStoreItems();
        setItems(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load items"
        );
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { items, loading, error };
}
