import { saveStoryToStorage, loadStoryFromStorage } from './storage.js';
import { initLoadingElements, showLoadingAnimation, hideLoadingAnimation } from './loadingAnimation.js';
import { initTextStreamer, streamText, clearHighlights } from './textStreamer.js';

/* ✨ swap old audioControls for the new Web-Audio module */
import { initElements, playStory} from './webAudioAPI.js';

document.addEventListener('DOMContentLoaded', async () => {
    const form            = document.getElementById('story-form');
    const chatHistory     = document.getElementById('chatHistory');
    const subjectInput    = document.getElementById('subject');
    const generateButton  = document.getElementById('generateButton');

    /* all three <audio> elements in the HTML */
    const speechAudio     = document.getElementById('speechAudio');
    const backgroundAudio = document.getElementById('backgroundAudio');

    const loadingAnimationContainer = document.getElementById('loadingAnimationContainer');
    const loadingAnimation          = document.getElementById('loadingAnimation');
    const period1 = loadingAnimation.querySelector('.period-1');
    const period2 = loadingAnimation.querySelector('.period-2');
    const period3 = loadingAnimation.querySelector('.period-3');

    /* ── initialise helper modules ────────────────────────── */
    initElements({                  // ← Web-Audio setup
      background:  backgroundAudio,
      speech:      speechAudio,
    });

    initLoadingElements(loadingAnimationContainer, loadingAnimation, period1, period2, period3, chatHistory);
    initTextStreamer(chatHistory, subjectInput);

    /* (click-sound code unchanged …) */

    /* ------------------------------------------------------- */
    const savedStory   = loadStoryFromStorage();
    loadingAnimationContainer.style.display = 'none';

    let isGenerating   = false;
    let currentStoryText = '';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (isGenerating) return;

        isGenerating        = true;
        generateButton.disabled = true;

        /* (optional) quick local fade-out of any STILL-PLAYING BG from
           a previous run – harmless to keep */
        if (backgroundAudio.duration > 0 && !backgroundAudio.paused) {
            let v = backgroundAudio.volume;
            const step = v / (10000 / 50);
            const id = setInterval(() => {
                v = Math.max(0, v - step);
                backgroundAudio.volume = v;
                if (v === 0) { clearInterval(id); backgroundAudio.pause(); }
            }, 50);
        }
        speechAudio.pause(); speechAudio.currentTime = 0;

        showLoadingAnimation();

        /* ---- fetch story ---- */
        const formData = new FormData();
        formData.append('subject', subjectInput.value.trim());
        subjectInput.value = '';

        try {
            const response = await fetch('/generate_story', { method:'POST', body:formData });
            if (!response.ok) throw new Error(await response.text());

            const data = await response.json();
            currentStoryText = data.story;

            /* 🔊  start Web-Audio sequence */
            playStory(data);

            const title = formData.get('subject') || 'Untitled Story';
            saveStoryToStorage(data.story, title);

        } catch (err) {
            console.error(err);
            chatHistory.innerHTML = `<div class="message error">Error generating story: ${err.message}</div>`;
            hideLoadingAnimation();
            isGenerating = false;
            generateButton.disabled = false;
        }
    });

    /* when speech finishes */
    document.addEventListener('speechEnded', () => {
        hideLoadingAnimation();
        streamText(currentStoryText);
        chatHistory.classList.add('text-full');
        isGenerating = false;
        generateButton.disabled = false;
    });

    /* optional landscape-toggle button */
    // document.getElementById('toggle-land')
    //         ?.addEventListener('click', () => toggleLandscape());

    clearHighlights();
});
