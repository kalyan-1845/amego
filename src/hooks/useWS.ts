import { useEffect, useRef, useState, useCallback } from 'react';

interface UseWSProps {
  groupId: string;
  onMessage: (msg: any) => void;
}

export const useWS = ({ groupId, onMessage }: UseWSProps) => {
  const ws = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const onMessageRef = useRef(onMessage);
  const reconnectTimer = useRef<any>(null);
  const isMounted = useRef(true);

  // Keep the ref updated without re-triggering the effect
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  const connect = useCallback(() => {
    // Don't connect if unmounted
    if (!isMounted.current) return;

    // Close existing connection if any
    if (ws.current) {
      try { ws.current.close(); } catch {}
      ws.current = null;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname || 'localhost';
    const socket = new WebSocket(`${protocol}//${host}:8080/ws?groupId=${groupId}`);
    ws.current = socket;

    socket.onopen = () => {
      if (!isMounted.current) {
        socket.close();
        return;
      }
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
      if (!isMounted.current) return;
      console.log('WS Disconnected');
      setIsConnected(false);

      // Auto-reconnect after 3 seconds
      if (isMounted.current) {
        reconnectTimer.current = setTimeout(() => {
          console.log('WS Reconnecting...');
          connect();
        }, 3000);
      }
    };

    socket.onerror = () => {
      // Error will also trigger onclose, so reconnect happens there
      if (!isMounted.current) return;
      console.warn('WS connection error - will retry');
    };
  }, [groupId]);

  useEffect(() => {
    isMounted.current = true;
    
    // Small delay to handle React StrictMode double-mount
    const initTimer = setTimeout(() => {
      connect();
    }, 100);

    return () => {
      isMounted.current = false;
      clearTimeout(initTimer);
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
    };
  }, [connect]);

  const sendMessage = useCallback((msg: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(msg));
    } else {
      console.warn("WS not open, message queued for retry");
    }
  }, []);

  return { sendMessage, isConnected };
};
