import React, { useRef, useState, useEffect } from "react";

// Mock LLM function (now accepts and returns a string)
function MockLLM({ text }) {
  // Simulate a slight delay for the AI response
  // In a real app, this would be an API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`AI response to: "${text}"`);
    }, 500); // Simulate 500ms delay
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
        backgroundColor: "green",
        fontFamily: "sans-serif",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <div>Cool</div>
    </div>
  );
}

function ChatSection({ questions, setQuestions }) {
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom whenever new messages are added
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
            wordBreak: "break-word", // Prevent long words from breaking layout
          }}
        >
          {message.text}
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [questions, setQuestions] = useState([]);
  const randomQuestions = [
    "What is the meaning of life?",
    "Tell me a joke.",
    "How does photosynthesis work?",
    "What is the capital of France?",
    "Who painted the Mona Lisa?",
  ];

  const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
  };

  const handleHelloClick = async () => {
    const randomQuestion = getRandomElement(randomQuestions);
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { text: randomQuestion, sender: "user" },
    ]);

    // Simulate getting an AI response
    const aiResponse = await MockLLM({ text: randomQuestion });
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      { text: aiResponse, sender: "ai" },
    ]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <ChatSection questions={questions} setQuestions={setQuestions} />
      <button onClick={handleHelloClick}>Ask Something</button>
      <Footer />
    </div>
  );
}
