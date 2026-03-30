import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080/ws?groupId=default');

ws.on('open', () => {
  console.log('Connected to WebSocket');
  const msgId = Math.random().toString(36).substring(7);
  
  // 1. Send Chat Message
  const chatMsg = {
    type: "chat",
    text: "Hey AI, are you there?",
    user: "user",
    messageId: msgId
  };
  ws.send(JSON.stringify(chatMsg));
  console.log('Sent chat msg:', msgId);

  // 2. Trigger AI explicitly
  setTimeout(() => {
    console.log('Asking AI to reply to', msgId);
    ws.send(JSON.stringify({
      type: "ask_ai",
      messageId: msgId
    }));
  }, 500);
});

ws.on('message', (data) => {
  console.log('Received:', data.toString());
});

ws.on('error', (err) => {
  console.error('WS Error:', err);
});

setTimeout(() => {
  console.log('Closing test...');
  ws.close();
  process.exit(0);
}, 5000);
