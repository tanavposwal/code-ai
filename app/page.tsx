"use client";

import { useState } from "react";
import Editor from "@monaco-editor/react";
import Chat from "@/components/chat";

export default function Home() {
  const [code, setCode] = useState<string>("// Start coding here...");

  return (
    <div className="h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold">Code AI</h1>
      </nav>

      {/* Main content area */}
      <div className="flex-1 flex">
        {/* Chat section - 1/4 width */}
        <Chat code={code} setCode={setCode} />

        {/* Code editor section - 3/4 width */}
        <div className="w-3/4">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            defaultValue={code}
            theme="vs-light"
          />
        </div>
      </div>
    </div>
  );
}
