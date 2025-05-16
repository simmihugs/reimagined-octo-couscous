export interface Message {
    text: string;
    sender: "user" | "ai";
    status: "finished" | "loading" | "inProgress";
}

export interface QueryResponse {
    response: string;
}

export interface ChatSectionProps {
    questions: Message[];
    setQuestions: React.Dispatch<React.SetStateAction<Message[]>>;
}

export interface InputProps {
    setQuestions: React.Dispatch<React.SetStateAction<Message[]>>;
}
