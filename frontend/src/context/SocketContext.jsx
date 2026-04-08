import React, { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const newSocket = io('http://localhost:5000');
      
      newSocket.on('connect', () => {
        newSocket.emit('setup', user._id);
        newSocket.emit('join-branch-year', { branch: user.branch, year: user.year });
      });

      newSocket.on('new-notice', (notice) => {
        toast("New Notice", {
          description: notice.title,
          duration: 5000,
          style: { 
            background: "oklch(0.16 0.03 285)", 
            border: "1px solid oklch(0.65 0.22 295 / 0.5)",
            color: "oklch(0.92 0.02 285)" 
          }
        });
      });

      newSocket.on('urgent-notice', (notice) => {
        toast.error("URGENT NOTICE", {
          description: notice.title,
          duration: Infinity,
          style: {
            background: "oklch(0.57 0.19 25 / 0.2)",
            border: "1px solid var(--destructive)",
            color: "var(--destructive)"
          }
        });
      });

      setSocket(newSocket);

      return () => newSocket.close();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
