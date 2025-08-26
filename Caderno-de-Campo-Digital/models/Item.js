import mongoose from "mongoose";
const { Schema, model } = mongoose;

const itemSchema = new Schema({
  embalagem: { type: Schema.Types.ObjectId, ref: "Embalagem", required: true },
  variedade: { type: Schema.Types.ObjectId, ref: "Variedade", required: true },
  preco: { type: Number, required: true, min: 0, maxlength: 7 }
});

const Item = model("Item", itemSchema);

export default Item;
