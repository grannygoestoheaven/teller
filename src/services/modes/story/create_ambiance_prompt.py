from mistralai.client import Mistral

from src.config.settings import env_settings

mistral_client = Mistral(api_key=env_settings.mistral_api_key)

def create_ambience_prompt(story):
    response = mistral_client.chat.complete(
        model = "mistral-medium-latest",
        messages=[
            {
                "content": story,
                "role": "system"
            },
            {
                "content": f"generate a prompt for a background audio generation tool.
                you will use the content of {story} to ask for a corresponding background sounds and textures.
                The prompt will not exceed 200 characters"
                "role": "user"
            },
            
        ],
        # max_tokens=1350,
        max_tokens=400,
        temperature=0.3,
        presence_penalty=0.5
    )
        
    ambience_prompt = response.choices[0].message.content if response else ""
    
    return ambiance_prompt
    