import mongoose from "mongoose";
const { Schema, model } = mongoose;

const usuarioSchema = new Schema({
  nome: { type: String, required: true },
  cpf: { type: String, required: true, maxlength: 14, unique: true },
  telefoneCel: { type: String, required: true, maxlength: 15 },
  telefoneRes: { type: String, maxlength: 14 },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  endereco: [{
    rua: { type: String, required: true, maxlength: 40 },
    numero: { type: String, required: true, maxlength: 5, default: "s/n" },
    cep: { type: String, required: true, maxlength: 10 },
    bairro: { type: String, required: true, maxlength: 40 },
    cidade: { type: String, required: true, maxlength: 40 },
    estado: { type: String, required: true, maxlength: 2 }
  }]
});

const Usuario = model("Usuario", usuarioSchema);

export default Usuario;
