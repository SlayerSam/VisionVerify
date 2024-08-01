# Object Detection and Face Recognition System

This project implements a face recognition system using React for the frontend and Flask for the backend. It allows users to upload a dataset of labeled faces, which are then used to train a LBPH face recognizer. The trained model can then be used to recognize faces in real-time through the webcam.

## Features

- **Upload Dataset**: Upload images with labeled faces to create a dataset.
- **Train Model**: Train the LBPH face recognizer with the uploaded dataset.
- **Real-time Face Recognition**: Recognize faces in real-time using webcam feed.
- **Automatic Dataset Clearing**: Clears the dataset automatically every hour to prevent accumulation.

## Technologies Used

- **Frontend**: React
- **Backend**: Flask
- **Face Detection**: OpenCV (Haar Cascade Classifier)
- **Face Recognition**: OpenCV (LBPH Face Recognizer)
- **Deployment**: (Mention if deployed, e.g., Vercel for frontend, Heroku for backend)

## Installation

1. **Clone Repository**

   ```bash
   git clone https://github.com/OmkarAnbhule/Object-detection-react.git
   cd face-recognition-system
    
2. **Setup Project**
   ```bash
   cd ../server
   pip install -r requirements.txt

4. **Run Application**
   ```bash
   python app.py

## Note
  - client folder in the repository is just for reference it is not needed to run the project

## License
  This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements
**OpenCV** - for face detection and recognition libraries.
**React** - for building the frontend user interface.
**Flask** - for building the backend API.
## Author
 - Omkar Suresh Anbhule,Satyam Kushwaha
 - GitHub: https://github.com/OmkarAnbhule
 - Live Demo: https://visionverify.vercel.app/
