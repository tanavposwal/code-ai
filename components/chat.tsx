"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef } from "react";
import { Loader2, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const languageMap: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  python: "python",
  html: "html",
  css: "css",
  json: "json",
};

interface ChatProps {
  code: string;
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  language: string;
}

export default function Chat({
  code,
  setCode,
  setLanguage,
  language,
}: ChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      onFinish: (message) => {
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        let match;
        let extractedCode = "";
        let detectedLanguage = language;

        while ((match = codeBlockRegex.exec(message.content)) !== null) {
          if (match[1]) {
            detectedLanguage =
              languageMap[match[1].toLowerCase()] || match[1].toLowerCase();
            setLanguage(detectedLanguage);
          }
          extractedCode = match[2];
        }

        if (extractedCode) {
          setCode(extractedCode);
        }

        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      },
    });

  // Function to remove code blocks from message content
  const removeCodeBlocks = (content: string) => {
    return content.replace(/```[\s\S]*?```/g, "").trim();
  };

  return (
    <div className="w-1/3 h-full flex flex-col bg-background border-r border-border">
      <ScrollArea ref={scrollRef} className="flex-1 p-6 overflow-y-scroll">
        <div className="space-y-4">
          {messages.map((message) => {
            const cleanContent = removeCodeBlocks(message.content);
            if (!cleanContent) return null;

            return (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}>
                <div
                  className={`max-w-[80%] rounded-2xl py-3 ${
                    message.role === "user"
                      ? "bg-blue-600 text-white px-4"
                      : "px-2 text-sm"
                  }`}>
                  <div className="prose prose-sm">{cleanContent}</div>
                </div>
              </div>
            );
          })}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-50 rounded-2xl px-4 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-border">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-accent border-0 focus-visible:ring-1"
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600/50 hover:bg-blue-700 text-foreground">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
