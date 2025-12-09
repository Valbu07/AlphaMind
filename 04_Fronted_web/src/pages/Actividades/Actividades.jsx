import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { actividadesService } from "../../services/actividadesServices";
import { funcionariosService } from "../../services/FuncionariosService";
import "./Actividades.css";

export default function Actividades() {
    const { token, user } = useAuth();
    const [actividades, setActividades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mensaje, setMensaje] = useState("");
    const [idUsuarioActual, setIdUsuarioActual] = useState(null);

    useEffect(() => {
        if (token && user) {
            obtenerIdUsuario();
        }
    }, [token, user]);

    useEffect(() => {
        if (idUsuarioActual) {
            cargarActividadesAsignadas();
        }
    }, [idUsuarioActual]);

    const obtenerIdUsuario = async () => {
        try {
            console.log("=== OBTENIENDO ID USUARIO ===");
            console.log("👤 Usuario desde auth:", user);

            // Si ya tiene id_usuario, usarlo
            let userId = user?.id_usuario || user?.Id_Usuario || user?.id || user?.ID;
            
            if (userId) {
                console.log("✅ ID encontrado directamente:", userId);
                setIdUsuarioActual(userId);
                return;
            }

            // Si no tiene ID pero tiene num_documento, buscarlo en funcionarios
            if (user?.num_documento) {
                console.log("🔍 Buscando por num_documento:", user.num_documento);
                const data = await funcionariosService.getAll(token);
                const funcionarios = data.body || data;
                
                console.log("📋 Total funcionarios:", funcionarios.length);

                const funcionarioActual = funcionarios.find(
                    f => String(f.Num_Documento || f.num_documento) === String(user.num_documento)
                );

                if (funcionarioActual) {
                    userId = funcionarioActual.id_usuario || funcionarioActual.Id_Usuario;
                    console.log("✅ ID encontrado en funcionarios:", userId);
                    console.log("👤 Funcionario completo:", funcionarioActual);
                    setIdUsuarioActual(userId);
                } else {
                    console.error("❌ No se encontró funcionario con num_documento:", user.num_documento);
                    setMensaje("❌ Error: Usuario no encontrado");
                }
            } else {
                console.error("❌ Usuario no tiene ID ni num_documento");
                setMensaje("❌ Error: Datos de usuario incompletos");
            }
        } catch (error) {
            console.error("❌ Error al obtener ID usuario:", error);
            setMensaje("❌ Error al cargar datos del usuario");
        }
    };

    const cargarActividadesAsignadas = async () => {
        setLoading(true);
        
        try {
            if (!token) {
                setMensaje("❌ No hay sesión activa");
                setLoading(false);
                return;
            }

            if (!idUsuarioActual) {
                console.log("⏳ Esperando ID de usuario...");
                setLoading(false);
                return;
            }

            console.log("=== CARGANDO ACTIVIDADES ===");
            console.log("🆔 ID Usuario actual:", idUsuarioActual);
            
            // Obtener todas las actividades
            const data = await actividadesService.getAll(token);
            const todasActividades = data.body || data;
            
            console.log("📦 Total actividades en API:", todasActividades.length);

            // Mostrar todos los IDs asignados
            console.log("📋 IDs asignados en actividades:");
            todasActividades.forEach((act, index) => {
                const idAsignado = act.Asignado_a_idUsuario || act.asignado_a;
                console.log(`  Actividad ${index + 1}: "${act.asunto || act.actividad?.asunto}" → asignado_a: ${idAsignado}`);
            });

            // Filtrar solo las actividades asignadas al usuario actual
            const actividadesDelUsuario = todasActividades.filter(act => {
                const idAsignado = act.Asignado_a_idUsuario || act.asignado_a;
                const coincide = idAsignado == idUsuarioActual;
                
                console.log(`🔍 Comparando: ${idAsignado} == ${idUsuarioActual} → ${coincide}`);
                
                return coincide;
            });

            console.log("✅ Actividades filtradas:", actividadesDelUsuario.length);

            // Mapear las actividades al formato que necesita el componente
            const actividadesMapeadas = actividadesDelUsuario.map(act => {
                const actData = act.actividad || act;
                const tareaData = act.tarea || {};
                
                // Extraer subtareas del formato "subtarea1 | subtarea2 | subtarea3"
                const subtareasTexto = typeof tareaData === 'string' ? tareaData : tareaData.titulo || '';
                const subtareasArray = subtareasTexto
                    .split(' | ')
                    .filter(t => t.trim())
                    .map(texto => ({
                        texto: texto.trim(),
                        completada: false
                    }));

                return {
                    id: actData.id_Actividad || act.id_Actividad,
                    de: act.nombre_asignador || "Administrador",
                    asunto: actData.asunto || act.asunto || "Sin asunto",
                    fecha: actData.fecha_vencimiento || act.fecha_vencimiento 
                        ? (actData.fecha_vencimiento || act.fecha_vencimiento).split('T')[0] 
                        : "Sin fecha",
                    prioridad: (actData.prioridad || act.prioridad || "media").toLowerCase(),
                    subtareas: subtareasArray,
                    descripcion: actData.descripcion || act.descripcion || "Sin descripción"
                };
            });

            console.log("🎯 Actividades finales a mostrar:", actividadesMapeadas.length);
            setActividades(actividadesMapeadas);

        } catch (error) {
            console.error("❌ Error completo:", error);
            setMensaje("❌ Error al cargar actividades");
        } finally {
            setLoading(false);
        }
    };

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
            <h1 className="titulo-principal">Mis Actividades</h1>

            {loading ? (
                <div className="loading-container">
                    <p>Cargando actividades...</p>
                </div>
            ) : actividades.length === 0 ? (
                <div className="empty-container">
                    <p>No tienes actividades asignadas</p>
                </div>
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
                })
            )}
        </div>
    );
}