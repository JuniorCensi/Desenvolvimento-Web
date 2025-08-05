document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formProduto');

    form.addEventListener('submit', function(evento) {
        evento.preventDefault();

        const nome = document.getElementById('nome').value;
        const codigo = document.getElementById('codigo').value;
        const categoria = document.getElementById('categoria').value;
        const quantidade = document.getElementById('quantidade').value;
        const preco = document.getElementById('preco').value;
        const descricao = document.getElementById('descricao').value;
        const disponivel = document.getElementById('disponivel').checked ? 'Sim' : 'Não';

        //Etapa de Validação
        if(nome.trim() === '' || codigo.trim() === '' || quantidade.trim() === '' || quantidade === 0 || preco.trim() === '' || preco === 0 || descricao.trim() === '') {
            alert("Por favor, preencha TODOS os campos!");
            return;
    }

    // Adicionando Dados à Tabela
    const tabela = document.getElementById('tabelaProdutosBody');
    
    const novaLinha = document.createElement('tr');
    
    const colunaNome = document.createElement('td');
    colunaNome.textContent = nome;

    const colunaCodigo = document.createElement('td');
    colunaCodigo.textContent = codigo;

    const colunaCategoria = document.createElement('td');
    colunaCategoria.textContent = categoria;

    const colunaQuantidade = document.createElement('td');
    colunaQuantidade.textContent = quantidade;
    
    const colunaPreco = document.createElement('td');
    colunaPreco.textContent = "R$ " + preco;

    const colunaDescricao = document.createElement('td');
    colunaDescricao.textContent = descricao;

    const colunaDisponivel = document.createElement('td');
    colunaDisponivel.textContent = disponivel;

    novaLinha.appendChild(colunaNome);
    novaLinha.appendChild(colunaCodigo);
    novaLinha.appendChild(colunaCategoria);
    novaLinha.appendChild(colunaQuantidade);
    novaLinha.appendChild(colunaPreco);
    novaLinha.appendChild(colunaDescricao);
    novaLinha.appendChild(colunaDisponivel);

    tabela.appendChild(novaLinha);

    form.reset();
    });
});