import re

from src.config.pacing_engine_functions import silence_map_variations_openai_tts

text = """Life’s meaning. Absurdism questions it. The term 'absurdism' comes from 'absurd,' meaning something that doesn’t make sense. 
It’s like trying to find a pattern in a random splash of paint. Absurdism is often linked to the idea that life doesn’t have a clear purpose, 
even though humans keep searching for one. Imagine you’re playing a game without knowing the rules or the goal. You keep playing, hoping to figure it out, 
but it never becomes clear. This is how absurdism views life. A famous example is the story of Sisyphus from Greek mythology. He was condemned to roll a boulder up a hill, 
only for it to roll back down each time he reached the top. Despite the task being pointless, Sisyphus kept going. Absurdism suggests that, like Sisyphus, 
we can find happiness by accepting life’s lack of meaning and continuing anyway. Absurdism isn’t about giving up. It’s about embracing the freedom that comes with realizing there’s no set path. 
This perspective encourages creativity and personal choice, as there’s no 'right' way to live.
Three related subjects are existentialism, the search for meaning in philosophy, and how art reflects the absurdity of life."""

silences = silence_map_variations_openai_tts

def _apply_silence_tags(text: str, silence_map: dict) -> str:
    # Matches punct ONLY if followed by space or end of string
    # pattern = r'(\.{3}|[.;:!?])(?=\s|$)'
    # pattern = r'(\.{3}|[.;:!?\n])(?=\s|$)'
    # pattern = r'(?<!\b[A-Z])(\.{3}|[.;:!?\n])(?=\s|$)'
    pattern = r'(?<!\b[A-Z])(\.{3}|[.:;?!—])(?=\s|$)'
    
    def replace(m):
        p = m.group(1)
        # return f"{p}<[silence:{silence_map_short_openai_tts[p]}]>"
        # return f"{p}<[silence:{silence_map_openai_tts[p]}]>"
        # return f"{p}<[silence:{silence_map_long_openai_tts[p]}]>"
        return f"{p}<[silence:{silence_map[p]}ms]>"
        # return f"{p}<break time={silence_map[p]}ms/>"
    
    return re.sub(pattern, replace, text)

tts_text = _apply_silence_tags(text, silences)

print(tts_text)
