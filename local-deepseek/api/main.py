import time
import gc
from random import randint
from typing import List, Callable, Optional
from huggingface_hub import hf_hub_download
from llama_cpp import Llama


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


def zephyr_model_path() -> str:
    """
    Download the Zephyr 7B model (Q4 quantization).
    """
    return hf_hub_download(
        repo_id="TheBloke/zephyr-7B-beta-GGUF",
        filename="zephyr-7b-beta.Q4_K_M.gguf",
        local_dir="models",
        force_download=False,
    )


def zephyr_prompt(question: str) -> str:
    """
    Zephyr prompt format (simple QA).
    """
    return f"Q: {question}\nA:"


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

    def answer_my_question(self, question: str, time_it: bool = False) -> str:
        prompt = self.prompt_formatter(question)
        start: Optional[float] = None
        end: Optional[float] = None
        if time_it:
            start = time.time()
        response = self.llm(
            prompt, max_tokens=self.max_tokens, temperature=self.temperatur
        )
        if time_it:
            end = time.time()
        if time_it and start is not None and end is not None:
            print(f"\nDuration: {end - start:.2f} seconds")

        if isinstance(response, dict) and "choices" in response:
            return response["choices"][0]["text"].strip()
        return str(response)

    def stream_the_answer_to_my_question(
        self, question: str, time_it: bool = False
    ) -> None:
        prompt = self.prompt_formatter(question)
        start: Optional[float] = None
        end: Optional[float] = None
        if time_it:
            start = time.time()
        for chunk in self.llm(
            prompt, max_tokens=self.max_tokens, stream=True, temperature=self.temperatur
        ):
            if isinstance(chunk, dict) and "choices" in chunk:
                print(chunk["choices"][0]["text"].strip())
            if time_it and end is None:
                end = time.time()
        if time_it and start is not None and end is not None:
            print(f"\nDuration: {end - start:.2f} seconds")


def test1():
    questions: List[str] = [
        "What is the capital from france?",
        "How old was Sherlock Holmes in the books?",
    ]

    question: str = questions[randint(0, len(questions) - 1)]
    print(f"Q: {question}")

    deepseek = Model(
        model_path_func=deepseek_model_path,
        prompt_formatter=deepseek_prompt,
        n_ctx=int(8192 / 2),
        verbose=False,
    )

    response: str = deepseek.answer_my_question(question)
    print(response)

    del deepseek
    gc.collect()
    print("memory freed")

    question: str = questions[randint(0, len(questions) - 1)]
    print(f"Q: {question}")

    zephyr = Model(
        model_path_func=zephyr_model_path,
        prompt_formatter=zephyr_prompt,
        n_ctx=8192,
        verbose=False,
    )

    response: str = zephyr.answer_my_question(question)
    print(response)

    del zephyr
    gc.collect()
    print("memory freed")


def test2():
    question: str = "What should i eat tonight?"
    print(question)

    deepseek = Model(
        model_path_func=deepseek_model_path,
        prompt_formatter=deepseek_prompt,
        n_ctx=int(8192 / 2),
        verbose=False,
        max_tokens=1024,
    )

    response: str = deepseek.answer_my_question(question)
    print(response)


def test3():
    question: str = "What should i eat tonight?"
    print(question)

    deepseek = Model(
        model_path_func=deepseek_model_path,
        prompt_formatter=deepseek_prompt,
        n_ctx=int(8192 / 2),
        verbose=False,
        max_tokens=1024,
    )

    deepseek.stream_the_answer_to_my_question(question, time_it=True)


def test4():
    question: str = "What should i eat tonight?"
    print(question)

    deepseek = Model(
        model_path_func=deepseek_model_path,
        prompt_formatter=deepseek_prompt,
        n_ctx=int(8192 / 2),
        verbose=False,
        max_tokens=1024,
        temperatur=0.7,
    )

    deepseek.stream_the_answer_to_my_question(question, time_it=True)


def test5(temperatur: float):
    question: str = "What should i eat tonight?"
    print(question)

    deepseek = Model(
        model_path_func=deepseek_model_path,
        prompt_formatter=deepseek_prompt,
        n_ctx=int(8192 / 2),
        verbose=False,
        max_tokens=1024,
        temperatur=temperatur,
    )

    response: str = deepseek.answer_my_question(question, time_it=True)
    print(response)
    del deepseek
    gc.collect()


def test6():
    question: str = "What should i eat tonight?"
    print(question)

    deepseek = Model(
        model_path_func=deepseek_model_path,
        prompt_formatter=deepseek_prompt,
        n_ctx=int(8192 / 2),
        verbose=False,
        max_tokens=1024,
        temperatur=1.7,
    )
    deepseek.stream_the_answer_to_my_question(question, time_it=True)

if __name__ == "__main__":
    test6()
