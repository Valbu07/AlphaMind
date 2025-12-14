import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Login from "../pages/Login/Login";
import Usuarios from "../pages/Usuarios/Usuarios";
import Actividades from "../pages/Actividades/Actividades";
import CrearActividades from "../pages/CrearActividades/CrearActividades";
import Calendario from "../pages/Calendario/Calendario";
import ReporteDashboard from "../pages/reportes/reportes.jsx";
import Chat from "../pages/Chat/Chat";
import RecuperarContrasena from "../pages/recuperarContrasena/recuperarContrasena";
import Navbar from "../components/layout/Navbar";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ruta pública */}
        <Route path="/" element={<Login />} />
       <Route path="/recuperar" element={<RecuperarContrasena />} />


        {/* rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/usuarios" element={<NavbarWrapper><Usuarios /></NavbarWrapper>} />
          <Route path="/actividades" element={<NavbarWrapper><Actividades /></NavbarWrapper>} />
          <Route path="/crear-actividades" element={<NavbarWrapper><CrearActividades /></NavbarWrapper>} />
          <Route path="/calendario" element={<NavbarWrapper><Calendario /></NavbarWrapper>} />
          <Route path="/reportes" element={<NavbarWrapper><ReporteDashboard/></NavbarWrapper>} />
          <Route path="/chat" element={<NavbarWrapper><Chat /></NavbarWrapper>} />

          <Route path="/reportes" element={<><Navbar /><ReporteDashboard /></>} />
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
