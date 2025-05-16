import { create } from "zustand";
import * as Types from "./types";

interface AppState {
  questions: Types.Message[];
  setQuestions: (newQuestions: Types.Message[]) => void;
  addQuestion: (question: Types.Message) => void;
  addAiResponse: (response: Omit<Types.Message, 'status'> & { status: 'loading' }) => void;
  updateAiResponse: (textChunk: string) => void;
  setAiResponseStatus: (status: 'finished') => void;
  working: boolean;
  setWorking: (isWorking: boolean) => void;
  error: string | null;
  setError: (isError: string | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  questions: [],
  setQuestions: (newQuestions) => set({ questions: newQuestions }),
  addQuestion: (question) =>
    set((state) => ({ questions: [...state.questions, question] })),
  addAiResponse: (response) =>
    set((state) => ({ questions: [...state.questions, { ...response, status: 'loading' }] })),
  updateAiResponse: (textChunk) =>
    set((state) => ({
      questions: state.questions.map((msg) =>
        msg.sender === 'ai' && msg.status !== 'finished' // Target loading or inProgress
          ? { ...msg, text: (msg.text === 'Loading...' ? textChunk : msg.text + textChunk), status: 'inProgress' }
          : msg
      ),
    })),
  setAiResponseStatus: (status) =>
    set((state) => ({
      questions: state.questions.map((msg) =>
        msg.sender === 'ai' && msg.status !== 'finished'
          ? { ...msg, status: status }
          : msg
      ),
    })),
  working: false,
  setWorking: (isWorking) => set({ working: isWorking }),
  error: null,
  setError: (isError) => set({ error: isError }),
}));
