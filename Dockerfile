FROM pytorch/pytorch:2.8.0-cuda12.8-cudnn9-runtime

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

# Copy dependency files first for layer caching
COPY pyproject.toml uv.lock ./

# Install project dependencies (no research or dev extras)
RUN uv sync --no-dev --no-install-project

# Copy source code and install the project
COPY src/ src/
RUN uv sync --no-dev

ENTRYPOINT ["uv", "run", "heretic"]
