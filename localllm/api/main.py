from contextlib import asynccontextmanager
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from transformers import AutoTokenizer, AutoModelForCausalLM, TextIteratorStreamer
import torch
from threading import Thread
import asyncio

model = None
tokenizer = None
MODEL_NAME = "TinyLlama/TinyLlama-1.1B-Chat-v1.0"
QUANTIZED = True


class QueryRequest(BaseModel):
    query: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, tokenizer
    try:
        tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
        model = AutoModelForCausalLM.from_pretrained(MODEL_NAME).to("cpu")
        model.eval()
        print(f"Model {MODEL_NAME} loaded successfully on CPU")
        yield
    except Exception as e:
        print(f"Error loading model: {e}")
    finally:
        print("Application shutdown")


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


async def generate_response_stream(prompt: str):
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet.")

    formatted_prompt = f"<|user|>\n{prompt}<|assistant|>\n"
    inputs = tokenizer(formatted_prompt, return_tensors="pt").to(model.device)
    streamer = TextIteratorStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)
    generation_kwargs = dict(inputs, streamer=streamer, max_new_tokens=150, num_return_sequences=1)

    thread = Thread(target=model.generate, kwargs=generation_kwargs)
    thread.start()

    for new_text in streamer:
        yield new_text
        await asyncio.sleep(0.01)


@app.post("/stream-query")
async def stream_model(request: QueryRequest):
    return StreamingResponse(generate_response_stream(request.query), media_type="text/plain")


@app.post("/query")
async def query_model(request: QueryRequest):
    response = ""
    async for chunk in generate_response_stream(request.query):
        response += chunk
    return {"response": response}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
