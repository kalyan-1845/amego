import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Sparkles, Paperclip, MoreHorizontal, Trash2 } from 'lucide-react';
import { useChatStore } from '../store/chatStore';
import { cn } from '../utils/cn';
import { useWS } from '../hooks/useWS';

const ChatPage = () => {
  const [inputValue, setInputValue] = useState('');
  const { messages, isLoading, addMessage, setLoading, clearMessages } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Group ID is fixed for now (shared lobby)
  const groupId = "default";

  const [typingUser, setTypingUser] = useState<string | null>(null);
  const typingTimeoutRef = useRef<any>(null);

  const onWSMessage = useCallback((data: any) => {
    if (data.type === "chat") {
      // Avoid duplicate local messages if we added it manually already
      const exists = useChatStore.getState().messages.some(m => m.id === data.messageId);
      if (!exists) {
        addMessage({ 
          id: data.messageId,
          role: data.user === 'assistant' ? 'assistant' : 'user', 
          content: data.text 
        });
      }
    } else if (data.type === "ai_response") {
       setLoading(false);
       addMessage({ 
         id: data.messageId,
         role: 'assistant', 
         content: data.reply 
       });
    } else if (data.type === "typing") {
       // Only show if it's NOT our own typing (or if we have user IDs)
       // For this demo, let's assume if it comes from WS, someone else is typing
       setTypingUser("Someone");
       if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
       typingTimeoutRef.current = setTimeout(() => setTypingUser(null), 3000);
    }
  }, [addMessage, setLoading]);

  const { sendMessage, isConnected } = useWS({ groupId, onMessage: onWSMessage });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    
    // Broadcast typing status
    if (isConnected) {
        sendMessage({ type: "typing", isTyping: true });
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, typingUser]);

  const handleSend = async () => {
    if (!inputValue.trim() || !isConnected) {
        if (!isConnected) alert("Backend is Disconnected. Make sure Go server is running on port 8080.");
        return;
    }

    const userMessage = inputValue;
    setInputValue('');
    
    // Stop typing indicator on send
    sendMessage({ type: "typing", isTyping: false });

    // 1. Generate a single ID for both local and server
    const msgId = Math.random().toString(36).substring(7);

    // 2. Add to local state WITH the specific ID
    addMessage({ id: msgId, role: 'user', content: userMessage });

    // 3. Send text message to Go Backend
    sendMessage({
        type: "chat",
        text: userMessage,
        user: "user",
        messageId: msgId
    });

    // 4. Automatically ask AI for a response via Go backend
    setLoading(true);
    sendMessage({
        type: "ask_ai",
        messageId: msgId
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const uploadId = Math.random().toString(36).substring(7);
      addMessage({ 
        id: uploadId,
        role: 'user', 
        content: `[File Uploaded] ${file.name} (${(file.size / 1024).toFixed(1)} KB)` 
      });
      setLoading(true);
      
      const responseId = Math.random().toString(36).substring(7);
      setTimeout(() => {
         addMessage({ 
            id: responseId,
            role: 'assistant', 
            content: `I've analyzed your file "${file.name}". Let me know if you want me to summarize or extract anything.` 
         });
         setLoading(false);
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-5xl mx-auto border border-border/50 bg-card/50 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in duration-700">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 px-6 border-b border-border bg-background/50 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center p-2 shadow-lg shadow-blue-500/20">
            <Sparkles className="h-full w-full text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg leading-tight flex items-center gap-2">
                AmeBot
                <span className={cn("inline-block w-2 h-2 rounded-full", isConnected ? "bg-emerald-500 animate-pulse" : "bg-red-500")} />
            </h2>
            <p className="text-xs text-muted-foreground">{isConnected ? "Online & Collaborative" : "Offline - Start Go Server"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={clearMessages}
            className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
            title="Clear Chat"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsMoreOpen(!isMoreOpen)}
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>
            <AnimatePresence>
              {isMoreOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsMoreOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute right-0 mt-2 w-48 rounded-2xl border border-border bg-card p-2 shadow-2xl z-50 overflow-hidden"
                  >
                    <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                      Export Chat
                    </button>
                    <button className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
                      Settings
                    </button>
                    <div className="h-px bg-border my-1" />
                    <button 
                        onClick={() => { clearMessages(); setIsMoreOpen(false); }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-all font-bold"
                    >
                      Delete History
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-border">
        <AnimatePresence initial={false}>
          {messages.map((message, idx) => (
            <motion.div
              key={message.id || idx}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex items-start gap-4",
                message.role === 'user' ? "flex-row-reverse" : "flex-row"
              )}
            >
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-1",
                message.role === 'user' ? "bg-zinc-700" : "bg-blue-600 shadow-md shadow-blue-500/20"
              )}>
                {message.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
              </div>
              
              <div className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
                message.role === 'user' 
                  ? "bg-blue-600 text-white rounded-tr-none shadow-blue-500/10" 
                  : "bg-muted text-foreground rounded-tl-none border border-border/50"
              )}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <div className="flex justify-between items-center mt-2 opacity-50 font-medium">
                   <span className="text-[10px]">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                   </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex items-start gap-4"
          >
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="bg-muted text-foreground rounded-2xl rounded-tl-none px-4 py-3 border border-border/50 shadow-sm transition-all animate-pulse">
                <div className="flex gap-1.5 h-4 items-center">
                    <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                </div>
            </div>
          </motion.div>
        )}

        {typingUser && (
           <motion.div
             initial={{ opacity: 0, y: 5 }}
             animate={{ opacity: 1, y: 0 }}
             className="flex items-center gap-2 text-xs text-muted-foreground ml-12"
           >
              <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              <span>{typingUser} is typing...</span>
           </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 md:p-6 bg-background/50 border-t border-border backdrop-blur">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="relative max-w-4xl mx-auto group"
        >
          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              onChange={handleFileUpload}
            />
            <button 
              type="button" 
              disabled={!isConnected}
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Paperclip className="h-5 w-5" />
            </button>
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            disabled={!isConnected}
            placeholder={isConnected ? "Ask me anything..." : "Disconnected - Start Go Backend to Chat"}
            className="w-full bg-background border border-border/60 hover:border-border/100 focus:border-blue-500/50 rounded-2xl pl-14 pr-16 py-4 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-muted-foreground/60 disabled:cursor-not-allowed"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <button 
              type="submit"
              disabled={!inputValue.trim() || isLoading || !isConnected}
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                inputValue.trim() && !isLoading && isConnected
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95" 
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
        <p className="text-[10px] text-center mt-3 text-muted-foreground/60 font-bold uppercase tracking-widest">
           COLLABORATIVE ENGINE: {isConnected ? "CONNECTED" : "STOPPED"}
        </p>
      </div>
    </div>
  );
};

export default ChatPage;
