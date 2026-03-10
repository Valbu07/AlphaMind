import { useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsJournalPlus } from "react-icons/bs";
import { useAuth } from "../../hooks/useAuth";
import { actividadesService } from "../../services/actividadesServices";
import { funcionariosService } from "../../services/FuncionariosService";
import "./CrearActividades.css";
import { decodeToken } from "../../utils/jwtUtilis"; 

export default function CrearActividades() {
    const { token, user } = useAuth();
    const [vista, setVista] = useState("crear");
    const [loading, setLoading] = useState(false);
    const [mensaje, setMensaje] = useState("");
    const [funcionarios, setFuncionarios] = useState([]);
    const [actividades, setActividades] = useState([]);
    const [subtareas, setSubtareas] = useState([]);
    const [para, setPara] = useState("");
    const [fecha, setFecha] = useState("");
    const [asunto, setAsunto] = useState("");
    const [prioridad, setPrioridad] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [modoEdicion, setModoEdicion] = useState(false);
    const [actividadEditando, setActividadEditando] = useState(null);
    const [funcionariosCargados, setFuncionariosCargados] = useState(false);

    useEffect(() => { cargarFuncionarios(); }, [token]);
    useEffect(() => { 
        if (vista === "asignadas" && funcionariosCargados) cargarActividades(); 
    }, [vista, funcionariosCargados, token]);


    
    const cargarFuncionarios = async () => {
        try {
            if (!token) return;
            const data = await funcionariosService.getAll(token);
            setFuncionarios(Array.isArray(data) ? data : data.body);
            setFuncionariosCargados(true);
        } catch (error) {
            setMensaje("Error al cargar funcionarios");
        }
    };

    const extraerSubtareas = (tarea) => {
    if (!tarea) return [];
    const texto = typeof tarea === "string" ? tarea : tarea.titulo || tarea.tarea || "";
    // Separar por " | " y limpiar espacios
    return texto.split(" | ").filter((t) => t.trim()).map(t => t.trim());
    };

    const obtenerNombreFuncionario = (idAsignado) => {
        if (!idAsignado) return "Usuario Inactivo";
        const func = funcionarios.find(
            (f) => (f.id_usuario || f.Id_Usuario) == idAsignado
        );
        return func
            ? `${func.Primer_Nombre || func.primer_nombre} ${
                  func.Primer_Apellido || func.primer_apellido
              }`.trim()
            : "Usuario Inactivo";
    };

    const cargarActividades = async () => {
    setLoading(true);
    setMensaje("");
    try {
        if (!token) return setMensaje("Error: No hay sesión activa");

        const data = await actividadesService.getAll(token);
        const actividadesConNombres = (data.body || data).map((act) => {
            const idAsignado =
                act.asignacion?.asignado_a ||
                act.Asignado_a_idUsuario ||
                act.asignado_a;

            // Parsear subtareas del texto separado por " | "
            const tareaRaw = act.tarea || "";
            const subtareasTexto = tareaRaw.split(" | ").filter(t => t.trim()).map(t => t.trim());

            return {
                ...act,
                nombre_asignado: obtenerNombreFuncionario(idAsignado),
                asunto: act.asunto || "",
                descripcion: act.descripcion || "",
                fecha_vencimiento: act.fecha_vencimiento || "",
                prioridad: act.prioridad || "Media",
                subtareas_array: subtareasTexto,
                id_Actividad: act.id_Actividad,
                Asignado_a_idUsuario: idAsignado,
                estado_actual: act.estado_actual || "Pendiente"
            };
        });

        setActividades(actividadesConNombres);
    } catch (error) {
        setMensaje("Error al cargar actividades");
        console.error(error);
    } finally {
        setLoading(false);
    }
    };

    const agregarSubtarea = () => setSubtareas([...subtareas, ""]);
    const cambiarSubtarea = (index, val) => {
        const nuevas = [...subtareas];
        nuevas[index] = val;
        setSubtareas(nuevas);
    };
    const eliminarSubtarea = (i) =>
        setSubtareas(subtareas.filter((_, idx) => idx !== i));

    const cancelar = () => {
        setPara("");
        setFecha("");
        setAsunto("");
        setPrioridad("");
        setDescripcion("");
        setSubtareas([]);
        setModoEdicion(false);
        setActividadEditando(null);
        setMensaje("");
    };

   const asignar = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setMensaje("");

    try {
        if (!token || !para || !asunto || !fecha || !prioridad) {
            setMensaje("Completa todos los campos obligatorios");
            return;
        }

        const decoded = decodeToken(token);

        const idUsuarioFinal =
            decoded?.id_usuario ||
            decoded?.Id_Usuario ||
            decoded?.id ||
            decoded?.ID;

        if (!idUsuarioFinal) {
            setMensaje("No se pudo obtener el ID del usuario desde el token");
            return;
        }

        const asignadoA = parseInt(para);
        const fechaCreacion = new Date().toISOString().slice(0, 19).replace("T", " ");
        const fechaVenc = fecha + " 23:59:59";

        let prioridadFinal = prioridad.charAt(0).toUpperCase() + prioridad.slice(1);
        if (prioridadFinal === "Baja") {
            prioridadFinal = "Bajo";
        }

        const actividadData = {
            actividad: {
                asunto: asunto.trim(),
                descripcion: descripcion.trim(),
                fecha_creacion: fechaCreacion,
                fecha_vencimiento: fechaVenc,
                prioridad: prioridadFinal,
                fecha_de_entrega: null,
                estado_actual: "Pendiente",
            },
            tarea: {
                titulo: subtareas.length > 0
                    ? subtareas.filter(s => s.trim()).join(" | ")
                    : asunto.trim()
            },
            asignacion: {
                asignado_por: idUsuarioFinal, 
                asignado_a: asignadoA,
            },
        };

        // Crear o editar actividad
        if (modoEdicion && actividadEditando) {
            await actividadesService.update(
                token,
                actividadEditando,
                actividadData
            );
            setMensaje("✅ Actividad actualizada correctamente");
        } else {
            await actividadesService.create(token, actividadData);
            setMensaje("✅ Actividad creada correctamente");
        }

        setTimeout(() => {
            cancelar();
            if (vista === "asignadas") cargarActividades();
        }, 1500);

    } catch (error) {
        const mensajeError =
            error.response?.data?.mensaje ||
            error.response?.data?.message ||
            "Error desconocido";
        setMensaje(mensajeError);
    } finally {
        setLoading(false);
    }
    };

    const handleEditarClick = (actividad) => {
    const act = actividad.actividad || actividad;
    setAsunto(act.asunto || actividad.asunto || "");
    setDescripcion(act.descripcion || actividad.descripcion || "");

    const fechaVenc = act.fecha_vencimiento || actividad.fecha_vencimiento;
    setFecha(
        fechaVenc
            ? fechaVenc.includes("T")
                ? fechaVenc.split("T")[0]
                : fechaVenc.split(" ")[0]
            : ""
    );

    setPrioridad((act.prioridad || actividad.prioridad || "").toLowerCase());
    setPara(
        actividad.asignacion?.asignado_a ||
            actividad.Asignado_a_idUsuario ||
            actividad.asignado_a ||
            ""
    );
    
    // Cargar subtareas desde el array
    setSubtareas(actividad.subtareas_array || []);
    
    setActividadEditando(act.id_Actividad || actividad.id_Actividad);
    setModoEdicion(true);
    setVista("crear");
    };

    const handleEliminar = async (id_actividad) => {
        if (!window.confirm("¿Eliminar esta actividad?")) return;
        setLoading(true);

        try {
            if (!token) return setMensaje("❌ No hay sesión activa");
            await actividadesService.delete(token, id_actividad);
            setMensaje("✅ Actividad eliminada correctamente");
            cargarActividades();
        } catch (error) {
            setMensaje("No se pudo eliminar la actividad");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contenedor-principal">
            {mensaje && (
                <div
                    className={`mensaje-notificacion ${
                        mensaje.includes("✅") ? "exito" : "error"
                    }`}
                >
                    <span className="mensaje-texto">{mensaje}</span>
                    <button
                        className="mensaje-cerrar"
                        onClick={() => setMensaje("")}
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="botones-principales">
                <button
                    className="btn btn-editar"
                    onClick={() => {
                        setVista("crear");
                        if (!modoEdicion) cancelar();
                    }}
                    style={{
                        backgroundColor:
                            vista === "crear" ? "#f7a840" : "#faca77",
                    }}
                >
                    {modoEdicion ? "Editando Actividad" : "Crear Actividades"}
                </button>

                <button
                    className="btn"
                    onClick={() => setVista("asignadas")}
                    style={{
                        backgroundColor:
                            vista === "asignadas" ? "#f7a840" : "#faca77",
                    }}
                >
                    Actividades Asignadas
                </button>
            </div>

            {vista === "crear" && (
                <div className="contenedor-CA">
                    <h1>{modoEdicion ? "Editar Actividad" : "Crear Actividad"}</h1>

                    <form className="form" onSubmit={asignar}>
                        <div className="input-group has-validation">
                            <select
                                className="form-control"
                                value={para}
                                onChange={(e) => setPara(e.target.value)}
                                required
                                disabled={loading}
                            >
                                <option value="">Selecciona un funcionario</option>
                                {funcionarios.map((func) => (
                                    <option
                                        key={func.Num_Documento || func.num_documento}
                                        value={func.id_usuario || func.Id_Usuario}
                                    >
                                        {`${func.Primer_Nombre || func.primer_nombre} ${
                                            func.Primer_Apellido ||
                                            func.primer_apellido
                                        }`}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="input-group has-validation">
                            <div className="form-floating is-invalid">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={asunto}
                                    onChange={(e) => setAsunto(e.target.value)}
                                    placeholder="Asunto"
                                    required
                                    disabled={loading}
                                />
                                <label>Asunto</label>
                            </div>
                        </div>

                        <div className="fecha">
                            <input
                                type="date"
                                value={fecha}
                                onChange={(e) => setFecha(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="input-group has-validation">
                            <select
                                className="form-control"
                                value={prioridad}
                                onChange={(e) => setPrioridad(e.target.value)}
                                required
                                disabled={loading}
                            >
                                <option value="">Prioridad</option>
                                <option value="alta">Alta</option>
                                <option value="media">Media</option>
                                <option value="baja">Baja</option>
                            </select>
                        </div>

                        <div className="subTarea">
                            <button
                                type="button"
                                onClick={agregarSubtarea}
                                disabled={loading}
                            >
                                <BsJournalPlus size={20} /> Subtarea
                            </button>
                        </div>

                        {subtareas.map((sub, i) => (
                            <div key={i} className="subtarea-container">
                                <input
                                    type="text"
                                    placeholder={`Subtarea ${i + 1}`}
                                    value={sub}
                                    onChange={(e) =>
                                        cambiarSubtarea(i, e.target.value)
                                    }
                                    className="subtarea-input"
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => eliminarSubtarea(i)}
                                    className="btn-icon"
                                    disabled={loading}
                                >
                                    <AiOutlineClose />
                                </button>
                            </div>
                        ))}

                        <div className="input-group has-validation">
                            <div className="form-floating is-invalid">
                                <input
                                    type="text"
                                    className="form-control"
                                    value={descripcion}
                                    onChange={(e) =>
                                        setDescripcion(e.target.value)
                                    }
                                    placeholder="Descripción"
                                    disabled={loading}
                                />
                                <label>Descripción</label>
                            </div>
                        </div>

                        <div className="botones-finales">
                            <div className="boton-cancelar">
                                <button
                                    type="button"
                                    onClick={cancelar}
                                    disabled={loading}
                                >
                                    Cancelar
                                </button>
                            </div>
                            <div className="boton-asignar">
                                <button type="submit" disabled={loading}>
                                    {loading
                                        ? modoEdicion
                                            ? "Actualizando..."
                                            : "Asignando..."
                                        : modoEdicion
                                        ? "Actualizar"
                                        : "Asignar"}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {vista === "asignadas" && (
                <div>
                    {loading ? (
                        <p style={{ textAlign: "center", marginTop: "2rem" }}>
                            Cargando...
                        </p>
                    ) : actividades.length === 0 ? (
                        <p style={{ textAlign: "center", marginTop: "2rem" }}>
                            No hay actividades
                        </p>
                    ) : (
                        actividades.map((act) => (
                            <div
                                key={act.id_Actividad}
                                className="contenedor-AA"
                            >
                                <div className="header-actividad">
                                    <h3 className="asignado">
                                        {act.nombre_asignado || "Usuario Eliminado"}
                                    </h3>
                                    <span
                                        className={`prioridad ${(
                                            act.prioridad || ""
                                        ).toLowerCase()}`}
                                    >
                                        {(act.prioridad || "MEDIA").toUpperCase()}
                                    </span>
                                </div>

                                <div className="detalle-actividad">
                                    <span>
                                        <strong>Asunto:</strong> {act.asunto}
                                    </span>
                                    <span>
                                        <strong>Vence:</strong>{" "}
                                        {act.fecha_vencimiento
                                            ? act.fecha_vencimiento.includes("T")
                                                ? act.fecha_vencimiento.split("T")[0]
                                                : act.fecha_vencimiento.split(" ")[0]
                                            : "Sin fecha"}
                                    </span>
                                    <span>
                                        <strong>Estado:</strong>{" "}
                                        <span style={{
                                            color: act.estado_actual === "Completado" ? "#4caf50" : 
                                                act.estado_actual === "Entregado con retraso" ? "#ff5252" : "#f7a840",
                                            fontWeight: "600"
                                        }}>
                                            {act.estado_actual}
                                        </span>
                                    </span>
                                </div>

                                {act.subtareas_array && act.subtareas_array.length > 0 && (
                                    <div className="seccion-subtareas">
                                        <h4 className="titulo-subtareas">
                                            Subtareas:
                                        </h4>
                                        <ul className="lista-subtareas">
                                            {act.subtareas_array.map((sub, i) => (
                                                <li key={i} className="item-subtarea">
                                                    <span className="texto-subtarea">
                                                        {sub}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <p className="descripcion">
                                    {act.descripcion || "Sin descripción"}
                                </p>

                                <div className="botones-finales">
                                    <div className="boton-cancelar">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEliminar(act.id_Actividad)
                                            }
                                            disabled={loading}
                                        >
                                            {loading
                                                ? "Eliminando..."
                                                : "Eliminar"}
                                        </button>
                                    </div>
                                    <div className="boton-asignar">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleEditarClick(act)
                                            }
                                            disabled={loading}
                                        >
                                            Editar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}