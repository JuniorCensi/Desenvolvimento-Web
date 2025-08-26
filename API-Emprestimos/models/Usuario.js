import mongoose from "mongoose";
import Loan from "./Loan.js";

const UsuarioSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    cpf: { type: String, required: true },
    income: { type: Number, required: true },
    location: { type: String, required: true },
    loans: [Loan.schema]
});

const Usuario = mongoose.model("Usuario", UsuarioSchema);

export default Usuario;
