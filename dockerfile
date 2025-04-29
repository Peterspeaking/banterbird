# Use an official Python runtime as a parent image
FROM python:3.12

# Set the working directory in the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install dependencies
RUN pip install time flask flask_cors json

# Make port 5000 available
EXPOSE 5000

# Define an environment variable, this telling docker here this is the main starting point of the application.
ENV FLASK_APP=app.py

# Run the Flask app
CMD ["python", "app.py"]