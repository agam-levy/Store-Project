import mongoose, { Schema } from "mongoose";
import type {  ISuppliers } from "./SuppliersModel";

// תיאור צורת האובייקט :interface
export interface ISupplier_items {
  _id: mongoose.Types.ObjectId;
  supplier_id: mongoose.Types.ObjectId | ISuppliers;
  name: string;
  costPriceCents: number;
}


// DBקובע איך הנתונים נשמרים ב
const supplier_itemsSchema = new mongoose.Schema<ISupplier_items>({
  supplier_id: {
    type: Schema.Types.ObjectId,
    ref: "Suppliers",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  costPriceCents: {
    type: Number,
    required: true,
    min: 0, // המחיר לא יכול להיות שלילי
    validate: { //מחייב את המחיר להיות שלם ובאגורות
        validator: Number.isInteger,
        message: 'Price must be integer (cents)',
    },
  },
});

export default mongoose.model<ISupplier_items>("Supplier_items", supplier_itemsSchema);
