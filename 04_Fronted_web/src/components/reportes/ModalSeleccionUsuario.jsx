import { useState, useEffect } from "react";
import "./modalSeleccionUsuario.css";

const getInitials = (nombre, apellido) => {
  const n = nombre?.charAt(0) || "";
  const a = apellido?.charAt(0) || "";
  return (n + a).toUpperCase();
};

const ModalSeleccionUsuario = ({
  mostrar,
  funcionarios = [],
  onSeleccionar,
  onCerrar,
}) => {
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onCerrar();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onCerrar]);

  // Reset busqueda al abrir
  useEffect(() => {
    if (mostrar) setBusqueda("");
  }, [mostrar]);

  if (!mostrar) return null;

  const funcionariosFiltrados = funcionarios.filter((f) =>
    `${f.primer_nombre} ${f.primer_apellido} ${f.num_documento}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div className="msу-overlay" onClick={onCerrar}>
      <div className="msу-modal" onClick={(e) => e.stopPropagation()}>

        {/* HEADER */}
        <div className="msу-header">
          <div className="msу-header-left">
            <div className="msу-header-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <h3 className="msу-title">Seleccionar Funcionario</h3>
              <p className="msу-subtitle">{funcionarios.length} usuarios disponibles</p>
            </div>
          </div>
          <button className="msу-close" onClick={onCerrar} aria-label="Cerrar">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* BUSCADOR */}
        <div className="msу-search-wrap">
          <div className="msу-search-box">
            <svg className="msу-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              className="msу-search-input"
              placeholder="Buscar por nombre o documento…"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              autoFocus
            />
            {busqueda && (
              <button className="msу-search-clear" onClick={() => setBusqueda("")}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            )}
          </div>
          {busqueda && (
            <span className="msу-result-count">
              {funcionariosFiltrados.length} resultado{funcionariosFiltrados.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* LISTA */}
        <div className="msу-list-wrap">
          {funcionariosFiltrados.length > 0 ? (
            <ul className="msу-list">
              {funcionariosFiltrados.map((func, idx) => (
                <li key={func.num_documento} className="msу-item-wrap" style={{ animationDelay: `${idx * 30}ms` }}>
                  <button
                    className="msу-item"
                    onClick={() => onSeleccionar(func)}
                  >
                    <div className="msу-avatar">
                      {getInitials(func.primer_nombre, func.primer_apellido)}
                    </div>
                    <div className="msу-info">
                      <span className="msу-nombre">
                        {func.primer_nombre} {func.primer_apellido}
                      </span>
                      <span className="msу-doc">
                        <span className="msу-doc-label">DOC</span>
                        {func.num_documento}
                      </span>
                    </div>
                    <div className="msу-arrow">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="msу-empty">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#b0bec5" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p>No se encontraron usuarios</p>
              <span>Intenta con otro término de búsqueda</span>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="msу-footer">
          <button className="msу-btn-cancelar" onClick={onCerrar}>
            Cancelar
          </button>
        </div>

      </div>
    </div>
  );
};

export default ModalSeleccionUsuario;