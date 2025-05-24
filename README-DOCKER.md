# Teller - Docker Deployment

This guide explains how to deploy the Teller application using Docker.

## Prerequisites

- Docker installed on your system
- Docker Compose (usually comes with Docker Desktop)

## Building and Running with Docker compose

The easiest way to run the application is using Docker Compose:

1. Clone the repository (if you haven't already):
   ```bash
   git clone https://github.com/grannygoestoheaven/teller.git
   cd teller
   ```

2. Create a `.env` file in the project root with your environment variables:
   ```bash
   cp .env.example .env
   # Edit the .env file with your configuration
   ```

3. Build and start the container:
   ```bash
   docker-compose up --build
   ```

4. The application will be available at: http://localhost:5000

## Building and Running with Docker Directly

If you prefer to use Docker directly:

1. Build the Docker image:
   ```bash
   docker build -t teller .
   ```

2. Run the container:
   ```bash
   docker run -p 5000:5000 --env-file .env teller
   ```

## Environment Variables

Make sure to set the following environment variables in your `.env` file:

```
FLASK_APP=flask_ui_app.py
FLASK_ENV=production
# Add other required environment variables here
```

## Volumes

The application uses Docker volumes to persist data between container restarts. In the `docker-compose.yml` file, the current directory is mounted to `/app` in the container, which allows for live code changes during development.

## Stopping the Application

To stop the application, press `Ctrl+C` in the terminal where it's running, or run:

```bash
docker-compose down
```

## Troubleshooting

- If you encounter port conflicts, change the port mapping in `docker-compose.yml`
- Check container logs with: `docker-compose logs -f`
- To rebuild the container: `docker-compose up --build --force-recreate`

## Production Deployment

For production deployment, consider:
1. Using a production-ready WSGI server like Gunicorn
2. Setting up Nginx as a reverse proxy
3. Using environment variables for sensitive data instead of .env files
4. Setting up proper logging and monitoring
5. Using a container orchestration platform like Kubernetes for scaling
