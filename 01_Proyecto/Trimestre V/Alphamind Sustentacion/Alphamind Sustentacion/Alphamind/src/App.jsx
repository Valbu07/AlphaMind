import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Calendario from "./components/Calendario";
import CrearActividades from "./components/CrearActividades";
import Actividades from "./components/Actividades";
import Login from "./components/Login";
import Usuarios from "./components/Usuarios";

function App() {
  return (
    <div className="container mt-5">
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="/usuarios" element={<><Navbar/><Usuarios/></>} />
        <Route path="/crear-actividades" element={<><Navbar /><CrearActividades /></>} />
        <Route path="/actividades" element={<><Navbar /><Actividades /></>} />
        <Route path="/calendario" element={<><Navbar /><Calendario /></>} />
        <Route path="/reportes" element={<><Navbar /><h2>Vista Reportes</h2></>} />
        <Route path="/chat" element={<><Navbar /><h2>Vista Chat</h2></>} />


      </Routes>
    </div>  
  );
}

export default App;
