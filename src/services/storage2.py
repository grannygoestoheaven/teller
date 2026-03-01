import os
import json
import random
import boto3

from pathlib import Path
from datetime import datetime
from scaleway import Client  # or boto3 for AWS/S3
from botocore.client import Config

from src.config.settings import EnvSettings

# --- Low-level clients ---
class LocalFileSystem:
    def upload_file(self, file_data, key):
        os.makedirs(os.path.dirname(f"static/{key}"), exist_ok=True)
        with open(f"static/{key}", "wb") as f:
            f.write(file_data)
            
    def download_file(self, key):
        with open(f"static/{key}", "rb") as f:
            return f.read()

    def generate_url(self, key):
        return f"/static/{key}"

# class BucketClient:
#     def __init__(self, settings):
#         self.client = Client(
#             endpoint=settings.scw_endpoint,
#             access_key=settings.scw_access_key,
#             secret_key=settings.scw_secret_key,
#             region="fr-par"
#         )
#         self.bucket_name = settings.scw_bucket_name

class BucketClient:
    def __init__(self, settings):
        self.client = boto3.client(
            's3',
            endpoint_url=settings.scw_endpoint,
            aws_access_key_id=settings.scw_access_key,
            aws_secret_access_key=settings.scw_secret_key,
            config=Config(signature_version='s3v4'),
            region_name='fr-par'
        )
        self.bucket_name = settings.scw_bucket_name

    def upload_file(self, file_data, key):
        self.client.upload_file(
            bucket_name=self.bucket_name,
            file_data=file_data,
            key=key
        )
    
    def download_file(self, key):
        return self.client.download_file(
            bucket_name=self.bucket_name,
            key=key
        )

    # def generate_url(self, key):
    #     return self.client.generate_presigned_url(
    #         bucket_name=self.bucket_name,
    #         key=key
    #     )
    
    def generate_url(self, key):
        return self.client.generate_presigned_url(
            'get_object',
            Params={'Bucket': self.bucket_name, 'Key': key},
            ExpiresIn=3600
        )


# --- High-level backend ---
class StorageBackend:
    def __init__(self, use_bucket, settings=None):
        self.use_bucket = use_bucket
        self.client = BucketClient(settings) if use_bucket else LocalFileSystem()
        self._tracks = []
        self._played_tracks = []
    
    # ==== STORING FUNCTIONS =====

    def save_txt_to_json_file(self, story_filename, story_title, tagged_story_for_tts, clean_story):
        payload = {
            "story_filename": story_filename,
            "story_title": story_title,
            "tagged_story_for_tts": tagged_story_for_tts,
            "clean_story": clean_story,
            "timestamp": datetime.utcnow().strftime('%Y%m%dT%H%M%SZ')
        }
        key = f"stories/{story_filename}/{story_filename}.json"
        print(f"Saving text to: {key}")
        self.client.upload_file(json.dumps(payload).encode('utf-8'), key)
        return self.client.generate_url(key)

    def save_mp3_speech_file(self, story_foldername: str, speech_filename: str, speech_audio: bytes) -> str:
        """
        Saves the speech mp3 audio content to a file in the specified directory.
        """
        key = f"stories/{story_foldername}/{speech_filename}"
        print(f"Saving mp3 file to: {key}")
        self.client.upload_file(speech_audio, key)
        return self.client.generate_url(key)

    # ==== FETCHING FUNCTIONS =====

    # def get_tagged_text_from_json_file(self, story_filename) -> str:
    #     """
    #     Extracts the tagged story for TTS from the saved JSON file.
    #     """        
    #     key = f"stories/{story_filename}/{story_filename}.json"
    #     print(f"Retrieving tagged story from: {key}")

    #     return self.client.generate_url(key)

    # def get_clean_text_from_json_file(self, story_filename) -> str:
    #     """
    #     Extracts the cleaned story from the saved JSON file.
    #     """        
    #     key = f"stories/{story_filename}/{story_filename}.json"
    #     print(f"Retrieving clean story from: {key}")
    
    #     return self.client.generate_url(key)
    
    def get_clean_text_from_json_file(self, story_filename) -> str:
        """
        Extracts the cleaned story from the saved JSON file.
        """    
        key = f"stories/{story_filename}/{story_filename}.json"
        json_data = self.client.download_file(key)
        payload = json.loads(json_data)
        
        return payload["clean_story"]  # Return the actual text

    def get_tagged_text_from_json_file(self, story_filename) -> str:
        """
        Extracts the tagged story for TTS from the saved JSON file.
        """        
        key = f"stories/{story_filename}/{story_filename}.json"
        json_data = self.client.download_file(key)
        payload = json.loads(json_data)
        
        return payload["tagged_story_for_tts"]  # Return the actual tagged text

    # def get_text_title_from_json_file(self, story_filename) -> str:
    #     """
    #     Returns clean title for a story from storage.
    #     """        
    #     key = f"stories/{story_filename}/{story_filename}.json"
    #     print(f"Retrieving filename from: {key}")
    
    #     return self.client.generate_url(key)
    
    def get_text_title_from_json_file(self, story_filename) -> str:
        """
        Returns clean title for a story from storage.
        """     
        key = f"stories/{story_filename}/{story_filename}.json"
        json_data = self.client.download_file(key)
        payload = json.loads(json_data)
        
        return payload["story_title"]  # Return the actual title
        
    def get_speech_url(self, story_filename: str) -> str:
        """
        Returns the speech URL for a story from storage.
        """
        key = f"stories/{story_filename}/{story_filename}.mp3"
        print(f"Retrieving filename from: {key}")
    
        return self.client.generate_url(key)

    # ======= BACKGROUND TRACKS  =======

    def _initialize_tracks(self, tracks_dir):
        """List tracks from cloud storage or local filesystem"""
        if not self.use_bucket:
            # Local implementation
            self._tracks = [
                f.name for f in tracks_dir.iterdir()
                if f.suffix.lower() in (".mp3", ".wav", ".flac")
            ]
        else:
            # Cloud implementation - matches your bucket structure
            response = self.client.scaleway_client.list_objects(
                bucket_name=self.bucket_name,
                prefix="static/audio/local_ambient_tracks/"  # Your exact path
            )
            self._tracks = [
                obj.key.split('/')[-1]  # Extract just the filename
                for obj in response.objects
                if obj.key.endswith(('.mp3', '.wav', '.flac'))
            ]

        random.shuffle(self._tracks)

    def get_random_track_url(self, tracks_dir):
        """Generate URL for track"""
        if not self._tracks:
            self._initialize_tracks(tracks_dir)

        if not self._tracks:
            return None

        track_filename = self._tracks.pop(0)
        self._played_tracks.append(track_filename)

        if self.use_bucket:
            return self.client.generate_url(f"static/audio/local_ambient_tracks/{track_filename}")
        else:
            return f"/static/audio/local_ambient_tracks/{track_filename}"
