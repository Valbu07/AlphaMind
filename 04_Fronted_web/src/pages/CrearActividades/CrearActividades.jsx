import { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BsJournalPlus } from "react-icons/bs";
import "./CrearActividades.css";

export default function CrearActividades() {        
    const [vista, setVista] = useState("crear"); /*controla botones*/

    const [subtareas, setSubtareas] = useState([]);
    const [para, setPara] = useState("");
    const [fecha, setFecha] = useState("");
    const [asunto, setAsunto] = useState("");
    const [prioridad, setPrioridad] = useState("");
    const [descripcion, setDescripcion] = useState("");

    const agregarSubtarea = () => setSubtareas([...subtareas, ""]); 

    const cambiarSubtarea = (index, valor) => {
        const nuevas = [...subtareas];
        nuevas[index] = valor;
        setSubtareas(nuevas);
    };

    const eliminarSubtarea = (index) =>
        setSubtareas(subtareas.filter((_, i) => i !== index)
);

    const cancelar = () => {
        setPara("");
        setFecha("");
        setAsunto("");
        setPrioridad("");
        setDescripcion("");
        setSubtareas([]);
    };

    const asignar = () => {
    console.log("Nueva tarea:", {para, asunto, fecha, prioridad, subtareas, descripcion });
    alert("✅ Tarea creada con éxito");
        setPara("");
        setFecha("");
        setAsunto("");
        setPrioridad("");
        setDescripcion("");
        setSubtareas([]);
    };

    const [actividades, setActividades] = useState([
    {
        asignado: "Danna Rodriguez",
        asunto: "Crear plantilla para informe mensual",
        fecha: "2024-10-15",
        prioridad: "alta",
        subtareas: [
            { texto: "Estructura de documento (excel)", completada: true },
            { texto: "Configurar formato y campos automáticos", completada: false }
        ],
        descripcion: "Debes crear una plantilla donde se pueda ejecutar fórmulas para automatizar cálculos..."
    }
    ]);


    return (
        <div className="contenedor-principal">
        <div className="botones-principales">
            <button className="btn btn-warning" onClick={() => setVista("crear")}>
            Crear Actividades
            </button>
            <button className="btn btn-warning" onClick={() => setVista("asignadas")}>
            Actividades Asignadas
            </button>
        </div>

        {vista === "crear" && (
            <div className="contenedor-CA">
            <h1>Crear actividad</h1>
            <form className="form">
                <div className="input-group has-validation">
                <select
                    className="form-control"
                    value={para}
                    onChange={(e) => setPara(e.target.value)}
                >
                    <option value="">Selecciona un usuario</option>
                    <option value="danna">Danna Rodriguez</option>
                    <option value="daniel">Daniel Valbuena</option>
                    <option value="dayana">Dayana Machado</option>
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
                />
                </div>

                <div className="input-group has-validation">
                <select
                    className="form-control"
                    value={prioridad}
                    onChange={(e) => setPrioridad(e.target.value)}
                >
                    <option value="">Prioridad</option>
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                </select>
                </div>

                <div className="subTarea">
                <button type="button" onClick={agregarSubtarea}>
                    <BsJournalPlus size={20} /> Subtarea
                </button>
                </div>

                {subtareas.map((sub, i) => (
                <div key={i} className="subtarea-container">
                    <input
                    type="text"
                    placeholder={`Subtarea ${i + 1}`}
                    value={sub}
                    onChange={(e) => cambiarSubtarea(i, e.target.value)}
                    className="subtarea-input"
                    />
                    <button
                    type="button"
                    onClick={() => eliminarSubtarea(i)}
                    className="btn-icon"
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
                    onChange={(e) => setDescripcion(e.target.value)}
                    placeholder="Descripción"
                    />
                    <label>Descripción</label>
                </div>
                </div>

                <div className="botones-finales">
                <div className="boton-cancelar">
                    <button type="button" onClick={cancelar}>
                    Cancelar
                    </button>
                </div>
                <div className="boton-asignar">
                    <button type="submit" onClick={asignar}>Asignar</button>
                </div>
                </div>
            </form>
            </div>
        )}

        {vista === "asignadas" && actividades.map((act) =>((
        <div key={act.asunto} className="contenedor-AA">
        <div className="header-actividad">
            <h3 className="asignado">{act.asignado}</h3>
            <span className={`prioridad ${act.prioridad}`}>
                {act.prioridad.toUpperCase()}
            </span>
        </div>

        <div className="detalle-actividad">
            <span><strong>Asunto:</strong> {act.asunto}</span>
            <span><strong>Vence:</strong> {act.fecha}</span>
        </div>

        <div className="seccion-subtareas">
            <h4 className="titulo-subtareas">Subtareas:</h4>
            <ul className="lista-subtareas">
                {act.subtareas.map((sub, i) => (
                <li key={i} className="item-subtarea">
                    <span className={`texto-subtarea ${sub.completada ? "completada" : ""}`}>
                    {sub.texto}
                    </span>
                </li>
                ))}
            </ul>
        </div>

        <p className="descripcion">{act.descripcion}</p>

        <div className="botones-finales">
            <div className="boton-cancelar">
                <button type="button" >Eliminar</button>
            </div>
            <div className="boton-asignar">
                <button type="submit" >Actualizar</button>
            </div>
        </div>

        </div>
        )))}



        </div>
    );
}
