import React, { useState } from "react";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Input from "./components/Input";
import ChatSection from "./components/ChatSection";
import * as Types from "./components/types";

export default function App() {
  const [questions, setQuestions] = useState<Types.Message[]>([]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <ChatSection questions={questions} setQuestions={setQuestions} />
      <Input setQuestions={setQuestions} />
      <Footer />
    </div>
  );
}
