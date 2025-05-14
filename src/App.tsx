import React, { useRef, useEffect } from "react";

function MockLLM({ text: string }): string {
  return "hello";
}

function Header() {
  return (
    <div
      style={{
        // width: "100vw",
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

function ChatSection() {
  const messages = [
    { text: "Hello AI!", sender: "user" },
    { text: "Hi there! How can I help you?", sender: "ai" },
    { text: "What is the capital of Germany?", sender: "user" },
    { text: "The capital of Germany is Berlin.", sender: "ai" },
    { text: "Thanks!", sender: "user" },
  ];

  return (
    <div
      style={{
        flexGrow: 1,
        overflowY: "auto",
        padding: "1rem",
        display: "flex", // Make ChatSection a flex container
        flexDirection: "column", // Arrange bubbles vertically
        alignItems: "flex-start", // Default alignment for children (user messages will override)
      }}
    >
      {messages.map((message, index) => (
        <div
          key={index}
          style={{
            maxWidth: "80%",
            padding: "0.8rem 1.2rem",
            borderRadius: "10px",
            marginBottom: "0.5rem",
            alignSelf: message.sender === "user" ? "flex-start" : "flex-end", // Now works correctly on flex items
            backgroundColor: message.sender === "user" ? "#e0f7fa" : "#f0f4c3",
            color: "#333",
          }}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Header />
      <ChatSection />
      {/* <Footer />*/}
    </div>
  );
}
