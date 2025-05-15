export interface Message {
  text: string;
  sender: "user" | "ai";
  loading?: boolean;
}

export interface ChatSectionProps {
  questions: Message[];
  setQuestions: React.Dispatch<React.SetStateAction<Message[]>>;
}

export interface InputProps {
  setQuestions: React.Dispatch<React.SetStateAction<Message[]>>;
}
