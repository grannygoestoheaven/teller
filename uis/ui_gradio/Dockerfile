# Base Python image
FROM python:3.10-slim

# Non-interactive shell for apt
ENV DEBIAN_FRONTEND=noninteractive

# Add /app to PYTHONPATH so packages like teaicher are importable
ENV PYTHONPATH="/app:$PYTHONPATH"

# Install system-level dependencies
RUN apt-get update && apt-get install -y \
    git \
    ffmpeg \
    libgl1 \
    libvlc-dev \
    libvlccore-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Clone the GitHub repo (HTTPS version to avoid SSH key issues)
RUN git clone --branch main https://github.com/grannygoestoheaven/teaicher.git .

# Optional: Print a file to confirm contents
# RUN head -n 1 teaicher/data/get_track_duration.py

# Upgrade pip
RUN pip install --upgrade pip

# Clean stale metadata
RUN rm -rf *.egg-info

# Install the current repo as a Python package
RUN pip install --no-cache-dir .

# Copy the .env file for python-dotenv to read it
COPY .env /app/.env

# Default command to run the Gradio app
CMD ["python", "gradio_app.py"]
