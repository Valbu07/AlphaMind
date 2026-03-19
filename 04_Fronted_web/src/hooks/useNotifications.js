import { useEffect } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

let socket;

export function useNotifications(token) {
  useEffect(() => {
    if (!token) return;


    const tokenLimpio = token.startsWith("Bearer ")
      ? token.slice(7)
      : token;

    console.log("🔑 Token limpio:", tokenLimpio);

    socket = io("http://localhost:3000", {
      auth: { token: tokenLimpio }, 
    });

    socket.on("connect", () => {
      console.log("🔌 Socket conectado:", socket.id);
    });

    socket.on("nueva_tarea", (data) => {
      toast.success(
        ` Nueva tarea: ${data.titulo}\nPrioridad: ${data.prioridad}`,
        {
          duration: 6000,
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
  }, [token]);
}
