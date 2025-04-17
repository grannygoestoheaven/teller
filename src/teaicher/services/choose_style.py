def choose_style(option):
    if option == "storytelling":       
        # Read the pattern and inject the variable directly
        with open('src/teaicher/config/patterns/insightful_brief.md', 'r') as file:
            pattern = file.read() # Default pattern content
            
            # Pass the estimated_chars into the pattern
            pattern = pattern.replace("{subject}", str(subject))
            pattern = pattern.replace("{estimated_chars}", str(estimated_chars))
                
    elif option == "news":
        # Read the pattern that generates a news format brief
        with open('src/teaicher/config/patterns/news_brief.md', 'r') as file:
            pattern = file.read() # Default pattern content
            
            # Pass the estimated_chars into the pattern
            pattern = pattern.replace("{subject}", str(video_to_summarize_url))
            # pattern = pattern.replace("{estimated_chars}", str(estimated_chars))
    return pattern