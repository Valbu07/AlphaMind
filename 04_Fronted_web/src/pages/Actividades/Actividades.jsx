import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { actividadesService } from "../../services/actividadesServices";
import { decodeToken } from "../../utils/jwtUtilis";
import "./Actividades.css";

export default function Actividades() {
    const { token } = useAuth();
    const [actividades, setActividades] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");

    useEffect(() => {
        cargarActividadesAsignadas();
    }, [token]);

    const cargarActividadesAsignadas = async () => {
        setLoading(true);
        try {
            if (!token) return;
            
            const decoded = decodeToken(token);
            const idUsuario = decoded?.id_usuario || decoded?.Id_Usuario || decoded?.id || decoded?.ID;
            
            if (!idUsuario) {
                setMensaje("Error: No se pudo obtener el ID del usuario");
                return;
            }

            const data = await actividadesService.getAsignadasAMi(token, idUsuario);
            
            const actividadesProcesadas = (data.body || data).map(act => {
            const subtareasRaw = act.tarea;
            const textos = subtareasRaw ? subtareasRaw.split(" | ").filter(t => t.trim()) : [];
            
            const estadoGuardado = localStorage.getItem(`subtareas_${act.id_Actividad}`);
            let estadoSubtareas = [];
            
            if (estadoGuardado) {
                try {
                    estadoSubtareas = JSON.parse(estadoGuardado);
                } catch (e) {
                    estadoSubtareas = [];
                }
            }
            
            const subtareas = textos.map((texto, index) => {
                const estadoPrevio = estadoSubtareas.find(s => s.texto === texto);
                return {
                    texto,
                    completada: estadoPrevio ? estadoPrevio.completada : false
                };
            });

                return {
                    id: act.id_Actividad,
                    de: act.nombre_asignador || "Administrador",
                    asunto: act.asunto || "",
                    fecha: act.fecha_vencimiento 
                        ? (act.fecha_vencimiento.includes("T") 
                            ? act.fecha_vencimiento.split("T")[0] 
                            : act.fecha_vencimiento.split(" ")[0])
                        : "Sin fecha",
                    prioridad: (act.prioridad || "media").toLowerCase(),
                    subtareas: subtareas,
                    descripcion: act.descripcion || "Sin descripción",
                    estado_actual: act.estado_actual || "Pendiente",
                    id_Actividad: act.id_Actividad
                };
            });

            setActividades(actividadesProcesadas);
        } catch (error) {
            setMensaje("❌ Error al cargar actividades");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const calcularProgreso = (subtareas) => {
        if (!subtareas || subtareas.length === 0) return 0;
        const completadas = subtareas.filter(s => s.completada).length;
        return Math.round((completadas / subtareas.length) * 100);
    };

    const toggleSubtarea = async (actividad, subtareaIndex) => {
        // Actualizar estado local 
        const nuevasSubtareas = [...actividad.subtareas];
        nuevasSubtareas[subtareaIndex].completada = !nuevasSubtareas[subtareaIndex].completada;
        
        const progreso = calcularProgreso(nuevasSubtareas);
        
        // Guardar en localStorage
        localStorage.setItem(
            `subtareas_${actividad.id_Actividad}`,
            JSON.stringify(nuevasSubtareas)
        );

        // Actualizar en el estado local
        setActividades(actividades.map(act => {
            if (act.id_Actividad === actividad.id_Actividad) {
                return { 
                    ...act, 
                    subtareas: nuevasSubtareas
                };
            }
            return act;
        }));

        // Si completó todas (100%), ENTONCES llamar al backend
        if (progreso === 100) {
            try {
                setLoading(true);
                await actividadesService.completarActividad(token, actividad.id_Actividad);
                
                // Actualizar el estado en el frontend
                setActividades(prevActividades => prevActividades.map(act => {
                    if (act.id_Actividad === actividad.id_Actividad) {
                        const fechaVenc = new Date(actividad.fecha);
                        const hoy = new Date();
                        const nuevoEstado = hoy > fechaVenc ? "Entregado con retraso" : "Completado";
                        
                        return { 
                            ...act, 
                            estado_actual: nuevoEstado
                        };
                    }
                    return act;
                }));
                
                setMensaje("✅ ¡Actividad completada!");
                setTimeout(() => setMensaje(""), 3000);
            } catch (error) {
                setMensaje("❌ Error al completar actividad");
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
    };

    const getEstadoColor = (estado) => {
        const colores = {
            "Pendiente": "#f7a840",
            "Completado": "#4caf50",
            "Entregado con retraso": "#ff5252"
        };
        return colores[estado] || "#999";
    };

    return (
        <div className="contenedor-principal">
            {mensaje && (
                <div className={`mensaje-notificacion ${mensaje.includes("✅") ? "exito" : "error"}`}>
                    <span className="mensaje-texto">{mensaje}</span>
                    <button className="mensaje-cerrar" onClick={() => setMensaje("")}>×</button>
                </div>
            )}

            <h1 className="titulo-principal">Mis Actividades</h1>

            {loading && actividades.length === 0 ? (
                <p style={{ textAlign: "center", marginTop: "2rem" }}>Cargando...</p>
            ) : actividades.length === 0 ? (
                <p style={{ textAlign: "center", marginTop: "2rem" }}>No tienes actividades asignadas</p>
            ) : (
                actividades.map((act) => {
                    const progreso = calcularProgreso(act.subtareas);

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
                                <span>
                                    <strong>Estado:</strong>{" "}
                                    <span style={{ 
                                        color: getEstadoColor(act.estado_actual),
                                        fontWeight: "600" 
                                    }}>
                                        {act.estado_actual}
                                    </span>
                                </span>
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
                                                    onChange={() => toggleSubtarea(act, i)}
                                                    className="checkbox-subtarea"
                                                    disabled={act.estado_actual === "Completado" || act.estado_actual === "Entregado con retraso"}
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
                })
            )}
        </div>
    );
}