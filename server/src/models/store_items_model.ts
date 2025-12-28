import mongoose, { Schema } from "mongoose";

// תיאור צורת האובייקט :interface
interface IStore_items {
  supplier_id: mongoose.Types.ObjectId;
  supplierItem_id: mongoose.Types.ObjectId;
  name: string;
  stock: number;
  sellPriceCents: number;
  category: string;
  imageUrl: string;
}


// DBקובע איך הנתונים נשמרים ב
const store_itemsSchema = new mongoose.Schema<IStore_items>({
  supplier_id: {
    type: Schema.Types.ObjectId,
    ref: "Supplier",
    required: true,
  },
  supplierItem_id: {
    type: Schema.Types.ObjectId,
    ref: "Supplier_items",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  sellPriceCents: {
    type: Number,
    required: true,
    min: 0, // המחיר לא יכול להיות שלילי
    validate: { //מחייב את המחיר להיות שלם ובאגורות
        validator: Number.isInteger,
        message: 'Price must be integer (cents)',
    },
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
});

export default mongoose.model<IStore_items>("Store_items", store_itemsSchema);
