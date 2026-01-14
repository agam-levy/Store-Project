import { api } from "./api";

export interface CreateOrderItemInput {
  item_id: string;      // Store item _id
  quantity: number;
}

export interface CreateOrderInput {
  address: string;
  storeItems: CreateOrderItemInput[];
}

export interface OrderResponse {
  _id: string;
  date: string;
  totalPriceCents: number;
  totalProfitCents: number;
}

export async function createOrder(payload: CreateOrderInput): Promise<OrderResponse> {
  const res = await api.post<OrderResponse>("/orders", payload);
  return res.data;
}

