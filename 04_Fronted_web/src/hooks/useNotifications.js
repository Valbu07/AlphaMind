import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const NOTIF_KEY = "alphamind_notificaciones_activas";


function getNotifGuardada() {
  return localStorage.getItem(NOTIF_KEY) !== "false";
}

let socket;

export function useNotifications(token) {
  const [notifActivo, setNotifActivo] = useState(getNotifGuardada);


  useEffect(() => {
    const handler = (e) => setNotifActivo(e.detail.activo);
    window.addEventListener("alphamind:notif-toggle", handler);
    return () => window.removeEventListener("alphamind:notif-toggle", handler);
  }, []);


  useEffect(() => {
    if (!token || !notifActivo) {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
      return;
    }

    const tokenLimpio = token.startsWith("Bearer ")
      ? token.slice(7)
      : token;

    socket = io("http://52.21.74.39:3000", {
  auth: { token: tokenLimpio },
});

    socket.on("connect", () => {});

    socket.on("nueva_tarea", (data) => {
      toast.success(
        ` Nueva tarea: ${data.titulo}\nPrioridad: ${data.prioridad}`,
        {
          duration: 10000,
          position: "top-right",
          style: {
            borderLeft: "4px solid #4f46e5",
            padding: "12px 16px",
            fontSize: "14px",
          },
        }
      );
    });

    socket.on("connect_error", (err) => {
      console.warn("Socket error:", err.message);
    });

    return () => {
      socket.disconnect();
      socket = null;
    };
  }, [token, notifActivo]);
}