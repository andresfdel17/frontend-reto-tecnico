// hooks/useSocket.ts
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useSocket(url: string, options?: any) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // crear la conexión solo una vez
    socketRef.current = io(url, options);

    return () => {
      // cleanup al desmontar
      socketRef.current?.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]); // se vuelve a conectar solo si cambia la URL

  return socketRef.current;
}
