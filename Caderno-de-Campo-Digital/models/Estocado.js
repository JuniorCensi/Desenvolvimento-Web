import mongoose from "mongoose";
const { Schema, model } = mongoose;

const estocadoSchema = new Schema({
    item: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    quantidade: { type: Number, required: true, min: 1 }
});

const Estocado = model("Estocado", estocadoSchema);

export default Estocado;
