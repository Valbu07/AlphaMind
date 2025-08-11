const date = new Date(); 

const tasks = {};
const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

storedTasks.forEach(task => {
  if (!task.realizada) {
    const date = new Date(task.vencimiento);
    const key = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getFullYear()}`;
    if (!tasks[key]) tasks[key] = [];
    tasks[key].push(`${task.asunto} - ${task.descripcion}`);
  }
});


const renderCalendar = () => { 
date.setDate(1);  
const monthDays = document.querySelector(".days"); 
const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(); 
const prevLastDay = new Date(date.getFullYear(), date.getMonth(), 0).getDate();
const firstDayIndex = date.getDay(); 
const lastDayIndex = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
const nextDays = 6 - lastDayIndex; 

const months = [ 
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
]; //Nombre de los meses 

document.querySelector(".date h1").innerHTML = months[date.getMonth()] + " " + date.getFullYear();  
const fechaHoy = new Date(); 
const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }; 
document.querySelector(".date p").innerHTML = fechaHoy.toLocaleDateString('es-ES', opciones); 
  

let days = ""; 

for (let x = firstDayIndex; x > 0; x--) {
    days += `<div class="prev-date">${prevLastDay - x + 1}</div>`;
} 

for (let i = 1; i <= lastDay; i++) {
    const current = new Date();
    const currentDate = `${i.toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`; 
    const isToday = i === current.getDate() &&
    date.getMonth() === current.getMonth() && 
    date.getFullYear() === current.getFullYear(); 

    days += `<div class="${isToday ? "today" : ""}" onclick="openModal('${currentDate}')">${i}</div>`; 
} 

for (let j = 1; j <= nextDays; j++) {
    days += `<div class="next-date">${j}</div>`;
} 

monthDays.innerHTML = days; 
};

document.querySelector(".prev").addEventListener("click", () => {
  date.setMonth(date.getMonth() - 1);
  renderCalendar();
}); 

document.querySelector(".next").addEventListener("click", () => {
  date.setMonth(date.getMonth() + 1);
  renderCalendar();
});  

function openModal(dateStr) { 
  const modal = document.getElementById("taskModal");
  const taskList = document.getElementById("taskList");
  const selectedDateEl = document.getElementById("selectedDate");

  selectedDateEl.textContent = dateStr; 
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

  modal.style.display = "block"; 
}

function closeModal() {
  document.getElementById("taskModal").style.display = "none";
} 

renderCalendar(); 
