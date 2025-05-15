import React, { useRef, useEffect } from "react";
import * as Types from "./types";
import { PiBrainThin, PiUser } from "react-icons/pi";

export default function ChatSection({
  questions,
  working,
}: Types.ChatSectionProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [questions]);

  return (
    <div
      ref={chatContainerRef}
      style={{
        flexGrow: 1,
        overflowY: "auto",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {questions.map((message, index) => (
        <div
          key={index}
          style={{
            maxWidth: "80%",
            padding: "0.8rem 1.2rem",
            borderRadius: "10px",
            marginBottom: "0.5rem",
            fontFamily:
              message.sender === "user" ? "Cormorant Garamond" : "Space Mono",
            fontSize: message.sender === "user" ? "20px" : "14px",
            alignSelf: message.sender === "user" ? "flex-start" : "flex-end",
            backgroundColor: message.sender === "user" ? "#e0f7fa" : "#f0f4c3",
            color: "#333",
            wordBreak: "break-word",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              marginRight: "0.5rem",
              fontFamily: "serif",
              fontSize: "1.2em",
              display: "flex",
              alignItems: "center",
            }}
          >
            {message.sender === "user" ? (
              <PiUser />
            ) : (
              !working && <PiBrainThin />
            )}
          </span>
          {message.text}
        </div>
      ))}
    </div>
  );
}
