"use client";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    [],
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("chat-messages");
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("chat-messages", JSON.stringify(messages));
    }
  }, [messages, isLoaded]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        height: "100dvh",
        backgroundColor: "#212121",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      {" "}
      <div
        style={{
          padding: "14px 20px",
          borderBottom: "1px solid #333",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {" "}
        <span style={{ fontSize: 17, fontWeight: 600 }}>AI Chatbot</span>{" "}
        <button
          onClick={() => {
            setMessages([]);
            localStorage.removeItem("chat-messages");
          }}
          style={{
            background: "transparent",
            border: "1px solid #555",
            color: "#aaa",
            padding: "5px 12px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 12,
          }}
        >
          {" "}
          New Chat{" "}
        </button>{" "}
      </div>{" "}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 0" }}>
        {" "}
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 12px" }}>
          {" "}
          {messages.length === 0 && (
            <div
              style={{
                textAlign: "center",
                color: "#888",
                marginTop: 100,
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {" "}
              How can I help you today?{" "}
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 16,
              }}
            >
              {" "}
              {m.role === "assistant" && (
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: "50%",
                    background: "#7c3aed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontWeight: 700,
                    marginRight: 10,
                    flexShrink: 0,
                    marginTop: 4,
                  }}
                >
                  {" "}
                  AI{" "}
                </div>
              )}{" "}
              <div
                style={{
                  maxWidth: "78%",
                  padding: "10px 14px",
                  borderRadius:
                    m.role === "user"
                      ? "18px 18px 4px 18px"
                      : "18px 18px 18px 4px",
                  background: m.role === "user" ? "#7c3aed" : "#2f2f2f",
                  color: "white",
                  fontSize: 14,
                  lineHeight: 1.6,
                  wordBreak: "break-word",
                }}
              >
                {" "}
                {m.content}{" "}
              </div>{" "}
            </div>
          ))}
          {loading && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              {" "}
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "#7c3aed",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {" "}
                AI{" "}
              </div>{" "}
              <div style={{ color: "#888", fontSize: 13 }}>
                Thinking...
              </div>{" "}
            </div>
          )}{" "}
          <div ref={bottomRef} />{" "}
        </div>{" "}
      </div>{" "}
      <div
        style={{
          padding: "12px",
          borderTop: "1px solid #333",
          backgroundColor: "#212121",
          flexShrink: 0,
        }}
      >
        {" "}
        <div
          style={{
            maxWidth: 760,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            background: "#2f2f2f",
            borderRadius: 28,
            padding: "6px 6px 6px 16px",
          }}
        >
          {" "}
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
              fontSize: 14,
              color: "white",
              padding: "6px 0",
              minWidth: 0,
            }}
          />{" "}
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            style={{
              width: 34,
              height: 34,
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
            {" "}
            <svg
              width='14'
              height='14'
              viewBox='0 0 24 24'
              fill='none'
              stroke='white'
              strokeWidth='2.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              {" "}
              <line x1='12' y1='19' x2='12' y2='5' />{" "}
              <polyline points='5,12 12,5 19,12' />{" "}
            </svg>{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
