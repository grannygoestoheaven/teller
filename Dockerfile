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
# Copy application code with correct ownership
COPY --chown=appuser:appuser . .

# Switch to non-root user for security
USER appuser

# Configure Git user globally (now writable because /app is correctly owned by appuser)
RUN git config --global user.email "grannygoestoheaven@users.noreply.huggingface.co" && \
    git config --global user.name "grannygoestoheaven"

# Install Python dependencies (as appuser)
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements-minimal.txt

# Expose the port your Flask application listens on.
EXPOSE 7860

# Create necessary directories with correct permissions
RUN mkdir -p /app/static/css /app/static/fonts/inika && \
    chown -R appuser:appuser /app/static && \
    chmod -R 755 /app/static

# Copy static files with correct ownership and permissions
COPY --chown=appuser:appuser static/ /app/static/

# Ensure all files in static are readable
RUN chmod -R 644 /app/static/* && \
    find /app/static -type d -exec chmod 755 {} +

# Set working directory to ensure relative paths work
WORKDIR /app

# Command to run the application when the container starts (as appuser)
CMD ["python", "flask_ui_app_new.py"]

# --- Cache-busting comment ---
# Ultimate permission fix attempt: 20250531-FINAL%                                              