import React, { useRef, useState, useEffect } from "react";

interface Message {
  text: string;
  sender: "user" | "ai";
  loading?: boolean;
}

function MockLLM({ text }: { text: string }): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`AI response to: "${text}"`);
    }, 500);
  });
}

function Header() {
  return (
    <div
      style={{
        height: "auto",
        backgroundColor: "lightblue",
        fontFamily: "sans-serif",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <div>AIChat</div>
    </div>
  );
}

function Footer() {
  return (
    <div
      style={{
        height: "auto",
        backgroundColor: "#c4f2a7",
        fontFamily: "sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <div>All rights reserved</div>
    </div>
  );
}

interface ChatSectionProps {
  questions: Message[];
  setQuestions: React.Dispatch<React.SetStateAction<Message[]>>;
}

function ChatSection({ questions, setQuestions }: ChatSectionProps) {
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
            alignSelf: message.sender === "user" ? "flex-start" : "flex-end",
            backgroundColor: message.sender === "user" ? "#e0f7fa" : "#f0f4c3",
            color: "#333",
            wordBreak: "break-word",
          }}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
}

interface InputProps {
  setQuestions: React.Dispatch<React.SetStateAction<Message[]>>;
}

function Input({ setQuestions }: InputProps) {
  const aiResponses = [
    "That's an interesting question!",
    "Let me think about that...",
    "Here's what I found:",
    "Could you please elaborate?",
    "I'm not sure I understand.",
  ];
  const [inputText, setInputText] = useState("");

  const getRandomElement = (array: string[]): string => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      setQuestions((prevQuestions) => [
        ...prevQuestions,
        { text: inputText, sender: "user" },
      ]);
      setInputText("");

      const loadingMessage: Message = {
        text: "Loading...",
        sender: "ai",
        loading: true,
      };
      setQuestions((prevQuestions) => [...prevQuestions, loadingMessage]);

      const aiResponse = getRandomElement(aiResponses);
      setTimeout(() => {
        setQuestions((prevQuestions) =>
          prevQuestions.filter((msg) => !(msg.sender === "ai" && msg.loading)),
        );
        setQuestions((prevQuestions) => [
          ...prevQuestions,
          { text: aiResponse, sender: "ai" },
        ]);
      }, 1500);
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
        type="text"
        value={inputText}
        onChange={handleInputChange}
        onKeyPress={handleInputKeyPress}
        style={{
          flexGrow: 1,
          padding: "0.5rem",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
        placeholder="Ask me anything..."
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
      >
        Send
      </button>
    </div>
  );
}

export default function App() {
  const [questions, setQuestions] = useState<Message[]>([]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <ChatSection questions={questions} setQuestions={setQuestions} />
      <Input setQuestions={setQuestions} />
      <Footer />
    </div>
  );
}
