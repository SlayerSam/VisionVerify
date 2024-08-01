import numpy as np
from flask import Flask, request, jsonify, send_from_directory
import cv2
import base64
from flask_cors import CORS
import os
import threading
import time

app = Flask(__name__, static_folder="dist", static_url_path="")
CORS(app)

# Initialize variables to hold dataset and face recognition model
dataset_faces = []
dataset_labels = []
label_dict = {}
face_recognizer = None

# Load Haar Cascade Classifier for face detection
face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)


# Function to train LBPH Face Recognizer
def train_model(faces, labels):
    global face_recognizer
    face_recognizer = cv2.face.LBPHFaceRecognizer_create()
    face_recognizer.train(
        faces, np.array(labels, dtype=np.int32)
    )  # Ensure labels are int32
    return face_recognizer


# API route to upload dataset from React frontend via file upload
@app.route("/api/upload_dataset", methods=["POST"])
def upload_dataset():
    global dataset_faces, dataset_labels, label_dict, face_recognizer

    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"})

    label = request.form.get("label")
    if not label:
        return jsonify({"error": "No label provided"})

    dataset_faces = []
    dataset_labels = []
    label_dict = {}

    file_stream = file.stream
    file_bytes = np.asarray(bytearray(file_stream.read()), dtype=np.uint8)
    img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    dataset_faces.append(gray)
    dataset_labels.append(label)
    label_dict[label] = len(label_dict)  # Assign unique ID for each label

    # Convert labels to integer IDs
    dataset_labels_int = [label_dict[label] for label in dataset_labels]

    # Train the model with the updated dataset
    if len(dataset_faces) > 0 and len(dataset_labels_int) > 0:
        train_model(dataset_faces, dataset_labels_int)

    return jsonify({"message": "Dataset uploaded successfully"})


# API route to perform face recognition
@app.route("/api/recognize_faces", methods=["POST"])
def recognize_faces():
    global face_recognizer, label_dict

    data = request.get_json()
    if "imageData" not in data:
        return jsonify({"error": "No image data provided"})

    base64_image = data["imageData"].split(",")[
        1
    ]  # Skip the 'data:image/jpeg;base64,' part
    image_bytes = base64.b64decode(base64_image)
    np_arr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    # Perform face detection
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
    )

    for x, y, w, h in faces:
        roi_gray = gray[y : y + h, x : x + w]

        if face_recognizer:
            label, confidence = face_recognizer.predict(roi_gray)

            if label in label_dict.values():
                person = next(
                    key for key, value in label_dict.items() if value == label
                )
                return jsonify(
                    {
                        "person": person,
                        "confidence": float(
                            confidence
                        ),  # Ensure confidence is float for JSON
                        "x": int(x),
                        "y": int(y),
                        "width": int(w),
                        "height": int(h),
                    }
                )

    return jsonify(
        {
            "person": "Unknown",
            "confidence": 0.0,
            "x": 0,
            "y": 0,
            "width": 0,
            "height": 0,
        }
    )


# Serve React App
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react_app(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")


def clear_dataset_periodically():
    global dataset_faces, dataset_labels, label_dict, face_recognizer

    while True:
        time.sleep(3600) 
        dataset_faces = []
        dataset_labels = []
        label_dict = {}
        face_recognizer = None
        print("Dataset cleared.")

threading.Thread(target=clear_dataset_periodically, daemon=True).start()

if __name__ == "__main__":
    app.run(debug=True)
