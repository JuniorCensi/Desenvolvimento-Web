import mongoose from "mongoose";
const { Schema, model } = mongoose;

const embalagemSchema = new Schema({
  descricao: { type: String, required: true, maxlength: 40 },
  tamanho: { type: String, required: true, enum: ["PP", "P", "M", "G", "GG"] }
});

const Embalagem = model("Embalagem", embalagemSchema);

export default Embalagem;
