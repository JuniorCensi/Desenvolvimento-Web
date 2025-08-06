// ************************* Seletores dos Elementos do DOM ************************* //

const modalAddTask = document.getElementById('modalAddTask');
const modalEditTask = document.getElementById('modalEditTask');
const modalRemoveTask = document.getElementById('modalRemoveTask');
const modalItemDetails = document.getElementById('itemDetails');

const btnCancelAdd = modalAddTask.querySelector('.close-btn');
const btnCancelEdit = modalEditTask.querySelector('.close-btn');
const btnCancelRemove = modalRemoveTask.querySelector('.close-btn');
const btnCloseDetails = modalItemDetails.querySelector('.close-btn');

const btnAddTask = document.querySelector('.add-btn');
const btnEditTask = document.querySelector('.edit-btn');
const btnRemoveTask = document.querySelector('.remove-btn');
const btnConfirmEdit = document.querySelector('.confirm-btn');

const formAddTask = document.getElementById('formAddTask');
const formEditTask = document.getElementById('formEditTask');

const item = document.querySelector('.task-item');

const btnFilterAll = document.getElementById('filterAll-btn');
const btnFilterConc = document.getElementById('filterConc-btn');
const btnFilterPend = document.getElementById('filterPend-btn');

// ************************* Array e Função para Exibir as Tarefas ************************* //

let tasks = [];

renderTasks = () => {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = ''; // Limpa a lista de tarefas

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.setAttribute('data-index', index);

        // Define a cor de fundo conforme o status da tarefa
        const bgColor = task.concluida
            ? '#e6f9ea' // verde suave para concluída
            : '#ffeaea'; // vermelho suave para pendente

        li.style.background = bgColor;

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

        taskList.appendChild(li);
    });
}

// *********************** Funções do Modal de Adicionar Tarefa *********************** //

// Abrir modal ao clicar em "Adicionar Tarefa"
btnAddTask.addEventListener('click', function (e) {
    e.preventDefault();
    // Pega o valor do input principal
    const mainInput = document.querySelector('.task-input').value;
    // Preenche o campo de título do modal
    document.getElementById('title').value = mainInput;
    modalAddTask.classList.add('open');
});

// Fechar modal ao clicar em "Cancelar"
btnCancelAdd.addEventListener('click', function () {
    // Limpa o formulário
    formAddTask.reset();
    modalAddTask.classList.remove('open');
});

// Fechar modal ao clicar fora do conteúdo do modal
modalAddTask.addEventListener('click', function (e) {
    if (e.target === modalAddTask) {
        modalAddTask.classList.remove('open');
    }
});

formAddTask.addEventListener('submit', function (e) {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const dueDate = document.getElementById('due').value;
    const priority = document.getElementById('priority').value;
    const description = document.getElementById('desc').value;

    const newTask = {
        titulo: title,
        descricao: description,
        vencimento: dueDate,
        prioridade: priority,
        concluida: false
    };

    tasks.push(newTask);
    console.log('Tarefa adicionada:', newTask);

    modalAddTask.classList.remove('open');

    formAddTask.reset();

    renderTasks();
});

// *********************** Funções do Modal de Editar Tarefa *********************** //

document.getElementById('taskList').addEventListener('click', function (e) {
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

formEditTask.addEventListener('submit', function (e) {
    e.preventDefault();

    const index = window.taskEditingIndex;
    const title = document.getElementById('edit-title').value;
    const dueDate = document.getElementById('edit-due').value;
    const priority = document.getElementById('edit-priority').value;
    const description = document.getElementById('edit-desc').value;

    tasks[index] = {
        titulo: title,
        descricao: description,
        vencimento: dueDate,
        prioridade: priority,
        concluida: tasks[index].concluida
    };

    modalEditTask.classList.remove('open');
    renderTasks();
});

// Fechar modal ao clicar em "Cancelar"
btnCancelEdit.addEventListener('click', function () {
    modalEditTask.classList.remove('open');
});

// Fechar modal ao clicar fora do conteúdo do modal
modalEditTask.addEventListener('click', function (e) {
    if (e.target === modalEditTask) {
        modalEditTask.classList.remove('open');
    }
});

// *********************** Funções do Modal de Remover Tarefa *********************** //

let taskRemovingIndex = null;

document.getElementById('taskList').addEventListener('click', function (e) {
    if (e.target.closest('.remove-btn')) {
        const li = e.target.closest('.task-item');
        const index = li.getAttribute('data-index');

        taskRemovingIndex = index; // Salva o índice da tarefa a ser removida

        // Exibe o modal de confirmação de remoção
        modalRemoveTask.classList.add('open');
    }
});

// Define o evento de confirmação de remoção
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
    // Não abre detalhes se clicar em editar ou remover
    if (
        e.target.closest('.edit-btn') ||
        e.target.closest('.remove-btn') ||
        e.target.classList.contains('task-checkbox')
    ) {
        return;
    }

    // Só abre se clicar no .task-item (fora dos botões)
    const li = e.target.closest('.task-item');
    if (li) {
        const index = li.getAttribute('data-index');
        const task = tasks[index];

        // Preenche os detalhes do item
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

// Função auxiliar para gerenciar as classes dos filtros
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

// Filtro "Todas"
btnFilterAll.addEventListener('click', function () {
    updateFilterSelected('all');
    document.querySelectorAll('.task-item').forEach(item => {
        item.style.display = 'flex';
    });
});

// Filtro "Pendentes"
btnFilterPend.addEventListener('click', function () {
    updateFilterSelected('pend');
    document.querySelectorAll('.task-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        item.style.display = !checkbox.checked ? 'flex' : 'none';
    });
});

// Filtro "Concluídas"
btnFilterConc.addEventListener('click', function () {
    updateFilterSelected('conc');
    document.querySelectorAll('.task-item').forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        item.style.display = checkbox.checked ? 'flex' : 'none';
    });
});