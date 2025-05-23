import { useRef, useEffect } from "react";
import { PiBrainThin, PiUser } from "react-icons/pi";
import { useAppStore } from "../utils/store";
import * as Types from "../utils/types";
import { LoadingDots } from "./LoadingDots";

export default function ChatSection() {
  const questions = useAppStore((state) => state.questions);  
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
      {questions &&
        questions.map((message: Types.Message, index) => (
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
              backgroundColor:
                message.sender === "user" ? "#e0f7fa" : "#f0f4c3",
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
                <PiBrainThin />
              )}
            </span>
                {message.status === "loading" ? <LoadingDots /> : message.text}
          </div>
        ))}
    </div>
  );
}
