//import { StoreItem } from "../types/models";
import { api } from "./api";

export interface StoreItem {
    _id: string;
    name: string;
    sellPriceCents: number;
    stock: number;
    category: string;
    imageUrl?: string;
    color: string;
}

export const getStoreItems = async (): Promise<StoreItem[]> => {
    const res = await api.get<StoreItem[]>("/store_items");
    console.log("STATUS", res.status);
    console.log("DATA", res.data);
    return res.data;
};
  
  