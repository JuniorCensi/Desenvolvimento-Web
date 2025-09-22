import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const variedadeSchema = new Schema({
  nome: { type: String, required: true, unique: true, maxlength: 30 },
  descricao: { type: String, maxlength: 150 },
  categoria: { type: Schema.Types.ObjectId, ref: "Categoria", required: true },
  embalagem: { type: [Schema.Types.ObjectId], ref: "Embalagem", required: false, default: [] },
});

const Variedade = model("Variedade", variedadeSchema);

export default Variedade;
