#!/bin/bash

# Install necessary system-level dependencies
apt-get update
apt-get install -y default-libmysqlclient-dev

# Create and activate a virtual environment (optional)
python -m venv venv
source venv/bin/activate

# Upgrade pip and setuptools
pip install --no-cache-dir --upgrade pip setuptools

# Install Python dependencies
pip install --no-cache-dir -r requirements.txt
