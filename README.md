# Teller
AI narration Text-To-Speech project

🧠 **Teller** is an AI-powered application that syncs voice and background ambient music to create immersive, focus-improved narratives, triggering curiosity and the will to explore further and further.

## Features

* A generative AI + text-to-speech application that turns any topic into engaging 1-minute audio summaries — voice, ambient music layers, and narrative techniques combined into an immersive discovery experience. Designed for attentive listening and exploration.  
    * Built and deployed end-to-end, solo: FastAPI backend, JS frontend, containerized service running on Scaleway Cloud, with CI/CD via GitHub Actions and media/text storage on Scaleway S3.  
    * Integrates Mistral LLM (text generation) and OpenAI TTS (speech) in a single orchestration pipeline with request deduplication — stories are generated once, stored, then served.  
    * Frontend features a UML-driven state machine audio player and an original text-highlighting interaction for AI-friendly reading.  
    * Currently being hardened: request logging, API cost monitoring, and authentication — building production-grade habits into my own product.  Tech: Python, FastAPI, JavaScript, Vite, Docker, GitHub Actions, Scaleway Cloud (container + S3). 

Made with ❤️ by Granny.

![App Screenshot](https://github.com/grannygoestoheaven/teller/blob/main/docs/images/teller_screenshot_6.png)

Prototype UI: Red blocks = real-time audio generation. Backend functional; frontend in progress.
"Quantum Mechanics" = example subject. It can be any subject. Even a single word like "the". The very basic interaction is depicted in the screenshot. It is an early stage prototype.

- The button 'ooo' below 'teller' allows you to switch between dots (the current view), text, and grid modes.
- To listen to a new story, you can hover the text of the last generated story to select the words or subjects you're interested in, click to paste them in the form, then press Enter or start. You can also type what you want.
- The stories already played will fill the grid. You can hover them and press Enter to listen to them again.

The app is at its very early stage. Many more features are coming.
