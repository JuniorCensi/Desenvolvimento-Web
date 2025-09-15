import mongoose from "mongoose";
const { Schema, model } = mongoose;

const vendaSchema = new Schema({
  itemEmEstoque: { type: Schema.Types.ObjectId, ref: "Estocado", required: true },
  quantidade: { type: Number, required: true, min: 1 },
  precoTotal: { type: Number, required: true, min: 0 }
}, { timestamps: true });

const Venda = model("Venda", vendaSchema);

export default Venda;
