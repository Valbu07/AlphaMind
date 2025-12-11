import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { recuperarContrasena } from '../../services/recuperarContraseña';
import './recuperarContraseña.css';

const RecuperarContrasena = () => {
  const [numDocumento, setNumDocumento] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);
    setError(null);

    try {
      // Llamar al servicio
      const data = await recuperarContrasena(numDocumento);
      
      setMensaje(`✅ ${data.body.mensaje}. Revisa tu bandeja de entrada.`);
      setNumDocumento('');
    } catch (err) {
      setError(err.message || '❌ No se pudo conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recuperar-contrasena">
      <div className="header">
        <div className="row">
          <div className="col-12">
            <div className="Titulo">
              <h1>Recuperar Contraseña</h1>
            </div>
          </div>
        </div>
      </div>

      <hr />
      
      <div className="container">
        <div className="row">
          <div className="col-12">
            <div className="Validacion">
              <div className="icono">
                <i className="bi bi-person-fill-lock"></i>
              </div>
              
              <h3>¿Olvidaste tu contraseña?</h3>
              <p>Ingresa tu número de documento y te enviaremos tu contraseña al correo registrado.</p>
              
              <hr />

              {mensaje && (
                <div style={{
                  background: '#d4edda',
                  border: '1px solid #c3e6cb',
                  color: '#155724',
                  padding: '15px',
                  borderRadius: '5px',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  {mensaje}
                </div>
              )}

              {error && (
                <div style={{
                  background: '#f8d7da',
                  border: '1px solid #f5c6cb',
                  color: '#721c24',
                  padding: '15px',
                  borderRadius: '5px',
                  marginBottom: '20px',
                  textAlign: 'center'
                }}>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="input-group has-validation">
                  <span className="input-group-text">
                    <i className="bi bi-badge-cc-fill"></i>
                  </span>
                  <div className="form-floating">
                    <input
                      type="text"
                      className="form-control"
                      id="floatingInputGroup2"
                      placeholder="Documento"
                      value={numDocumento}
                      onChange={(e) => setNumDocumento(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <label htmlFor="floatingInputGroup2">Número de Documento</label>
                  </div>
                </div>

                <div className="boton">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? '⏳ Enviando...' : '📧 Enviar Contraseña'}
                  </button>
                </div>
              </form>

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/" style={{ color: '#374e9f', textDecoration: 'none', fontWeight: '500' }}>
                  ← Volver al inicio de sesión
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecuperarContrasena;