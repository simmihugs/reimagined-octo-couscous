import time
from typing import List, Callable
from huggingface_hub import hf_hub_download
from llama_cpp import Llama

# --- Model and Prompt Setup (as in your API) ---

def deepseek_model_path() -> str:
    return hf_hub_download(
        repo_id="TheBloke/Deepseek-LLM-7B-Chat-GGUF",
        filename="deepseek-llm-7b-chat.Q4_K_M.gguf",
        local_dir="models",
        force_download=False,
    )

def deepseek_prompt(instruction: str) -> str:
    return f"<|user|>\n{instruction}\n<|assistant|>\n"

class Model:
    def __init__(
        self,
        model_path_func: Callable[[], str],
        prompt_formatter: Callable[[str], str],
        temperatur: float = 0.7,
        max_tokens: int = 128,
        n_ctx: int = 4096,
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

    def generate_sentences(self, instruction: str, n: int) -> List[str]:
        prompt = self.prompt_formatter(instruction)
        response = self.llm(
            prompt,
            max_tokens=self.max_tokens,
            temperature=self.temperatur,
            stop=["<|user|>", "<|endoftext|>"],
        )
        # Split by newlines or list markers
        text = response["choices"][0]["text"]
        # Try to split on newlines and remove empty lines
        sentences = [s.strip("-* \n") for s in text.split("\n") if s.strip()]
        return sentences[:n]

# --- Main Script ---

if __name__ == "__main__":
    model = Model(
        model_path_func=deepseek_model_path,
        prompt_formatter=deepseek_prompt,
        temperatur=0.8,
        max_tokens=512,
        n_ctx=4096,
        verbose=False,
    )

    total_needed = 1000
    batch_size = 25
    all_sentences = set()

    instruction = (
        "Generate a list of short, friendly, helpful sentences that could be used as responses "
        "to common onboarding questions from patients joining a telehealth platform. "
        "Each sentence should be appropriate for a healthcare chatbot and easy to understand. "
        "Examples: 'Welcome to our telehealth service!', 'Please let us know if you have any allergies.', "
        "'Your privacy is important to us.', 'Would you like to schedule your first appointment?', "
        "'How can I assist you today?', 'You can upload your medical documents here.', "
        "'Do you have any questions about your medication?', 'Our doctors are here to help you.'"
        "\n\nPlease generate 25 such sentences, each on a new line."
    )

    while len(all_sentences) < total_needed:
        print(f"Generating batch... ({len(all_sentences)}/{total_needed})")
        batch = model.generate_sentences(instruction, batch_size)
        before = len(all_sentences)
        all_sentences.update(batch)
        after = len(all_sentences)
        print(f"Added {after - before} new sentences.")
        time.sleep(1)  # Be nice to your CPU/GPU

    # Save to file
    with open("telehealth_onboarding_sentences.txt", "w", encoding="utf-8") as f:
        for i, sentence in enumerate(sorted(all_sentences), 1):
            f.write(f"{i}. {sentence}\n")

    print("Done! Saved 1000 unique onboarding sentences to telehealth_onboarding_sentences.txt")
