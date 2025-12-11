// src/components/ChartCard.jsx
import React from 'react';

const ChartCard = ({ title, children, loading = false }) => {
  return (
    <div className="card chart-card p-3 shadow-sm">
      <h5 className="fw-bold">{title}</h5>
      <div className="chart-container mt-3">
        {loading ? (
          <div className="chart-placeholder d-flex justify-content-center align-items-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
};

export default ChartCard;