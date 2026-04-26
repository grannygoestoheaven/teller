# Teller
AI narration Text-To-Speech project

🧠 **Teller** is an AI-powered application that syncs voice and background ambient music to create immersive, focus-improved narratives, triggering curiosity and the will to explore further and further.

"Teller transforms any subject into an immersive 1-minute audio summary, using TTS + AI to boost engagement and retention."

Test the demo here : https://tellercontainerc73fsqdz-container-flamboyant-curran.functions.fnc.fr-par.scw.cloud

## Features

- Converts subject into an insightful presentation with player controls
- Syncs narration with background track  
- Uses LLMs (mistral-medium-latest) text generation and text to speech (OpenAI tts - soon Voxtral tts by Mistral AI)

- The backend is powered by FastAPI.
- The Frontend player is handled by a uml generated state machine, created using the StateSmithg GitHub project.

Made with ❤️ by Granny.

![App Screenshot](https://github.com/grannygoestoheaven/teller/blob/main/docs/images/teller_screenshot_6.png)

Prototype UI: Red blocks = real-time audio generation. Backend functional; frontend in progress.
"Quantum Mechanics" = example subject. It can be any subject. The very basic interaction is depicted in the screenshot. It is an early stage prototype.

- The button below 'teller' allows you to switch between dots (the current view), text, and grid modes.
- To listen to a new story, you can hover the text to select the words or subjects you're interested in, then press Enter or start. You can also type what you want.
- The stories already played will fill the grid. You can hover them and press Enter to listen to them again.

NOTE: the pacing is handled via a punctuation dictionary that insert silences tags in the generated text, before sending it to the text to speech function. It's customizable and adaptable, and avoids wasting tokens by asking the model to place them in the text. It works pretty well but the control is not total yet, the openai tts is a bit opaque and some pauses can be longer or shorter than expected. Tests with Eleven Labs and Voxtral tts are ongoing.

The app is at its very early stage. Many more features are coming.
