import mongoose from "mongoose";

export interface IOrderItem {
  item_id: mongoose.Types.ObjectId;
  supplierItem_id: mongoose.Types.ObjectId;
  supplier_id: mongoose.Types.ObjectId; 
  costPriceCents: number;
  sellPriceCents: number;
  quantity: number;
  name: string;
  category: string;
  supplierName: string;
}


interface IOrder  {
    items: IOrderItem[];
  
    address: string;
    date: Date;
  
    totalProfitCents: number;
    totalPriceCents: number;
}

// DBקובע איך הנתונים נשמרים ב
const orderItemSchema = new mongoose.Schema<IOrderItem>({
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Item",
    },
    supplierItem_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "SupplierItem",
    },
    supplier_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Supplier",
    },
    costPriceCents: {
      type: Number,
      required: true,
    },
    sellPriceCents: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    supplierName: {
      type: String,
      required: true,
    }, 
});
  
const orderSchema = new mongoose.Schema<IOrder>({
    items: {
      type: [orderItemSchema],
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    totalProfitCents: {
      type: Number,
      required: true,
    },
    totalPriceCents: {
      type: Number,
      required: true,
    },
});

export default mongoose.model<IOrder>("Order", orderSchema);
  