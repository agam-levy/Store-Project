import Supplier from "../models/suppliers_model";
import SupplierItem from "../models/supplier_items_model";
import StoreItem from "../models/store_items_model";
import { AppError } from "../errors/AppError";

export class SuppliersManager {
  static async createSupplier(name: string) {
    const created = await Supplier.create({ name });
    return created;
  }

  static async getAllSuppliers() {
    return Supplier.find();
  }

  static async getSupplierById(id: string) {
    const supplier = await Supplier.findById(id);
    if (!supplier) throw new AppError(404, "Supplier not found");
    return supplier;
  }

  static async changeNameSupplier(id: string, name: string) {
    const updated = await Supplier.findByIdAndUpdate(
      id,
      { $set: { name } },
      { new: true, runValidators: true }
    );

    if (!updated) throw new AppError(404, "Supplier not found");
    return updated;
  }

  static async deleteSupplierAndCascade(id: string) {
    const supplier = await Supplier.findById(id);
    if (!supplier) throw new AppError(404, "Supplier not found");

    const supplierItemIds = await SupplierItem.distinct("_id", { supplier_id: id });

    if (supplierItemIds.length === 0) {
      await supplier.deleteOne();
      return { deletedSupplier: true, deletedSupplierItems: 0, deletedStoreItems: 0 };
    }

    const storeRes = await StoreItem.deleteMany({ supplierItem_id: { $in: supplierItemIds } });
    const supplierItemsRes = await SupplierItem.deleteMany({ supplier_id: id });
    await supplier.deleteOne();

    return {
      deletedSupplier: true,
      deletedSupplierItems: supplierItemsRes.deletedCount ?? 0,
      deletedStoreItems: storeRes.deletedCount ?? 0,
    };
  }
}
