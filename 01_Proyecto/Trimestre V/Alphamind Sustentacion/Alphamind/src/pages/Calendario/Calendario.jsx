import React, { useState } from "react";
import "./Calendario.css"; 


export default function Calendario() {
  const [date, setDate] = useState(new Date());

  // Renderizar calendario
  const renderDays = () => {
    const currentMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
    const prevLastDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      0
    ).getDate();
    const firstDayIndex = currentMonth.getDay();
    const lastDayIndex = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDay();
    const nextDays = 6 - lastDayIndex;

    let days = [];

    // Días del mes anterior
    for (let x = firstDayIndex; x > 0; x--) {
      days.push(
        <div key={`prev-${x}`} className="prev-date">
          {prevLastDay - x + 1}
        </div>
      );
    }

    // Días del mes actual
    for (let i = 1; i <= lastDay; i++) {
      const current = new Date();
      const currentDate = `${i.toString().padStart(2, "0")}-${(
        date.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;

      const isToday =
        i === current.getDate() &&
        date.getMonth() === current.getMonth() &&
        date.getFullYear() === current.getFullYear();

      days.push(
        <div
          key={i}
          className={isToday ? "today" : ""}
        >
          {i}
        </div>
      );
    }

    // Días del mes siguiente
    for (let j = 1; j <= nextDays; j++) {
      days.push(
        <div key={`next-${j}`} className="next-date">
          {j}
        </div>
      );
    }

    return days;
  };


  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  return (
        <div className="calendar">
          <div className="month">
            <i className="prev" onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))}>
              &#10094;
            </i>
            <div className="date">
              <h1>{months[date.getMonth()]} {date.getFullYear()}</h1>
              <p>{new Date().toLocaleDateString("es-ES", {
                weekday: "long", year: "numeric", month: "long", day: "numeric"
              })}</p>
            </div>
            <i className="next" onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))}>
              &#10095;
            </i>
          </div>

          <div className="weekdays">
            <div>Dom</div>
            <div>Lun</div>
            <div>Mar</div>
            <div>Mié</div>
            <div>Jue</div>
            <div>Vie</div>
            <div>Sáb</div>
          </div>

          <div className="days">{renderDays()}</div>
        </div>
  );
}
