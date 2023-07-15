#!/bin/bash

# Install necessary system-level dependencies
apt-get update
apt-get install -y default-libmysqlclient-dev

# Upgrade pip and setuptools
pip install --no-cache-dir --upgrade pip setuptools

# Install Python dependencies
pip install --no-cache-dir -r requirements.txt

# Install mysqlclient
apt-get install -y libmariadb-dev

# Set environment variables
export MYSQL_UNIX_PORT="/tmp/mysql.sock"

# Run database migrations (if applicable)
python manage.py migrate
