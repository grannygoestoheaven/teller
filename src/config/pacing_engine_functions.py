import re

def _apply_silence_tags(text: str, silence_map: dict) -> str:
    # Matches punct ONLY if followed by space or end of string
    # pattern = r'(\.{3}|[.;:!?])(?=\s|$)'
    # pattern = r'(\.{3}|[.;:!?\n])(?=\s|$)'
    # pattern = r'(?<!\b[A-Z])(\.{3}|[.;:!?\n])(?=\s|$)'
    pattern = r'(?<!\b[A-Z])(\.{3}|[:;?!—])(?=\s|$)'
    
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

silence_map_variations_openai_tts = {
    ';': 80,    # Short pause
    '!': 110,    # Exclamatory pause
    '?': 110,    # Question pause
    '—': 70,    # Em dash pause
    ':': 80,    
}

silence_map_long_plus_openai_tts = {
    '.': 1300,    # Standard pause
    ';': 150,    # Short pause
    '!': 150,    # Exclamatory pause
    '?': 150,    # Question pause
    '—': 150,    # Em dash pause
    ':': 150,    
}

silence_map_long_openai_tts = {
    '.': 800,    # Standard pause
    ';': 100,    # Short pause
    '!': 100,    # Exclamatory pause
    '?': 100,    # Question pause
    '—': 100,    # Em dash pause
    ':': 100,
}

silence_map_medium_openai_tts = {
    '.': 500,    # Standard pause
    ';': 70,    # Short pause
    '!': 70,    # Exclamatory pause
    '?': 70,    # Question pause
    '—': 70,    # Em dash pause
    ':': 70,
}

silence_map_short_openai_tts = {
    '.': 300,    # Standard pause
    ';': 50,    # Short pause
    '!': 50,    # Exclamatory pause
    '?': 50,    # Question pause
    ':': 50,    # Introduction pause
    '—': 50,    # Em dash pause
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