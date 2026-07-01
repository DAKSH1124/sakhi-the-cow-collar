"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Bot, X, Send, User, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } = useChat({
    api: "/api/chat",
    onError: (err) => {
      toast.error("Failed to connect to AI Assistant.");
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          onClick={() => setIsOpen(true)}
          size="icon"
          className="h-14 w-14 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-105"
        >
          <Sparkles className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-300 w-[350px] sm:w-[400px]">
      <Card className="shadow-2xl border-border/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 border-b bg-muted/30">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            Sakhi AI Assistant
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="h-[400px] p-4 flex flex-col gap-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-3 opacity-50 py-10">
                <Bot className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm">Hi there! I am your AI farming assistant. Ask me anything about cattle health, IoT sensors, or dairy management.</p>
                {error && <p className="text-xs text-destructive mt-4">{error.message || "Connection error."}</p>}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <Avatar className={`w-8 h-8 ${message.role === 'user' ? 'bg-primary' : 'bg-secondary'}`}>
                      <AvatarFallback className={message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}>
                        {message.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div 
                      className={`rounded-2xl px-4 py-2 max-w-[80%] text-sm ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                          : 'bg-muted rounded-tl-sm'
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-3">
                    <Avatar className="w-8 h-8 bg-secondary">
                      <AvatarFallback className="bg-secondary">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="rounded-2xl px-4 py-3 bg-muted rounded-tl-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
        
        <CardFooter className="p-3 border-t bg-background">
          <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask a question..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input || input.trim().length === 0}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
