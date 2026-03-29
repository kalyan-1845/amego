import { useEffect, useRef, useState, useCallback } from 'react';

interface UseWSProps {
  groupId: string;
  onMessage: (msg: any) => void;
}

export const useWS = ({ groupId, onMessage }: UseWSProps) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = new WebSocket(`ws://localhost:8080/ws?groupId=${groupId}`);
    ws.current = socket;

    socket.onopen = () => {
      console.log('WS Connected');
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    socket.onclose = () => {
      console.log('WS Disconnected');
      setIsConnected(false);
    };

    return () => {
      socket.close();
    };
  }, [groupId, onMessage]);

  const sendMessage = useCallback((msg: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    }
  }, []);

  return { sendMessage, isConnected };
};
