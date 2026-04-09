# === STAGE 1: Build ===
FROM python:3.11 as builder

# Install system dependencies (as root)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    wget \
    curl \
    && curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Python requirements first for caching
COPY requirements-minimal.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements-minimal.txt

# Copy Vite package files for caching
COPY teller_vite/package*.json ./teller_vite/
WORKDIR /app/teller_vite
RUN npm ci --omit=dev

# Copy the rest of the project
COPY . .
WORKDIR /app/teller_vite
RUN npm run build:vite-build

# === STAGE 2: Runtime ===
FROM python:3.11-slim

# Create and switch to a non-root user
RUN useradd -m appuser && mkdir -p /app && chown -R appuser:appuser /app
USER appuser

WORKDIR /app

# Copy Python dependencies (adjust path if using --user)
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
# Copy built frontend assets
COPY --from=builder /app/teller_vite/dist ./teller_vite/dist
# Copy app code
COPY --from=builder /app/main.py ./main.py

EXPOSE 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]