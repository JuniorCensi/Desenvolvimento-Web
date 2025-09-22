// Função para Rotas Não Encontradas
export function notFound(req, res, next) {
  res.status(404).json({ message: 'Rota não encontrada.' });
}

// Função para Manipulação de Erros
export function errorHandler(err, req, res, next) {
  console.error('Erro:', err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || 'Erro interno do servidor.' });
}
