import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Input from "./components/Input";
import ChatSection from "./components/ChatSection";

export default function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header />
      <ChatSection />
      <Input />
      <Footer />
    </div>
  );
}
