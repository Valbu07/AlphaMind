// Contexto de autenticación en localStorage

import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
  });

  const [cargando, setCargando] = useState(true);

  //  Cargar sesión desde localStorage al iniciar la app
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        setAuth({
          token: storedToken,
          user: JSON.parse(storedUser),
        });
      }
    } catch (error) {
      console.error("Error al cargar sesión:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setAuth({ token: null, user: null });
    } finally {
      setCargando(false);
    }
  }, []);


  const login = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    setAuth({ token, user });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        usuario: auth.user, 
        cargando,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
