# Base Python image
FROM python:3.10-slim

# Set environment variables that do not change based on user context
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV DEBIAN_FRONTEND=noninteractive

# Install system dependencies (all as root)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    wget \
    ffmpeg \
    libgl1 \
    libvlc-dev \
    libvlccore-dev \
    vlc \
    && rm -rf /var/lib/apt/lists/*

# --- User Management (as root) ---
# Create appuser with UID 1000
RUN groupadd -r appuser && useradd -r -g appuser -u 1000 appuser

# Create /app directory and set initial ownership (as root)
RUN mkdir -p /app && chown appuser:appuser /app

# Set HOME environment for the appuser (even though we're still root for now)
ENV HOME=/app

# Set working directory to /app (still as root for now)
WORKDIR /app

# --- Copy Files and Force Permissions (as root) ---
# Copy all project files into /app (still owned by root potentially by default after COPY)
ENV PATH="/app/.local/bin:${PATH}"

COPY . .

# CRITICAL FIX: Explicitly and recursively force ownership and permissions for ALL files in /app
# This runs as root, ensuring it has the power to change anything.
# chown -R appuser:appuser /app: Recursively changes owner and group to appuser.
# chmod -R u=rwX,g=rX,o=rX /app: Recursively sets permissions:
#   u=rwX: user (appuser) has read, write, execute (X for directories)
#   g=rX: group (appuser) has read, execute (X for directories)
#   o=rX: others have read, execute (X for directories)
RUN chown -R appuser:appuser /app && \
    chmod -R u=rwX,g=rX,o=rX /app

# --- Switch to Non-Root User for all subsequent operations and runtime ---
USER appuser

# Configure Git user globally (now writable because /app is correctly owned by appuser)
RUN git config --global user.email "grannygoestoheaven@users.noreply.huggingface.co" && \
    git config --global user.name "grannygoestoheaven"

# Install Python dependencies (as appuser)
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements-minimal.txt

# Expose the port your Flask application listens on.
EXPOSE 8000

# Command to run the application when the container starts (as appuser)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# --- Cache-busting comment ---
# Ultimate permission fix attempt: 20250531-FINAL%                                              