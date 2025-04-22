"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import Chat from "@/components/chat";

export default function Home() {
  const [code, setCode] = useState<string>("// Start coding here...");
  const [language, setLanguage] = useState("javascript");

  return (
    <div className="!max-h-screen w-full flex flex-col">
      {/* Navbar */}
      <nav className="bg-white text-black p-4 border-b">
        <h1 className="text-xl font-bold">Code AI</h1>
      </nav>

      {/* Main content area */}
      <div className="flex-1 flex h-full">
        {/* Chat section - 1/4 width */}
        <Chat
          code={code}
          setCode={setCode}
          setLanguage={setLanguage}
          language={language}
        />

        {/* Code editor section - 3/4 width */}
        <div className="w-2/3">
          <Editor
            height="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value || "")}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              automaticLayout: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
