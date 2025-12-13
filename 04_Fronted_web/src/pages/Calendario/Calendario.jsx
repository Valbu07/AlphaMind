import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { actividadesService } from "../../services/actividadesServices";
import { decodeToken } from "../../utils/jwtUtilis";
import "./Calendario.css"; 

export default function Calendario() {
  const { token } = useAuth();
  const [date, setDate] = useState(new Date());
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarActividades();
  }, [token, date]);

  const cargarActividades = async () => {
    if (!token) return;
    
    setLoading(true);
    try {
      const decoded = decodeToken(token);
      const idUsuario = decoded?.id_usuario || decoded?.Id_Usuario || decoded?.id || decoded?.ID;
      
      if (!idUsuario) return;

      const data = await actividadesService.getActividadesCalendario(token, idUsuario);
      setActividades(data);
    } catch (error) {
      console.error("Error al cargar actividades del calendario:", error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener actividades de un día específico
  const getActividadesDia = (dia, mes, año) => {
    return actividades.filter(act => {
      if (!act.fecha_vencimiento) return false;
      
      const fechaVenc = new Date(act.fecha_vencimiento);
      return (
        fechaVenc.getDate() === dia &&
        fechaVenc.getMonth() === mes &&
        fechaVenc.getFullYear() === año
      );
    });
  };

  // Determinar color según estado y fecha
  const getColorActividad = (actividad) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const fechaVenc = new Date(actividad.fecha_vencimiento);
    fechaVenc.setHours(0, 0, 0, 0);

    // Si ya está completada → verde
    if (actividad.estado_actual === "Completado") {
      return "#4caf50"; // Verde
    }
    
    // Si está entregada con retraso → rojo
    if (actividad.estado_actual === "Entregado con retraso") {
      return "#ff5252"; // Rojo
    }

    // Si la fecha ya pasó y NO está completada → rojo
    if (fechaVenc < hoy) {
      return "#ff5252"; // Rojo (atrasada)
    }

    // Si está pendiente y no ha vencido → amarillo
    return "#f7a840"; // Amarillo
  };

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
      const isToday =
        i === current.getDate() &&
        date.getMonth() === current.getMonth() &&
        date.getFullYear() === current.getFullYear();

      // Obtener actividades de este día
      const actividadesDia = getActividadesDia(i, date.getMonth(), date.getFullYear());

      days.push(
        <div
          key={i}
          className={`calendar-day ${isToday ? "today" : ""}`}
        >
          <div className="day-number">{i}</div>
          
          {actividadesDia.length > 0 && (
            <div className="actividades-dia">
              {actividadesDia.map((act, idx) => (
                <div
                  key={act.id}
                  className="actividad-item"
                  style={{
                    backgroundColor: getColorActividad(act),
                  }}
                  title={`${act.asunto} - ${act.estado_actual}`}
                >
                  <span className="actividad-texto">
                    {act.asunto.length > 15 
                      ? act.asunto.substring(0, 15) + "..." 
                      : act.asunto}
                  </span>
                </div>
              ))}
            </div>
          )}
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

      {/* Leyenda de colores */}
      <div className="calendar-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: "#4caf50" }}></span>
          <span>Completada</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: "#f7a840" }}></span>
          <span>Pendiente</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: "#ff5252" }}></span>
          <span>Atrasada/Con retraso</span>
        </div>
      </div>
    </div>
  );
}