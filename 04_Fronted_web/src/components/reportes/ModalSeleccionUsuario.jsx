const ModalSeleccionUsuario = ({ mostrar, funcionarios, onSeleccionar, onCerrar }) => {
  if (!mostrar) return null;

  const handleSeleccionar = (funcionario) => {
    onSeleccionar(funcionario);
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal-contenido-reportes" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Seleccione un Usuario</h3>
          <button className="btn-cerrar" onClick={onCerrar}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="lista-usuarios">
            {funcionarios.map((func, index) => (
              <button
                key={index}
                className="usuario-item"
                onClick={() => handleSeleccionar(func)}
              >
                <div className="usuario-info">
                  <strong>{func.primer_nombre} {func.primer_apellido}</strong>
                  <small>Doc: {func.num_documento}</small>
                </div>
                <span className="icono-flecha">→</span>
              </button>
            ))}
          </div>
        </div>

        <div className="modal-footer d-flex justify-content-center">
          <button className="btn btn-secondary" onClick={onCerrar}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSeleccionUsuario;