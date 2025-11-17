import { useState } from "react";
import "./Actividades.css";

export default function Actividades() {        

    const [actividades, setActividades] = useState([
        {
            id: 1,
            de: "Danna Rodriguez",
            asunto: "Crear plantilla para informe mensual",
            fecha: "2024-10-15",
            prioridad: "alta",
            subtareas: [
                { texto: "Estrutura de documento (excel)", completada: false },
                { texto: "Configurar formato y campos automáticos", completada: false }
            ],
            descripcion: "Debes crear una plantilla donde se pueda ejecutar fórmulas para automatizar cálculos..."
        },
        {
            id: 2,
            de: "Daniel Valbuena",
            asunto: "Organizar archivo de empleados",
            fecha: "2024-10-20",
            prioridad: "media",
            subtareas: [
                { texto: "Clasificar documentos por tipo (contratos, hojas de vida, certificaciones).", completada: false },
                { texto: "Digitalizar y guardar copias en la nube.", completada: false },
                { texto: "Crear un índice de fácil acceso para consultas rápidas.", completada: false }
            ],
            descripcion: "Organizar archivo para..."
        },
        {
            id: 3,
            de: "Dayana Machado",
            asunto: "Preparar informe de gastos mensuales",
            fecha: "2024-10-25",
            prioridad: "baja",
            subtareas: [
                { texto: "Consolidar facturas y recibos del mes en una sola tabla.", completada: false }
            ],
            descripcion: "Verificar facturas y recibos para llevar acabo informe."
        }
    ]);

    const calcularProgreso = (subtareas) => {
        if (subtareas.length === 0) return 0;
        const completadas = subtareas.filter((s) => s.completada).length;
        return Math.round((completadas / subtareas.length) * 100);
    };

    const toggleSubtarea = (actividadId, subtareaIndex) => {
        setActividades(actividades.map(act => {
            if (act.id === actividadId) {
                const nuevasSubtareas = [...act.subtareas];
                nuevasSubtareas[subtareaIndex].completada = !nuevasSubtareas[subtareaIndex].completada;
                return { ...act, subtareas: nuevasSubtareas };
            }
            return act;
        }));
    };

    return (
        <div className="contenedor-principal">
        <h1 className="titulo-principal">Actividades</h1>

        {actividades.map((act) => {const progreso = calcularProgreso(act.subtareas);

            return (
                <div key={act.id} className="contenedor-actividad">
                    
                    <div className="header-actividad">
                        <h3 className="asunto">{act.asunto}</h3>
                        <span className={`prioridad ${act.prioridad}`}>
                            {act.prioridad.toUpperCase()}
                        </span>
                    </div>
                    
                    <div className="detalle-actividad">
                        <span><strong>De:</strong> {act.de}</span>
                        <span><strong>Vence:</strong> {act.fecha}</span>
                    </div>
                    
                    {act.subtareas.length > 0 && (
                        <div className="seccion-subtareas">
                            <h4 className="titulo-subtareas">Subtareas:</h4>
                            <ul className="lista-subtareas">
                                {act.subtareas.map((sub, i) => (
                                    <li key={i} className="item-subtarea">
                                        <input 
                                            type="checkbox" 
                                            checked={sub.completada}
                                            onChange={() => toggleSubtarea(act.id, i)}
                                            className="checkbox-subtarea"
                                        />
                                        <span className={`texto-subtarea ${sub.completada ? "completada" : ""}`}>
                                            {sub.texto}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <p className="descripcion">{act.descripcion}</p>
                    
                    {/* Barra de progreso */}
                    <div className="barra-contenedor">
                        <div className="barra-fondo">
                            <div 
                                className={`barra-relleno ${progreso === 100 ? "completo" : ""}`}
                                style={{ width: `${progreso}%` }}
                            ></div>
                        </div>
                    </div>
                    <p className="texto-progreso">{progreso}% completado</p>
                </div>
            );
            })}
        </div>
    );
}
