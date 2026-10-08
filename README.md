# Teller
AI narration Text-To-Speech project

🧠 **Teller** is an AI-powered application that syncs voice and background ambient music to create immersive, focus-improved narratives, triggering curiosity and the will to explore further and further.

## Features

- Converts subject into an insightful presentation with player controls
- Syncs narration with background track  
- Uses LLMs (mistral-medium-latest) text generation and text to speech (OpenAI tts - soon Voxtral tts by Mistral AI)

- The backend is powered by FastAPI.
- The Frontend player is handled by a uml generated state machine, created using the StateSmithg GitHub project.

Made with ❤️ by Granny.

![App Screenshot](https://github.com/grannygoestoheaven/teller/blob/main/docs/images/teller_screenshot_6.png)

Prototype UI: Red blocks = real-time audio generation. Backend functional; frontend in progress.
"Quantum Mechanics" = example subject. It can be any subject. Even a single word like "the". The very basic interaction is depicted in the screenshot. It is an early stage prototype.

- The button 'ooo' below 'teller' allows you to switch between dots (the current view), text, and grid modes.
- To listen to a new story, you can hover the text of the last generated story to select the words or subjects you're interested in, click to paste them in the form, then press Enter or start. You can also type what you want.
- The stories already played will fill the grid. You can hover them and press Enter to listen to them again.

The app is at its very early stage. Many more features are coming.
