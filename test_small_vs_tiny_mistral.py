import subprocess

from time import time
from pathlib import Path
from jinja2 import Template

from src.config.settings import DEFAULT_PROMPT_PATH

prompt_template = Path(DEFAULT_PROMPT_PATH).read_text()
prompt = Template(prompt_template).render(difficulty="beginner", subject="what is science")

def benchmark(model):
    start = time()
    result = subprocess.run(
        ["mistral-ai", model, "--prompt", prompt, "--temp", "0.1"],
        capture_output=True,
        text=True
    )
    latency = time() - start
    print(f"--- {model.upper()} ---")
    print(result.stdout)
    print(f"Latency: {latency:.2f}s\n")
    return latency

small_latency = benchmark("mistral-small-latest")
tiny_latency = benchmark("mistral-tiny-latest")
print(f"Tiny is {small_latency-tiny_latency:.2f}s faster (if positive).")
