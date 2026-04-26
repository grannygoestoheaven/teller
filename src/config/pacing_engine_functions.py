import re

# silence_map = {
#     '.': 1200,    # Standard pause
#     ';': 600,    # Short pause
#     '...': 2000, # Dramatic pause
#     ':': 1000,    # Introduction pause
#     '!': 1400,    # Exclamatory pause
#     '?': 1400,    # Question pause
# }

# silence_map = {
#     '.': 300,    # Standard pause
#     ';': 150,    # Short pause
#     '...': 500, # Dramatic pause
#     ':': 250,    # Introduction pause
#     '!': 350,    # Exclamatory pause
#     '?': 350,    # Question pause
# }

# def _apply_silence_tags(text: str, silence_map: dict) -> str:
#     """Injects <[silence:]> after punctuation marks."""
#     print("entering apply silence tags function")
#     punct_pattern = re.compile(f"([{re.escape(''.join(silence_map.keys()))}])")
#     print(punct_pattern)

#     def replace_match(match):
#         punct = match.group(1)
#         return f"{punct}<[silence:{silence_map[punct]}]>"

#     print(punct_pattern.sub(replace_match, text))
#     return punct_pattern.sub(replace_match, text)

# def _apply_silence_tags(text: str, silence_map: dict) -> str:
#     # Match punctuation only if NOT preceded/followed by a digit
#     punct_pattern = re.compile(
#         r'(?<!\d)([.;!:?])(?!\d)|(\.{3})'
#     )
#     def replace_match(match):
#         punct = match.group(1) or match.group(2)
#         return f"{punct}<[silence:{silence_map[punct]}]>"
    
#     print(punct_pattern.sub(replace_match, text))
#     return punct_pattern.sub(replace_match, text)

def _apply_silence_tags(text: str, silence_map: dict) -> str:
    # Matches punct ONLY if followed by space or end of string
    # pattern = r'(\.{3}|[.;:!?])(?=\s|$)'
    # pattern = r'(\.{3}|[.;:!?\n])(?=\s|$)'
    # pattern = r'(?<!\b[A-Z])(\.{3}|[.;:!?\n])(?=\s|$)'
    pattern = r'(?<!\b[A-Z])(\.{3}|[.;:!])(?=\s|$)'
    
    def replace(m):
        p = m.group(1)
        # return f"{p}<[silence:{silence_map_short_openai_tts[p]}]>"
        return f"{p}<[silence:{silence_map_openai_tts[p]}]>"
    
    return re.sub(pattern, replace, text)

silence_map_openai_tts = {
    '\n': 1000,    # Newline pause
    '.': 400,    # Standard pause
    ';': 100,    # Short pause
    '...': 900, # Dramatic pause
    ':': 100,    # Introduction pause
    '!': 400,    # Exclamatory pause
    '?': 100,    # Question pause
    '-': 100,    # Dash pause
    ',': 100,
}

silence_map_short_openai_tts = {
    '\n' : 500,    # Newline pause
    '.': 200,    # Standard pause
    ';': 150,    # Short pause
    '...': 900, # Dramatic pause
    ':': 120,    # Introduction pause
    '!': 110,    # Exclamatory pause
    '-': 150,    # Dash pause
    ',': 100,
    '?': 100,
}
