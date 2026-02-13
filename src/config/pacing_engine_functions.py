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

silence_map = {
    '.': 500,    # Standard pause
    ';': 200,    # Short pause
    '...': 900, # Dramatic pause
    ':': 400,    # Introduction pause
    '!': 600,    # Exclamatory pause
    '?': 600,    # Question pause
}

# def _apply_silence_tags(text: str, silence_map: dict) -> str:
#     """Injects <[silence:XXX]> after punctuation marks."""
#     print("entering apply silence tags function")
#     punct_pattern = re.compile(f"([{re.escape(''.join(silence_map.keys()))}])")
#     print(punct_pattern)

#     def replace_match(match):
#         punct = match.group(1)
#         return f"{punct}<[silence:{silence_map[punct]}]>"

#     print(punct_pattern.sub(replace_match, text))
#     return punct_pattern.sub(replace_match, text)

def _apply_silence_tags(text: str, silence_map: dict) -> str:
    # Match punctuation only if NOT preceded/followed by a digit
    punct_pattern = re.compile(
        r'(?<!\d)([.;!:?])(?!\d)|(\.{3})'
    )
    def replace_match(match):
        punct = match.group(1) or match.group(2)
        return f"{punct}<[silence:{silence_map[punct]}]>"
    
    print(punct_pattern.sub(replace_match, text))
    return punct_pattern.sub(replace_match, text)