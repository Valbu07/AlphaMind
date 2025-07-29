document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('taskForm');
    const tbody = document.getElementById('taskTableBody');
    const cancelBtn = document.getElementById('cancelBtn');
    const submitBtn = document.getElementById('submitBtn');

    let editingId = null;

    loadTasks();

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const task = {
            id: editingId || Date.now().toString(),
            destinatario: document.getElementById('destinatario').value,
            asunto: document.getElementById('asunto').value,
            vencimiento: document.getElementById('vencimiento').value,
            prioridad: document.getElementById('prioridad').value,  // Prioridad en lugar de 'estado'
            descripcion: document.getElementById('descripcion').value
        };

        saveTask(task);
        form.reset();
        editingId = null;
        submitBtn.textContent = 'Asignar';
        cancelBtn.style.display = 'none';
    });

    cancelBtn.addEventListener('click', () => {
        form.reset();
        editingId = null;
        submitBtn.textContent = 'Asignar';
        cancelBtn.style.display = 'none';
    });

    function saveTask(task) {
        let tasks = getTasks();
        if (editingId) {
            tasks = tasks.map(t => t.id === task.id ? task : t);
        } else {
            tasks.push(task);
        }

        localStorage.setItem('tasks', JSON.stringify(tasks));
        loadTasks();
    }

    function getTasks() {
        const tasks = localStorage.getItem('tasks');
        return tasks ? JSON.parse(tasks) : [];
    }

    function loadTasks() {
        const tasks = getTasks();
        tbody.innerHTML = '';

        tasks.forEach(task => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${task.destinatario}</td>
                <td>${task.asunto}</td>
                <td>${task.vencimiento}</td>
                <td>${task.prioridad}</td> <!-- Usamos prioridad aquí -->
                <td>${task.descripcion}</td>
                <td>
                    <button class="edit-btn" data-id="${task.id}">Editar</button>
                    <button class="delete-btn" data-id="${task.id}">Eliminar</button>
                </td>
            `;

            tbody.appendChild(row);
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                editTask(btn.getAttribute('data-id'));
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                deleteTask(btn.getAttribute('data-id'));
            });
        });
    }

    function editTask(id) {
        const task = getTasks().find(t => t.id === id);
        if (task) {
            document.getElementById('destinatario').value = task.destinatario;
            document.getElementById('asunto').value = task.asunto;
            document.getElementById('vencimiento').value = task.vencimiento;
            document.getElementById('prioridad').value = task.prioridad; 
            document.getElementById('descripcion').value = task.descripcion;

            editingId = task.id; 
            submitBtn.textContent = 'Actualizar'; 
            cancelBtn.style.display = 'inline-block'; 
        }
    }


    function deleteTask(id) {
        if (confirm('¿Deseas eliminar esta tarea?')) {
            let tasks = getTasks();
            tasks = tasks.filter(t => t.id !== id);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTasks();

            if (editingId === id) {
                form.reset();
                editingId = null;
                submitBtn.textContent = 'Asignar';
                cancelBtn.style.display = 'none';
            }
        }
    }
});

