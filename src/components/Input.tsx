import React, { useState, useRef, useEffect } from "react";
import * as Types from "../utils/types";
import { useAppStore } from "../utils/store";
import * as LLM from "../utils/llm";

export default function Input() {
  const addQuestionToStore = useAppStore((state) => state.addQuestion);
  const addAiResponseToStore = useAppStore((state) => state.addAiResponse);
  const updateAiResponseInStore = useAppStore((state) => state.updateAiResponse);
  const setAiResponseStatusInStore = useAppStore((state) => state.setAiResponseStatus);
  const setWorking = useAppStore((state) => state.setWorking);
  const working = useAppStore((state) => state.working);
  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!working && inputRef.current) {
      inputRef.current.focus();
    }
  }, [working]);

  async function handleSendMessage() {
    if (!working) {
      setWorking(true);
      if (inputText.trim()) {
        const userMessage: Types.Message = { text: inputText, sender: "user", status: "finished" };
        addQuestionToStore(userMessage);
        setInputText("");

        const loadingMessage: Omit<Types.Message, 'status'> & { status: 'loading' } = {
          text: "Loading...",
          sender: "ai",
        };
        addAiResponseToStore(loadingMessage);

        await LLM.streamQueryLLM(inputText, (chunk) => {
          updateAiResponseInStore(chunk);
        });

        setAiResponseStatusInStore('finished');
        setWorking(false);
        // const audio = await LLM.queryTTS(useAppStore.getState().questions.find(msg => msg.sender === 'ai' && msg.status === 'finished')?.text || "");
      } else {
        setWorking(false);
      }
    }
  }

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
