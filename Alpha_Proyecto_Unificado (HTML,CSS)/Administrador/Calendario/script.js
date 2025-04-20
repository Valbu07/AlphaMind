const date = new Date(); //Crea un objeto con fecha y horas actuales del sistema 
const tasks = {}; //Crea objeto para alacenar los pendientes 

const renderCalendar = () => { //Mostrara el calendario en la interfaz
date.setDate(1); //Hace que el mes comience siempre en uno 
const monthDays = document.querySelector(".days"); //Selecciona el contenedor de html donde va a mostrar los dias 
const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); //Calcula ultimo dia para darselo al siguiente mes y el 0 es el ultimo dia del mes anterior
const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
const firstDayIndex = date.getDay();//Obtiene el primer dia del mes con su posicion, que puede ser lunes o jueves
const lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
const nextDays = 6 - lastDayIndex; //Calcula cuantos dias necesita agregar para completar el mes a lo que se finalice los dias del mes actual

const months = [ 
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]; //Nombre de los meses 

document.querySelector(".date h1").innerHTML = months[date.getMonth()] + " " + date.getFullYear(); //Actualiza encabezado 
const fechaHoy = new Date(); //Coloca fecha actuaal (la bolita)
const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }; //Define el formato de las fechas 
document.querySelector(".date p").innerHTML = fechaHoy.toLocaleDateString('es-ES', opciones); //Muestra fecha actual en formato largo (martes, 15...)
  

let days = ""; //Inicia los dias en el html

for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
}//Agrega los ultimos dias del mes anterior al actual para rellenar espacios has que inicie el mes

for (let i = 1; i <= lastDay; i++) {
    const current = new Date();
    const currentDate = `${i.toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`; //Crea cadena de fecha de cada bolita DD-MM-YYYY
    const isToday = i === current.getDate() &&
    date.getMonth() === current.getMonth() && 
    date.getFullYear() === current.getFullYear();//Verifica si el día actual concuerda con la fecha para resaltar la bolita

    days += `<div class="${isToday ? "today" : ""}" onclick="openModal('${currentDate}')">${i}</div>`; //Clase today
}//Agrega todos los dias del mes actual al calendario

for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
}//Días del siguiente mes 

monthDays.innerHTML = days; //Inserta todo el html
};

document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
}); //Al darle click a < retrocede al mes anterior

document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});//Al darle click a > avanza al siguiente mes 


function openModal(dateStr) { //Abre la clase de los pendientes (Modal)
  const modal = document.getElementById("taskModal");
  const taskList = document.getElementById("taskList");
  const selectedDateEl = document.getElementById("selectedDate");

  selectedDateEl.textContent = dateStr; //Muestra la fecha 
  taskList.innerHTML = "";

  if (tasks[dateStr]) {
    tasks[dateStr].forEach(t => {
      const li = document.createElement("li");
      li.textContent = t;
      taskList.appendChild(li);
    });
  } else {
    taskList.innerHTML = "<li>No hay pendientes.</li>";
  }

  modal.style.display = "block"; //Muestra las tareas
}

function closeModal() {
  document.getElementById("taskModal").style.display = "none";
} //Función para cerrar ventana de pendientes

renderCalendar(); //Para inicializar el calendario de nuevo 
