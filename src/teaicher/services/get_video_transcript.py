from youtube_transcript_api import YouTubeTranscriptApi

def get_youtube_transcript(video_url):
    """
    Extracts the script (transcript) of a YouTube video.

    Args:
        video_id: The ID of the YouTube video (the part after 'v=' in the URL).

    Returns:
        A list of dictionaries, where each dictionary contains 'text', 'start',
        and 'duration' of a subtitle segment. Returns None if the transcript
        cannot be retrieved.
    """
    video_id = video_url.split("v=")[-1]
    
    try:
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        transcript = transcript_list.find_generated_transcript(['en', 'fr']) # Try English first, then French
        if not transcript:
            transcript = transcript_list.find_manually_created_transcript(['en', 'fr']) # Try manual if generated not found
        if transcript:
            return transcript.fetch()
        else:
            print(f"No English or French transcript found for video ID: {video_id}")
            return None
    except Exception as e:
        print(f"An error occurred while fetching the transcript for video ID {video_id}: {e}")
        return None
    