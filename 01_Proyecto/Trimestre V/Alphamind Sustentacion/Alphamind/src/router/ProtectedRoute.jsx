import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function ProtectedRoute() {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}


// Componente de ruta protegida que verifica la autenticación del usuario antes de permitir el acceso a las rutas hijas.