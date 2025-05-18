from typing import Callable, Optional, AsyncGenerator
from huggingface_hub import hf_hub_download
from llama_cpp import Llama
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from contextlib import asynccontextmanager


def deepseek_model_path() -> str:
    """
    Download the DeepSeek 7B Chat model (Q4 quantization).
    """
    return hf_hub_download(
        repo_id="TheBloke/Deepseek-LLM-7B-Chat-GGUF",
        filename="deepseek-llm-7b-chat.Q4_K_M.gguf",
        local_dir="models",
        force_download=False,
    )


def deepseek_prompt(question: str) -> str:
    """
    DeepSeek ChatML prompt format.
    """
    return f"<|user|>\n{question}\n<|assistant|>\n"


class Model:
    def __init__(
        self,
        model_path_func: Callable[[], str],
        prompt_formatter: Callable[[str], str],
        temperatur: float = 0,
        max_tokens: int = 32,
        n_ctx: int = 8192,
        verbose: bool = False,
    ):
        self.temperatur = temperatur
        self.verbose = verbose
        self.max_tokens = max_tokens
        self.model_path = model_path_func()
        self.prompt_formatter = prompt_formatter
        self.llm = Llama(
            model_path=self.model_path,
            n_ctx=n_ctx,
            n_threads=8,
            verbose=self.verbose,
        )

    def query(self, question: str) -> str:
        prompt = self.prompt_formatter(question)
        response = self.llm(
            prompt, max_tokens=self.max_tokens, temperature=self.temperatur
        )
        if isinstance(response, dict) and "choices" in response:
            return response["choices"][0]["text"].strip()
        return str(response)

    async def query_stream(self, question: str) -> AsyncGenerator[str, None]:
        prompt = self.prompt_formatter(question)
        for chunk in self.llm(
            prompt, max_tokens=self.max_tokens, stream=True, temperature=self.temperatur
        ):
            if isinstance(chunk, dict) and "choices" in chunk:
                yield chunk["choices"][0]["text"]


model: Optional[Model] = None


class QueryRequest(BaseModel):
    query: str


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model
    try:
        model = Model(
            model_path_func=deepseek_model_path,
            prompt_formatter=deepseek_prompt,
            n_ctx=4096,
            verbose=False,
            max_tokens=1024,
            temperatur=1.7,
        )
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


@app.post("/stream-query")
async def stream_model(request: QueryRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet.")

    return StreamingResponse(model.query_stream(request.query), media_type="text/plain")


@app.post("/query")
async def query_model(request: QueryRequest):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet.")

    response = model.query(request.query)
    return {"response": response}
