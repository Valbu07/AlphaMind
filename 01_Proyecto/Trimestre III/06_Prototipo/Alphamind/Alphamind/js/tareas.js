document.addEventListener('DOMContentLoaded', () => {
    const tareasPendientes = document.getElementById('TareasC');
    const tareasRealizadas = document.getElementById('TareasR');

    const tareas = JSON.parse(localStorage.getItem('tasks')) || [];

    tareasPendientes.innerHTML = '<div class="row">';
    tareasRealizadas.innerHTML = '<div class="row">';

    tareas.forEach(task => {
        const tareaHTML = `
            <div class="col-md-4">
                <div class="${task.realizada ? 'realizada' : 'tarea'}">
                    <div class="titulo">${task.asunto}</div>
                    <div class="detalle">${task.descripcion}</div>
                    <div class="fecha">${task.realizada ? 'Realizada' : task.vencimiento}</div>
                    ${!task.realizada ? `<button data-id="${task.id}" class="btn-realizada btn btn-success mt-2">🗸 Realizada</button>` : ''}
                </div>
            </div>
        `;

        if (task.realizada) {
            tareasRealizadas.querySelector('.row').innerHTML += tareaHTML;
        } else {
            tareasPendientes.querySelector('.row').innerHTML += tareaHTML;
        }
    });

    // Marcar como realizada
    document.querySelectorAll('.btn-realizada').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = btn.getAttribute('data-id');
            const index = tareas.findIndex(t => t.id === id);
            if (index !== -1) {
                tareas[index].realizada = true;
                localStorage.setItem('tasks', JSON.stringify(tareas));
                location.reload(); // recarga para ver el cambio
            }
        });
    });
});
