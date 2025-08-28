import mongoose from "mongoose";

const ReceitaSchema = new mongoose.Schema({
    titulo : { type: String, required: true },
    ingredientes : { type: [String], required: true },
    instrucoes : { type: String, required: true },
    autor : { type: String, required: true },
    categoria : { type: String, required: true, enum: ["Massas", "Sobremesas", "Vegano", "Carnes", "Saladas"] },
    dataCriacao : { type: Date, required: true }
});

const Receita = mongoose.model("Receita", ReceitaSchema);

export default Receita;