"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MemoizedMarkdown } from "@/components/memoized-markdown";

const languageMap: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  python: "python",
  cpp: "cpp",
  c: "c",
  java: "java",
  html: "html",
  go: "go",
  rust: "rust",
};

interface ChatProps {
  code: string;
  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  language: string;
  setLoading: any;
}

export default function Chat({
  code,
  setCode,
  setLanguage,
  language,
  setLoading,
}: ChatProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      body: {
        code,
        language,
      },
      onFinish: (message) => {
        const content = message.content;

        // Extract code blocks
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        const match = codeBlockRegex.exec(content);
        if (match !== null) {
          setLanguage(languageMap[match[1].toLowerCase()]);
          setCode(match[2]);
        }
      },
    });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      const scrollContainer = scrollRef.current;
      const shouldScroll =
        scrollContainer.scrollHeight -
          scrollContainer.scrollTop -
          scrollContainer.clientHeight <
        100;

      if (shouldScroll) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
    setLoading(isLoading);
  }, [messages, isLoading]);

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
                  <MemoizedMarkdown
                    content={cleanContent}
                    id={Math.random().toString()}
                  />
                </div>
              </div>
            );
          })}
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
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
