import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
const { Schema, model } = mongoose;

const usuarioSchema = new Schema({
  nome: { type: String, required: true, trim: true, maxlength: 40 },
  cpf: { type: String, required: true, maxlength: 14, unique: true },
  telefoneCel: { type: String, required: true, maxlength: 15 },
  telefoneRes: { type: String, maxlength: 14 },
  email: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
  senha: { type: String, required: true, trim: true, minlength: 6, maxlength: 15 },
  endereco: [{
    rua: { type: String, required: true, maxlength: 40 },
    numero: { type: String, required: true, maxlength: 5, default: "s/n" },
    cep: { type: String, required: true, maxlength: 10 },
    bairro: { type: String, required: true, maxlength: 40 },
    cidade: { type: String, required: true, maxlength: 40 },
    estado: { type: String, required: true, maxlength: 2 }
  }]
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      delete ret.senha;
      return ret;
    }
  },
  toObject: {
    transform(doc, ret) {
      delete ret.senha;
      return ret;
    }
  }
});

// Hash da senha antes de salvar
usuarioSchema.pre('save', async function(next) {
  if (!this.isModified('senha')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.senha = await bcrypt.hash(this.senha, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Método de comparação de senha
usuarioSchema.methods.compararSenha = async function(senhaPlain) {
  return bcrypt.compare(senhaPlain, this.senha);
};

const Usuario = model("Usuario", usuarioSchema);

export default Usuario;
