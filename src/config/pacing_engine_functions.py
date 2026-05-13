import re

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

silence_map_openai_tts = {
    '\n': 1000,  # Newline pause
    '.': 400,    # Standard pause
    ';': 100,    # Short pause
    '...': 900,  # Dramatic pause
    ':': 100,    # Introduction pause
    '!': 400,    # Exclamatory pause
    '?': 100,    # Question pause
    '-': 100,    # Dash pause
    ',': 100,    # comma pause
    '(': 50,     # open parenthese pause
    ')': 50,     # close parenthese pause
}

silence_map_long_openai_tts = {
    '.': 600,    # Standard pause
    ';': 200,    # Short pause
    '!': 800,    # Exclamatory pause
    '?': 200,    # Question pause
    '—': 200,    # Em dash pause
    ':': 200,
}

silence_map_short_openai_tts = {
    '\n': 500,  # Newline pause
    '.': 200,    # Standard pause
    ';': 150,    # Short pause
    '...': 900,  # Dramatic pause
    ':': 120,    # Introduction pause
    '!': 110,    # Exclamatory pause
    '-': 150,    # Dash pause
    ',': 100,    # comma pause
    '?': 100,    # question mark pause
    '(': 50,     # open parenthese pause
    ')': 50,     # close parenthese pause
}

silence_map_elevenlabs_tts = {
    '\n': "[long pause]",  # Newline pause
    '.': "[long pause]",    # Standard pause
    ';': "[pause]",    # Short pause
    ':': "[pause]",    # Introduction pause
    '!': "[long pause]",    # Exclamatory pause
    '?': "[long pause]",    # Question pause
    '-': "[pause]",    # Dash pause
    ',': "[pause]",    # comma pause
}