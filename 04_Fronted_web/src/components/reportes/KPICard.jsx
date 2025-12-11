// src/components/KPICard.jsx
import React from 'react';

const KPICard = ({ title, value, loading = false }) => {
  return (
    <div className="card kpi-card shadow-sm mb-3 p-3">
      <span className="kpi-title">{title}</span>
      {loading ? (
        <div className="spinner-border spinner-border-sm text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      ) : (
        <span className="kpi-value">{value}</span>
      )}
    </div>
  );
};

export default KPICard;