# STAGE 1: Frontend Build
FROM node:20-slim AS frontend-builder
WORKDIR /build
COPY teller_vite/package*.json ./
RUN npm ci
COPY teller_vite/ .
RUN npx vite build

# STAGE 2: Final Runtime
FROM python:3.11-slim
RUN useradd -m appuser
WORKDIR /app

# Install Backend Deps
COPY requirements-minimal.txt .
RUN pip install --no-cache-dir -r requirements-minimal.txt

# Copy Assets & Code
COPY --from=frontend-builder /build/dist ./teller_vite/dist
COPY . .
RUN chown -R appuser:appuser /app

USER appuser
EXPOSE 8080
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]