import { useContext } from "react";
import { Toaster } from "react-hot-toast";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import AppRouter from "./router/AppRouter";
import { useNotifications } from "./hooks/useNotifications";

// Componente interno para poder acceder al Context
function AppContent() {
  const { token } = useContext(AuthContext); //  token directo del context

  useNotifications(token); // conecta socket cuando haya token

  return (
    <>
      <Toaster position="top-right" />
      <AppRouter />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent /> 
    </AuthProvider>
  );
}