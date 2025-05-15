import { create } from "zustand";
import * as Types from "./types";

interface AppState {
  questions: Types.Message[];
  setQuestions: (newQuestions: Types.Message[]) => void;
  addQuestion: (question: Types.Message) => void;
  addAiResponse: (response: Types.Message) => void;
  working: boolean;
  setWorking: (isWorking: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  questions: [],
  setQuestions: (newQuestions) => set({ questions: newQuestions }),
  addQuestion: (question) =>
    set((state) => ({ questions: [...state.questions, question] })),
  addAiResponse: (response) =>
    set((state) => ({ questions: [...state.questions, response] })),
  working: false,
  setWorking: (isWorking) => set({ working: isWorking }),
}));
