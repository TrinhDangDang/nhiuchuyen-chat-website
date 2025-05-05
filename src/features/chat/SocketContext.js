import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { selectCurrentToken } from "../auth/authSlice";
import { useRefreshMutation } from "../auth/authApiSlice";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const token = useSelector(selectCurrentToken);
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    let newSocket;

    const initializeSocket = async () => {
      try {
        let accessToken = token;

        if (!token) {
          console.log("Access token missing or expired. Refreshing...");
          const response = await refresh().unwrap();
          accessToken = response.accessToken;
        }
        newSocket = io("http://localhost:3500", {
          //http://localhost:3500 https://api.trinhdangdang.com
          auth: { token: accessToken },
        });

        setSocket(newSocket);
      } catch (err) {
        console.error("Error connecting to Socket.IO");
      }
    };
    initializeSocket();
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [token, refresh]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
