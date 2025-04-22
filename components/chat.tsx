"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Chat({
  code,
  setCode,
  setLanguage,
  language,
}: {
  code: string;
  setCode: any;
  setLanguage: any;
  language: string;
}) {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      onFinish: (message) => {
        // Extract code blocks from the message
        const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
        let match;
        let extractedCode = "";
        let detectedLanguage = language;

        while ((match = codeBlockRegex.exec(message.content)) !== null) {
          if (match[1]) {
            detectedLanguage = mapLanguage(match[1]);
            setLanguage(detectedLanguage);
          }
          extractedCode = match[2];
        }

        if (extractedCode) {
          setCode(extractedCode);
        }
      },
    });
  const mapLanguage = (lang: string) => {
    const languageMap: { [key: string]: string } = {
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
    return languageMap[lang.toLowerCase()] || lang.toLowerCase();
  };

  return (
    <div className="w-1/3 bg-gray-100 h-full p-4 border-r border-gray-300">
      <ScrollArea className="flex-1 h-full">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.role === "user" ? "text-right" : "text-left"
            }`}>
            <div
              className={`inline-block max-w-[80%] rounded-lg ${
                message.role === "user"
                  ? "p-3 bg-blue-500 text-white"
                  : "text-black"
              }`}>
              <div
                dangerouslySetInnerHTML={{
                  __html: message.content
                    .replace(/```(\w+)?\n?/g, "")
                    .replace(/```/g, ""),
                }}
              />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-left">
            <div className="inline-block p-3 rounded-lg bg-gray-200 text-black">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </ScrollArea>
      <div className="mt-4 flex gap-1">
        <Input
          type="text"
          placeholder="Type your message..."
          className="w-full bg-white"
          value={input}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
          Send
        </Button>
      </div>
    </div>
  );
}
