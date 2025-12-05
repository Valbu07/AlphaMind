<<<<<<< HEAD
// src/context/AuthContext.js
import { createContext, useState } from 'react';
=======
// Contexto de autenticación en localStorage

import { createContext, useEffect, useState } from "react";
>>>>>>> e8da3c5781c0e087b1d322519cb79ad9926c659a

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
<<<<<<< HEAD
    console.log('🔐 [AuthContext] Guardando token y usuario...');
    console.log('Token a guardar:', token);
    console.log('Usuario a guardar:', user);
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
=======
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

>>>>>>> e8da3c5781c0e087b1d322519cb79ad9926c659a
    setAuth({ token, user });
    
    console.log('✅ [AuthContext] Token y usuario guardados exitosamente');
  };

  const logout = () => {
<<<<<<< HEAD
    console.log('🚪 [AuthContext] Cerrando sesión...');
    localStorage.clear();
=======
    localStorage.removeItem("token");
    localStorage.removeItem("user");
>>>>>>> e8da3c5781c0e087b1d322519cb79ad9926c659a
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
<<<<<<< HEAD
}
=======
}
>>>>>>> e8da3c5781c0e087b1d322519cb79ad9926c659a
