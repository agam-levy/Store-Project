import mongoose from "mongoose";

// תיאור צורת האובייקט :interface
export interface ISuppliers {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  address: string;
}


// DBקובע איך הנתונים נשמרים ב
const suppliersSchema = new mongoose.Schema<ISuppliers>({
  name: {
    type: String,
    required: true,
  },
});

export default mongoose.model<ISuppliers>("Suppliers", suppliersSchema);
