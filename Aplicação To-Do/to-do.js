// ************************* Seletores dos Elementos do DOM ************************* //

// Seletores dos modais
const modalAddTask = document.getElementById('modalAddTask');
const modalEditTask = document.getElementById('modalEditTask');
const modalRemoveTask = document.getElementById('modalRemoveTask');
const modalItemDetails = document.getElementById('itemDetails');

// Seletores dos botões de ação nos modais
const btnCancelAdd = modalAddTask.querySelector('.close-btn');
const btnCancelEdit = modalEditTask.querySelector('.close-btn');
const btnCancelRemove = modalRemoveTask.querySelector('.close-btn');
const btnCloseDetails = modalItemDetails.querySelector('.close-btn');

// Seletores dos botões de ação principais
const btnAddTask = document.querySelector('.add-btn');
const btnEditTask = document.querySelector('.edit-btn');
const btnRemoveTask = document.querySelector('.remove-btn');
const btnConfirmEdit = document.querySelector('.confirm-btn');

// Seletores dos formulários nos modais
const formAddTask = document.getElementById('formAddTask');
const formEditTask = document.getElementById('formEditTask');

// Seletores dos campos de entrada nos modais
const item = document.querySelector('.task-item');

// Seletores dos botões de filtro
const btnFilterAll = document.getElementById('filterAll-btn');
const btnFilterConc = document.getElementById('filterConc-btn');
const btnFilterPend = document.getElementById('filterPend-btn');

// ************************* Array e Função para Renderizar as Tarefas ************************* //

let tasks = [];

renderTasks = () => {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Limpa a lista de tarefas

    // Cria um item para cada tarefa no array
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.setAttribute('data-index', index);

        // Define a cor de fundo conforme o status da tarefa (atributo 'concluida')
        const bgColor = task.concluida
            ? '#e6f9ea' // verde suave para concluída
            : '#ffeaea'; // vermelho suave para pendente
        li.style.background = bgColor;

        // Define o conteúdo HTML do item da tarefa
        li.innerHTML = `
            <div class="task-main">
                <input type="checkbox" class="task-checkbox" ${task.concluida ? 'checked' : ''} />
                <span class="task-desc">${task.titulo}</span>
            </div>
            <div class="task-due">
                Vence: ${task.vencimento}
            </div>
            <div class="task-priority-container">
                <span class="task-priority ${task.prioridade}">${task.prioridade.charAt(0).toUpperCase() + task.prioridade.slice(1)}</span>
            </div>
            <div class="task-actions">
                <button class="edit-btn" title="Editar"><span class="material-icons">edit</span></button>
                <button class="remove-btn" title="Remover">✖</button>
            </div>
        `;

        // Atualiza o status da tarefa ao clicar na checkbox
        li.querySelector('.task-checkbox').addEventListener('change', function () {
            task.concluida = this.checked;
            renderTasks();
        });

        // Adiciona o item à lista de tarefas
        taskList.appendChild(li);
    });
}

// *********************** Funções do Modal de Adicionar Tarefa *********************** //

// OBS: A adição da classe 'open' ao modal faz com que ele seja exibido na tela

// Evento para abrir o modal de adicionar tarefa ao clicar no botão "Adicionar Tarefa"
btnAddTask.addEventListener('click', function (e) {
    e.preventDefault();
    const mainInput = document.querySelector('.task-input').value; // Pega o valor do input principal
    document.getElementById('title').value = mainInput; // Preenche o campo de título do modal com o valor do input principal
    modalAddTask.classList.add('open');
});

// Evento para fechar o modal de adicionar tarefa ao clicar no botão "Cancelar"
btnCancelAdd.addEventListener('click', function () {
    formAddTask.reset(); 
    modalAddTask.classList.remove('open');
});

// Fechar modal ao clicar fora do conteúdo do modal
modalAddTask.addEventListener('click', function (e) {
    if (e.target === modalAddTask) {
        modalAddTask.classList.remove('open');
    }
});

// Evento para adicionar uma nova tarefa ao enviar o formulário
formAddTask.addEventListener('submit', function (e) {
    e.preventDefault();

    // Pega os valores dos campos do formulário
    const title = document.getElementById('title').value.trim();
    const dueDate = document.getElementById('due').value;
    const priority = document.getElementById('priority').value;
    const description = document.getElementById('desc').value.trim();

    // Validações Simples para os campos do formulário
    if (!title) {
        alert('O título não pode ser vazio.');
        return; // Se o título estiver vazio, exibe um alerta e não adiciona a tarefa
    }
    if (!description) {
        alert('A descrição não pode ser vazia.');
        return; // Se a descrição estiver vazia, exibe um alerta e não adiciona a tarefa
    }
    if (!dueDate) {
        alert('Informe uma data de vencimento.');
        return; // Se a data de vencimento estiver vazia, exibe um alerta e não adiciona a tarefa
    }
    const dueYear = new Date(dueDate).getFullYear();
    if (dueYear > 2100) {
        alert('O ano limite para vencimento é 2100.');
        return; // Se o ano da data de vencimento for maior que 2100, exibe um alerta e não adiciona a tarefa
    }
    if (new Date(dueDate) < new Date()) {
        alert('Informe uma data de vencimento futura.');
        return; // Se a data de vencimento for anterior à data atual, exibe um alerta e não adiciona a tarefa
    }

    // Cria um novo objeto de tarefa com os valores do formulário
    const newTask = {
        titulo: title,
        descricao: description,
        vencimento: dueDate,
        prioridade: priority,
        concluida: false
    };

    tasks.push(newTask);

    modalAddTask.classList.remove('open'); // Fecha o modal de adicionar tarefa ao enviar o formulário 

    formAddTask.reset(); // Limpa o formulário após adicionar a tarefa

    renderTasks(); // Atualiza a lista de tarefas para exibir a nova tarefa adicionada ao usuário
});

// *********************** Funções do Modal de Editar Tarefa *********************** //

// Evento para abrir o modal de edição ao clicar no botão "Editar" de uma tarefa
document.getElementById('taskList').addEventListener('click', function (e) {

    // Verifica se o botão de editar foi clicado
    if (e.target.closest('.edit-btn')) {
        const li = e.target.closest('.task-item');
        const index = li.getAttribute('data-index');
        const task = tasks[index];

        // Preenche o formulário de edição
        document.getElementById('edit-title').value = task.titulo;
        document.getElementById('edit-desc').value = task.descricao;
        document.getElementById('edit-due').value = task.vencimento;
        document.getElementById('edit-priority').value = task.prioridade;

        // Salva o índice da tarefa sendo editada
        window.taskEditingIndex = index;

        // Abre o modal de edição
        modalEditTask.classList.add('open');
    }
});

// Evento para editar os campos tarefa ao enviar o formulário de edição (botão 'submit')
formEditTask.addEventListener('submit', function (e) {
    e.preventDefault();

    // Pega o índice da tarefa sendo editada e os valores dos campos do formulário
    const index = window.taskEditingIndex;
    const title = document.getElementById('edit-title').value.trim();
    const dueDate = document.getElementById('edit-due').value;
    const priority = document.getElementById('edit-priority').value;
    const description = document.getElementById('edit-desc').value.trim();

    // Validações Simples para os campos do formulário
    if (!title) {
        alert('O título não pode ser vazio.');
        return; // Se o título estiver vazio, exibe um alerta e não atualiza a tarefa
    }
    if (!description) {
        alert('A descrição não pode ser vazia.');
        return; // Se a descrição estiver vazia, exibe um alerta e não atualiza a tarefa
    }
    if (!dueDate) {
        alert('Informe uma data de vencimento.');
        return; // Se a data de vencimento estiver vazia, exibe um alerta e não atualiza a tarefa
    }
    const dueYear = new Date(dueDate).getFullYear();
    if (dueYear > 2100) {
        alert('O ano limite para vencimento é 2100.');
        return; // Se o ano da data de vencimento for maior que 2100, exibe um alerta e não atualiza a tarefa
    }
    if (new Date(dueDate) < new Date()) {
        alert('Informe uma data de vencimento futura.');
        return; // Se a data de vencimento for anterior à data atual, exibe um alerta e não atualiza a tarefa
    }

    // Atribui os novos valores à tarefa no array
    tasks[index] = {
        titulo: title,
        descricao: description,
        vencimento: dueDate,
        prioridade: priority,
        concluida: tasks[index].concluida
    };

    modalEditTask.classList.remove('open'); // Fecha o modal de edição ao enviar o formulário
    renderTasks(); // Atualiza a lista de tarefas para exibir as alterações feitas
});

// Evento para fechar o modal ao clicar em "Cancelar"
btnCancelEdit.addEventListener('click', function () {
    modalEditTask.classList.remove('open');
});

// Evento para fechar o modal ao clicar fora de seu conteúdo
modalEditTask.addEventListener('click', function (e) {
    if (e.target === modalEditTask) {
        modalEditTask.classList.remove('open');
    }
});

// *********************** Funções do Modal de Remover Tarefa *********************** //

// Variável para armazenar o índice da tarefa a ser removida
let taskRemovingIndex = null;

// Evento para abrir o modal de remoção ao clicar no botão "Remover" de uma tarefa
document.getElementById('taskList').addEventListener('click', function (e) {
    if (e.target.closest('.remove-btn')) {
        const li = e.target.closest('.task-item');
        const index = li.getAttribute('data-index');

        taskRemovingIndex = index; // Salva o índice da tarefa que pretende-se remover

        // Exibe o modal de confirmação de remoção
        modalRemoveTask.classList.add('open');
    }
});

// Evento para remover a tarefa ao clicar no botão "Remover" no modal de remoção
btnRemoveTask.addEventListener('click', function () {
    if (taskRemovingIndex !== null) {
        tasks.splice(taskRemovingIndex, 1); // Remove a tarefa do array
        modalRemoveTask.classList.remove('open'); // Fecha o modal
        renderTasks(); // Atualiza a lista de tarefas
        taskRemovingIndex = null; // Reseta o índice
    }
});

// Fecha o modal de remoção ao clicar em "Cancelar"
btnCancelRemove.addEventListener('click', function () {
    modalRemoveTask.classList.remove('open');
});

// Fechar modal ao clicar fora do conteúdo do modal
modalRemoveTask.addEventListener('click', function (e) {
    if (e.target === modalRemoveTask) {
        modalRemoveTask.classList.remove('open');
    }
});

// *********************** Funções do Modal de Detalhes do Item *********************** //

document.getElementById('taskList').addEventListener('click', function (e) {
    
    // Cláusula para evitar que o modal seja aberto ao clicar nos botões de editar, remover ou na checkbox do item
    if (
        e.target.closest('.edit-btn') ||
        e.target.closest('.remove-btn') ||
        e.target.classList.contains('task-checkbox')
    ) {
        return;
    }

    // Só abre se clicar no '.task-item'
    const li = e.target.closest('.task-item');
    if (li) {
        const index = li.getAttribute('data-index');
        const task = tasks[index];

        // Preenche os detalhes do item no modal de detalhes
        document.getElementById('item-title').textContent = task.titulo;
        document.getElementById('item-desc').textContent = task.descricao;
        document.getElementById('item-due').textContent = task.vencimento;
        document.getElementById('item-priority').textContent = task.prioridade.charAt(0).toUpperCase() + task.prioridade.slice(1);

        // Exibe o modal de detalhes
        modalItemDetails.classList.add('open');
    }
});

// Fecha o modal de remoção ao clicar em "Fechar"
btnCloseDetails.addEventListener('click', function () {
    modalItemDetails.classList.remove('open');
});

// Fechar modal ao clicar fora do conteúdo do modal
modalItemDetails.addEventListener('click', function (e) {
    if (e.target === modalItemDetails) {
        modalItemDetails.classList.remove('open');
    }
});

// *********************** Filtros de Tarefas *********************** //

// OBS: A adição da classe 'selected' indica qual filtro está ativo

// Função auxiliar para atualizar as classes dos filtros
function updateFilterSelected(selected) {
    btnFilterAll.classList.remove('selected');
    btnFilterPend.classList.remove('selected');
    btnFilterConc.classList.remove('selected');

    if (selected === 'all') {
        btnFilterAll.classList.add('selected');
    } else if (selected === 'pend') {
        btnFilterPend.classList.add('selected');
    } else if (selected === 'conc') {
        btnFilterConc.classList.add('selected');
    }
}

// Evento para aplicar o filtro "Todos" ao clicar no botão "Todos"
btnFilterAll.addEventListener('click', function () {
    updateFilterSelected('all');
    document.querySelectorAll('.task-item').forEach(item => {
        item.style.display = 'flex'; // Exibe todas as tarefas
    });
});

// Evento para aplicar o filtro "Pendentes" ao clicar no botão "Pendentes"
btnFilterPend.addEventListener('click', function () {
    updateFilterSelected('pend');
    document.querySelectorAll('.task-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        item.style.display = !checkbox.checked ? 'flex' : 'none'; // Se a tarefa não está concluída, exibe; caso contrário, oculta
    });
});

// Evento para aplicar o filtro "Concluídas" ao clicar no botão "Concluídas"
btnFilterConc.addEventListener('click', function () {
    updateFilterSelected('conc');
    document.querySelectorAll('.task-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        item.style.display = checkbox.checked ? 'flex' : 'none'; // Se a tarefa está concluída, exibe; caso contrário, oculta
    });
});