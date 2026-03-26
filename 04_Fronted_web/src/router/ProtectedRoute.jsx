import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

// Rutas que solo puede ver el Admi
const RUTAS_ADMIN = ["/usuarios", "/crear-actividades"];

export default function ProtectedRoute() {
  const { token, usuario } = useAuth();
  const { pathname } = useLocation();

  // 1. Sin sesión → al login
  if (!token) return <Navigate to="/" replace />;

  // 2. Ruta exclusiva de Admin 
  const esAdmin = usuario?.tipo_de_rol === "Administrador";
  if (RUTAS_ADMIN.includes(pathname) && !esAdmin) {
    return <Navigate to="/actividades" replace />;
  }

  return <Outlet />;
}