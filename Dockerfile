FROM pytorch/pytorch:2.8.0-cuda12.8-cudnn9-runtime

# Install heretic-llm from PyPI
RUN pip install --no-cache-dir heretic-llm

ENTRYPOINT ["heretic"]
