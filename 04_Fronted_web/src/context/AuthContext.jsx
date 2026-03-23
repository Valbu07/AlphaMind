import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
  });

  const [cargando, setCargando] = useState(true);

  const updateAvatar = (fotoPerfil) => {
    const updatedUser = { ...auth.user, foto_perfil: fotoPerfil };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setAuth(prev => ({ ...prev, user: updatedUser }));
  };

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
    console.log('[AuthContext] Token y usuario guardados exitosamente');
  };

  const logout = () => {
    console.log('[AuthContext] Cerrando sesión...');
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
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}