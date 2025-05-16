from contextlib import asynccontextmanager
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch


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


async def generate_response(prompt: str):
    if model is None or tokenizer is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet.")

    try:
        formatted_prompt = f"<|user|>\n{prompt}<|assistant|>\n"
        inputs = tokenizer(formatted_prompt, return_tensors="pt").to(model.device)
        with torch.no_grad():
            outputs = model.generate(**inputs, max_new_tokens=150, num_return_sequences=1)
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        if formatted_prompt in response:
            response = response.replace(formatted_prompt, "").lstrip("\n")
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during inference: {e}")


@app.post("/query")
async def query_model(request: QueryRequest):
    response = await generate_response(request.query)
    return {"response": response}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
