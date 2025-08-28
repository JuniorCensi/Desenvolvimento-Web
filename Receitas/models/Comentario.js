import mongoose from "mongoose";

const ComentarioSchema = new mongoose.Schema({
    texto : { type: String, required: true },
    autor: { type: String, required: true },
    dataCriacao : { type: Date, required: true },
    receitaId : { type: mongoose.Schema.Types.ObjectId, ref: "Receita", required: true }
});

const Comentario = mongoose.model("Comentario", ComentarioSchema);

export default Comentario;
