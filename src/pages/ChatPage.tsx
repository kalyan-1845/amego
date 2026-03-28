import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Sparkles, Paperclip, MoreHorizontal, Trash2 } from 'lucide-react';
import { useChatStore, Message } from '../store/chatStore';
import { cn } from '../utils/cn';

const ChatPage = () => {
  const [inputValue, setInputValue] = useState('');
  const { messages, isLoading, addMessage, setLoading, clearMessages } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue;
    setInputValue('');
    addMessage({ role: 'user', content: userMessage });
    
    setLoading(true);
    
    // Simulate AI response
    setTimeout(() => {
      addMessage({ 
        role: 'assistant', 
        content: `I've received your message: "${userMessage}". As an AI, I'm here to help you brainstorm ideas, summarize documents, or just chat. What else would you like to explore?` 
      });
      setLoading(false);
    }, 1500);
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
            <h2 className="font-semibold text-lg leading-tight">AI Assistant</h2>
            <p className="text-xs text-muted-foreground">Powered by Amego v4.0</p>
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
          <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-xl transition-all">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-border">
        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
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
                message.role === 'user' ? "bg-zinc-700" : "bg-blue-600"
              )}>
                {message.role === 'user' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
              </div>
              
              <div className={cn(
                "max-w-[85%] rounded-2xl px-4 py-3 shadow-sm",
                message.role === 'user' 
                  ? "bg-blue-600 text-white rounded-tr-none" 
                  : "bg-muted text-foreground rounded-tl-none border border-border/50"
              )}>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <span className="text-[10px] mt-2 block opacity-50 font-medium">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
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
            <div className="bg-muted text-foreground rounded-2xl rounded-tl-none px-4 py-3 border border-border/50 shadow-sm">
                <div className="flex gap-1.5 h-4 items-center">
                    <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="h-1.5 w-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                </div>
            </div>
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
            <button type="button" className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted">
              <Paperclip className="h-5 w-5" />
            </button>
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            className="w-full bg-background border border-border/60 hover:border-border/100 focus:border-blue-500/50 rounded-2xl pl-14 pr-16 py-4 shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-blue-500/10 placeholder:text-muted-foreground/60"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <button 
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className={cn(
                "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                inputValue.trim() && !isLoading 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 hover:scale-105 active:scale-95" 
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
        <p className="text-[10px] text-center mt-3 text-muted-foreground/60">
          Amego can make mistakes. Verify important info.
        </p>
      </div>
    </div>
  );
};

export default ChatPage;
