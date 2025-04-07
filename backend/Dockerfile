# Build stage
FROM python:3.11-slim AS builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create and activate virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install base dependencies first
RUN pip install --no-cache-dir --upgrade pip wheel setuptools

# Install all dependencies from requirements.txt
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Final stage
FROM python:3.11-slim

WORKDIR /app

# Install runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 libglib2.0-0 libsm6 libxrender1 libxext6 \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Create app directories
RUN mkdir -p /app/app/models /app/app/static/gradcam

# Copy application code
COPY --chown=appuser:appuser ./app /app/app

# Create startup script
RUN echo '#!/bin/bash' > /app/start.sh && \
    echo 'set -e' >> /app/start.sh && \
    echo 'exec python -m app.main' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose port
EXPOSE 10000

# Start command
CMD ["/bin/bash", "/app/start.sh"]