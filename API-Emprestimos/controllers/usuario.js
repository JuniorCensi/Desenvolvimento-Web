import Usuario from "../models/Usuario.js";

export const abrirFormulario = (req, res) => {
  res.render("usuario/formulario", {
    title: "Novo Usuário",
    usuario: new Usuario(),
  });
};