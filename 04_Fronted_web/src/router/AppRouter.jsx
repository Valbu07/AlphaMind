import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Login from "../pages/Login/Login";
import Usuarios from "../pages/Usuarios/Usuarios";
import Actividades from "../pages/Actividades/Actividades";
import CrearActividades from "../pages/CrearActividades/CrearActividades";
import Calendario from "../pages/Calendario/Calendario";
import Reportes from "../pages/reportes/reportes.jsx";

import Navbar from "../components/layout/Navbar";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ruta pública */}
        <Route path="/login" element={<Login />} />

        {/* rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/usuarios" element={<NavbarWrapper><Usuarios /></NavbarWrapper>} />
          <Route path="/actividades" element={<NavbarWrapper><Actividades /></NavbarWrapper>} />
          <Route path="/crear-actividades" element={<NavbarWrapper><CrearActividades /></NavbarWrapper>} />
          <Route path="/calendario" element={<NavbarWrapper><Calendario /></NavbarWrapper>} />
          <Route path="/reportes" element={<NavbarWrapper><Reportes/></NavbarWrapper>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

// lo reutilizable
const NavbarWrapper = ({ children }) => (
  <>
    <Navbar />
    <div className="container mt-4">
      {children}
    </div>
  </>
);
