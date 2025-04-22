"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import Chat from "@/components/chat";
import { Code2, MessageSquare } from "lucide-react";

export default function Home() {
  const [code, setCode] = useState<string>("// Start coding here...");
  const [language, setLanguage] = useState("javascript");

  return (
    <div className="h-screen w-full flex flex-col bg-background">
      {/* Navbar */}
      <nav className="h-14 border-b border-border bg-background flex justify-between items-center">
        <div className="h-full px-4 gap-2 flex items-center justify-center">
          <Code2 className="h-5 w-5 text-blue-600" />
          <h1 className="text-lg font-semibold text-foreground">Code AI</h1>
        </div>
        <div className="flex items-center px-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm bg-background text-foreground">
            <option value="javascript">JavaScript</option>
            <option value="typescript">TypeScript</option>
            <option value="python">Python</option>
            <option value="html">HTML</option>
            <option value="css">CSS</option>
          </select>
        </div>
      </nav>

      {/* Main content area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat section */}
        <Chat
          code={code}
          setCode={setCode}
          setLanguage={setLanguage}
          language={language}
        />

        {/* Code editor section */}
        <div className="flex-1 border-l border-border">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              lineNumbers: "on",
              renderLineHighlight: "all",
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorSmoothCaretAnimation: "on",
            }}
          />
        </div>
      </div>
    </div>
  );
}
