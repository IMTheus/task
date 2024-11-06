document.addEventListener('DOMContentLoaded', loadTasks);

function loadTasks() {
    fetch('/tarefas')
        .then(response => response.json())
        .then(tasks => {
            const tableBody = document.querySelector('#taskTable tbody');
            tableBody.innerHTML = '';
            tasks.sort((a, b) => a.ordem - b.ordem).forEach(task => {
                const row = document.createElement('tr');
                if (task.custo >= 1000) row.classList.add('yellow-bg');
                
                row.innerHTML = `
                    <td><span class="task-name">${task.nome}</span></td>
                    <td>R$<span class="task-cost">${task.custo.toFixed(2)}</span></td>
                    <td><span class="task-date">${task.data_limite}</span></td>
                    <td>
                        <button onclick="editTask(${task.id}, this)">Editar</button>
                        <button onclick="deleteTask(${task.id})">Excluir</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        });
}

function addTask() {
    const nome = document.getElementById('nome').value;
    const custo = parseFloat(document.getElementById('custo').value);
    const data_limite = document.getElementById('data_limite').value;

    if (!nome || !custo || !data_limite) {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    fetch('/tarefas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, custo, data_limite })
    }).then(() => {
        document.getElementById('nome').value = '';
        document.getElementById('custo').value = '';
        document.getElementById('data_limite').value = '';
        loadTasks();
    });
}

function editTask(id, btn) {
    const row = btn.closest('tr');
    const nome = row.querySelector('.task-name').innerText;
    const custo = parseFloat(row.querySelector('.task-cost').innerText.replace('R$', ''));
    const data_limite = row.querySelector('.task-date').innerText;

    // Preenche os inputs com os dados da tarefa
    document.getElementById('nome').value = nome;
    document.getElementById('custo').value = custo;
    document.getElementById('data_limite').value = data_limite;

    // Atualiza a tarefa no servidor após a edição
    const saveButton = document.querySelector('.form-container button');
    saveButton.innerText = 'Salvar';
    saveButton.onclick = function () {
        const newNome = document.getElementById('nome').value;
        const newCusto = parseFloat(document.getElementById('custo').value);
        const newData_limite = document.getElementById('data_limite').value;

        fetch(`/tarefas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome: newNome, custo: newCusto, data_limite: newData_limite })
        }).then(() => {
            saveButton.innerText = 'Incluir Tarefa';
            saveButton.onclick = addTask; // Reseta o botão para adição de tarefa
            document.getElementById('nome').value = '';
            document.getElementById('custo').value = '';
            document.getElementById('data_limite').value = '';
            loadTasks();
        });
    };
}

function deleteTask(id) {
    if (confirm('Deseja realmente excluir esta tarefa?')) {
        fetch(`/tarefas/${id}`, { method: 'DELETE' }).then
        (loadTasks);
    }
}

