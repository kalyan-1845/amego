import { useEffect, useRef, useState, useCallback } from 'react';

interface UseWSProps {
  groupId: string;
  onMessage: (msg: any) => void;
}

export const useWS = ({ groupId, onMessage }: UseWSProps) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const onMessageRef = useRef(onMessage);

  // Keep the ref updated without re-triggering the effect
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname || 'localhost';
    const socket = new WebSocket(`${protocol}//${host}:8080/ws?groupId=${groupId}`);
    ws.current = socket;

    socket.onopen = () => {
      console.log('WS Connected');
      setIsConnected(true);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessageRef.current(data);
      } catch (err) {
        console.error("Failed to parse WS message:", err);
      }
    };

    socket.onclose = () => {
      console.log('WS Disconnected');
      setIsConnected(false);
    };

    socket.onerror = (err) => {
      console.error('WS Error:', err);
    };

    return () => {
      console.log('Cleaning up WS');
      socket.close();
    };
  }, [groupId]); // Only reconnect if groupId changes

  const sendMessage = useCallback((msg: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    } else {
      console.warn("Attempted to send message while WS is not open", msg);
    }
  }, []);

  return { sendMessage, isConnected };
};
