import * as Types from "./types";

export async function queryLLM(query: string): Promise<string> {
    try {
        const response = await fetch('http://localhost:8000/query', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: Types.QueryResponse = await response.json();
        return data.response;
    } catch (error: any) {
        console.error(error);
        return "I dont know the answer!";
    }
};
