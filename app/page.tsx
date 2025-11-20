"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const sendMessage = async () => {
    if (!input) return;

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, `You: ${input}`, `Bot: ${data.reply}`]);
    setInput("");
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "auto" }}>
      <h2>Simple Chat</h2>

      <div
        style={{
          border: "1px solid #ccc",
          padding: 10,
          minHeight: 200,
          marginBottom: 20,
        }}
      >
        {messages.map((m, i) => (
          <div key={i}>{m}</div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "70%", marginRight: 10, border: "1px solid #000"}}
      />
      <button onClick={sendMessage}>送信</button>
    </div>
  );
}
