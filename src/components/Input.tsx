import React, { useState, useRef, useEffect } from "react";
import * as Types from "./types";

export default function Input({ setQuestions }: Types.InputProps) {
  const aiResponses = [
    "That's an interesting question!",
    "Let me think about that...",
    "Here's what I found:",
    "Could you please elaborate?",
    "I'm not sure I understand.",
  ];
  const [inputText, setInputText] = useState("");
  const [working, setWorking] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!working && inputRef.current) {
      inputRef.current.focus();
    }
  }, [working]);

  const getRandomElement = (array: string[]): string => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const handleSendMessage = () => {
    if (!working) {
      setWorking(true);
      if (inputText.trim()) {
        setQuestions((prevQuestions) => [
          ...prevQuestions,
          { text: inputText, sender: "user" },
        ]);
        setInputText("");

        const loadingMessage: Types.Message = {
          text: "Loading...",
          sender: "ai",
          loading: true,
        };
        setQuestions((prevQuestions) => [...prevQuestions, loadingMessage]);

        const aiResponse = getRandomElement(aiResponses);
        setTimeout(() => {
          setQuestions((prevQuestions) =>
            prevQuestions.filter(
              (msg) => !(msg.sender === "ai" && msg.loading),
            ),
          );
          setQuestions((prevQuestions) => [
            ...prevQuestions,
            { text: aiResponse, sender: "ai" },
          ]);
          setWorking(false);
        }, 1500);
      }
    } else {
      setWorking(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleInputKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div style={{ padding: "1rem", display: "flex" }}>
      <input
        ref={inputRef}
        type="text"
        value={inputText}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyPress}
        style={{
          flexGrow: 1,
          padding: "0.5rem",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
        placeholder="Ask me anything..."
        disabled={working}
      />
      <button
        onClick={handleSendMessage}
        style={{
          marginLeft: "0.5rem",
          padding: "0.5rem 1rem",
          borderRadius: "5px",
          backgroundColor: "lightblue",
          border: "none",
          cursor: "pointer",
        }}
        disabled={working}
      >
        Send
      </button>
    </div>
  );
}
