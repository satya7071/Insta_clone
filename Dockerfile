# Use the official Python image as the base image
FROM python:3.9

# Set environment variables for Python and pip
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Install the necessary dependencies
RUN apt-get update \
    && apt-get install -y default-libmysqlclient-dev \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the container
WORKDIR /app

# Copy the requirements.txt file
COPY requirements.txt .

# Install the Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Set the command to run the Django development server
CMD [ "python", "manage.py", "runserver", "0.0.0.0:7202" ]
