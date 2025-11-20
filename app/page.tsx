"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>Simple ChatGPT Style</div>

      <div style={styles.chatArea}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              ...(msg.role === "user" ? styles.userMsg : styles.botMsg),
            }}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputBar}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="メッセージを入力..."
          style={styles.input}
        />
        <button style={styles.sendBtn} onClick={sendMessage}>
          送信
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#f7f7f8",
    fontFamily: "sans-serif",
  },

  header: {
    padding: 12,
    fontSize: 18,
    fontWeight: "bold",
    borderBottom: "1px solid #ddd",
    background: "white",
  },

  chatArea: {
    flex: 1,
    overflowY: "auto",
    padding: 20,
  },

  message: {
    maxWidth: "80%",
    padding: "10px 14px",
    borderRadius: 12,
    marginBottom: 10,
    lineHeight: "1.4",
    fontSize: 15,
    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
  },

  userMsg: {
    alignSelf: "flex-end",
    background: "#007AFF",
    color: "white",
    borderBottomRightRadius: 2,
  },

  botMsg: {
    alignSelf: "flex-start",
    background: "white",
    borderBottomLeftRadius: 2,
  },

  inputBar: {
    display: "flex",
    padding: 10,
    borderTop: "1px solid #ddd",
    background: "white",
  },

  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    marginRight: 10,
    fontSize: 15,
  },

  sendBtn: {
    padding: "10px 18px",
    background: "#007AFF",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
  },
};
