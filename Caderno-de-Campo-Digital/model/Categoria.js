import mongoose from "mongoose";
const { Schema, model } = mongoose;

const categoriaSchema = new Schema({
  nome: { type: String, required: true, unique: true, maxlength: 30 },
  descricao: { type: String, maxlength: 150 },
  cor: { type: String, enum: ["E39AFF" /*uva*/, "FFD0A1" /*pêssego*/, "FF9092" /*ameixa*/], required: true } //add cores
});

const Categoria = model("Categoria", categoriaSchema);

export default Categoria;
