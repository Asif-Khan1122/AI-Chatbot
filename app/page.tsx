"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const data = await res.json();
    setMessages([...newMessages, { role: "assistant", content: data.reply }]);
    setLoading(false);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        backgroundColor: "#212121",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid #333",
          fontSize: 18,
          fontWeight: 600,
        }}
      >
        AI Chatbot
      </div>

      {/* Messages Area - scrollable */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px 0",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 16px" }}>
          {messages.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "#888",
                marginTop: 120,
                fontSize: 22,
                fontWeight: 600,
              }}
            >
              How can I help you today?
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 20,
              }}
            >
              {m.role === "assistant" && (
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: "#7c3aed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: 700,
                    marginRight: 12,
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                >
                  AI
                </div>
              )}
              <div
                style={{
                  maxWidth: "75%",
                  padding: "12px 16px",
                  borderRadius:
                    m.role === "user"
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                  background: m.role === "user" ? "#7c3aed" : "#2f2f2f",
                  color: "white",
                  fontSize: 15,
                  lineHeight: 1.6,
                }}
              >
                {m.content}
              </div>
            </div>
          ))}

          {loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "#7c3aed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                AI
              </div>
              <div style={{ color: "#888", fontSize: 14 }}>Thinking...</div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Area - fixed at bottom */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid #333",
          backgroundColor: "#212121",
        }}
      >
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            display: "flex",
            gap: 10,
            alignItems: "center",
            background: "#2f2f2f",
            borderRadius: 28,
            padding: "8px 8px 8px 20px",
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder='Message AI Chatbot...'
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontSize: 15,
              color: "white",
              padding: "6px 0",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: input.trim() && !loading ? "#7c3aed" : "#444",
              border: "none",
              cursor: input.trim() && !loading ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              transition: "background 0.2s",
            }}
          >
            <svg
              width='16'
              height='16'
              viewBox='0 0 24 24'
              fill='none'
              stroke='white'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='12' y1='19' x2='12' y2='5' />
              <polyline points='5,12 12,5 19,12' />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
