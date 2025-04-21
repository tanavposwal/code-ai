"use client";

import { useChat } from "@ai-sdk/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { coderSchema } from "@/app/api/use-object/schema";
import { useState } from "react";

export default function Chat({
  code,
  setCode,
}: {
  code: string;
  setCode: any;
}) {
  const { object, submit, isLoading, stop } = useObject({
    api: "/api/use-object",
    schema: coderSchema,
  });
  const [input, setInput] = useState<string>("");

  return (
    <div className="w-1/4 bg-gray-100 p-4 border-r border-gray-300">
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-y-auto">
          hello
          {object?.coder?.map((code, index) => (
            <div key={index}>
              <p>{code?.explaination}</p>
              <hr /> {code?.code}
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            className="w-full bg-white"
            value={input}
            onChange={(event) => {
              setInput(event.target.value);
            }}
          />
          <Button onClick={() => submit(input)} disabled={isLoading}>
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
