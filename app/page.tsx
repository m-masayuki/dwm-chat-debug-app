"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "bot"; text: string }[]
  >([]);
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, thinking]);

  const sendMessage = async () => {
    if (!input) return;
    const userMsg = input;

    // ユーザーのメッセージ追加
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setInput("");

    // 「…」アニメーション開始
    setThinking(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMsg }),
    });

    const data = await res.json();

    // 「…」アニメーション停止
    setThinking(false);

    // Bot メッセージ追加
    setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);

    // ★ MAUI WebView にメッセージ送信する部分
    if (window.MyBridge && typeof window.MyBridge.postMessage === "function") {
      window.MyBridge.postMessage(data.reply);
    } else {
      console.warn("MyBridge is not available");
    }
  };
  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div style={styles.root}>
      <div style={styles.chatContainer}>
        <div style={styles.header}>ループバックチャット</div>

        <div style={styles.chatArea}>
          {messages.map((msg, i) => (
            <MessageBubble key={i} role={msg.role} text={msg.text} />
          ))}

          {/* Bot Thinking Animation */}
          {thinking && <ThinkingBubble />}

          <div ref={messagesEndRef} />
        </div>

        <div style={styles.inputBar}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="./new_set_value?paramno=C1-01&value=10"
            style={styles.input}
          />
          <button style={styles.sendBtn} onClick={sendMessage}>
            送信
          </button>
        </div>
      </div>
    </div>
  );
}

/** 吹き出しコンポーネント */
function MessageBubble({
  role,
  text,
}: {
  role: "user" | "bot";
  text: string;
}) {
  const isUser = role === "user";

  return (
    <div
      style={{
        ...styles.row,
        justifyContent: isUser ? "flex-end" : "flex-start",
      }}
    >
      {!isUser && <BotIcon />}

      <div
        style={{
          ...styles.message,
          ...(isUser ? styles.userMsg : styles.botMsg),
        }}
      >
        {text}
      </div>
    </div>
  );
}

/** Bot の丸アイコン */
function BotIcon() {
  return <div style={styles.botIcon}>🤖</div>;
}

/** 「…」アニメーション */
function ThinkingBubble() {
  return (
    <div style={{ ...styles.row, justifyContent: "flex-start" }}>
      <BotIcon />
      <div style={styles.thinkingBubble}>
        <span style={styles.dot1}>●</span>
        <span style={styles.dot2}>●</span>
        <span style={styles.dot3}>●</span>
      </div>
    </div>
  );
}

//
// ────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────
//

const styles: Record<string, React.CSSProperties> = {
  root: {
    background: "#0D0D0D",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: 20,
  },

  chatContainer: {
    width: "100%",
    maxWidth: 800,
    background: "#1E1E1E",
    borderRadius: 16,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    border: "1px solid #333",
  },

  header: {
    padding: 14,
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    borderBottom: "1px solid #333",
  },

  chatArea: {
    flex: 1,
    overflowY: "auto",
    padding: 20,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  row: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
  },

  botIcon: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    background: "#3A3A3A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    color: "white",
  },

  message: {
    maxWidth: "70%",
    padding: "10px 14px",
    borderRadius: 12,
    fontSize: 15,
    lineHeight: "1.5",
  },

  userMsg: {
    background: "#007AFF",
    color: "white",
    borderBottomRightRadius: 4,
  },

  botMsg: {
    background: "#2A2A2A",
    color: "#ddd",
    borderBottomLeftRadius: 4,
  },

  thinkingBubble: {
    background: "#2A2A2A",
    borderRadius: 12,
    padding: "8px 14px",
    display: "flex",
    gap: 6,
    color: "#ccc",
    fontSize: 14,
  },

  dot1: { animation: "blink 1.4s infinite 0s" },
  dot2: { animation: "blink 1.4s infinite 0.2s" },
  dot3: { animation: "blink 1.4s infinite 0.4s" },

  inputBar: {
    display: "flex",
    padding: 12,
    borderTop: "1px solid #333",
    background: "#1E1E1E",
  },

  input: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    border: "1px solid #444",
    background: "#111",
    color: "#fff",
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

/* グローバルCSSアニメーション挿入用 */
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes blink {
      0% { opacity: 0.1; }
      20% { opacity: 1; }
      100% { opacity: 0.1; }
    }
  `;
  document.head.appendChild(style);
}
