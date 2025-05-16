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

export async function streamQueryLLM(query: string, onChunkReceived: (chunk: string) => void): Promise<void> {
  try {
    const response = await fetch('http://localhost:8000/stream-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let accumulatedResponse = "";

    while (true) {
      const { done, value } = await reader!.read();

      if (done) {
        break;
      }

      if (value) {
        const chunk = decoder.decode(value, { stream: true });
        accumulatedResponse += chunk;
        onChunkReceived(chunk);
      }
    }

    console.log("LLM stream finished. Full response:", accumulatedResponse);

  } catch (error: any) {
    console.error("Error streaming LLM response:", error);
    onChunkReceived("Error fetching response.");
  }
}

export async function queryTTS(text: string): Promise<void> {
  try {
    const response = await fetch('http://localhost:8001/stream-audio', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: text, output_path: "temp_audio.wav" }), // Adjust output path if needed
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let buffer = new Uint8Array();

    while (true) {
      const { done, value } = await reader!.read();

      if (done) {
        break;
      }

      if (value) {
        // Append the new chunk to our buffer
        const newBuffer = new Uint8Array(buffer.length + value.length);
        newBuffer.set(buffer);
        newBuffer.set(value, buffer.length);
        buffer = newBuffer;

        // Try to decode the current buffer
        try {
          const audioBuffer = await audioContext.decodeAudioData(buffer.slice().buffer);
          const source = audioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContext.destination);
          source.start(0);

          // After playing, reset the buffer to process the next chunk independently
          buffer = new Uint8Array();
        } catch (error) {
          // Handle potential decoding errors if the chunk is incomplete
          console.warn("Audio decoding in progress or incomplete chunk.");
        }
      }
    }

    console.log("Audio stream finished.");

  } catch (error: any) {
    console.error("Error fetching and streaming TTS:", error);
  }
};
