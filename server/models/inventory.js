import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  unit: String,
  price: Number,
  category: String,
  createdAt: { type: Date, default: Date.now }
});

const Inventory = mongoose.model("Inventory", InventorySchema);

export default Inventory;