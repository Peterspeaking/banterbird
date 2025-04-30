
FROM python:3.12

WORKDIR /app

COPY . /app

RUN pip install time flask flask_cors json

EXPOSE 5000

ENV FLASK_APP=app.py

# Run the Flask app
CMD ["python", "app.py"]