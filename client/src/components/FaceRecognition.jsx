import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

export default function FaceRecognition() {
    const [recognizedPerson, setRecognizedPerson] = useState('')
    const videoRef = useRef(null);
    const [label, setLabel] = useState('')
    const [file, setFile] = useState('')
    const [streaming, setStreaming] = useState(false);
    const [controller, setController] = useState(null)
    const animationFrameId = useRef(null)
    let timeout = null

    // Function to start capturing frames from webcam
    const startCapture = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
                videoRef.current.play();
                setStreaming(true);
            })
            .catch(err => console.error('Error accessing webcam:', err));
    };

    // Function to capture frame and send to Flask API to upload dataset
    const upload = async () => {
        if (label && file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('labels', label); // Assuming labels are set elsewhere

            try {
                await axios.post('http://127.0.0.1:5000/api/upload_dataset', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
            } catch (error) {
            }
        };
    }

    useEffect(() => {
        if (streaming) {
            captureFrameAndRecognize()
        }

        return () => {
            clearTimeout(timeout)
        }
    }, [streaming])

    // Function to capture frame and send to Flask API for face recognition
    const captureFrameAndRecognize = async () => {
        if (streaming) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL('image/jpeg');
            try {
                if (imageData.split('data:')[1] != ',') {
                    const response = await axios.post('http://127.0.0.1:5000/api/recognize_faces', {
                        imageData
                    });
                    setRecognizedPerson(response.data);
                    if (response) {
                        timeout = setTimeout(captureFrameAndRecognize, 10000 / 10)
                    }
                }
                else{
                    timeout = setTimeout(captureFrameAndRecognize, 10000 / 10)
                }
            } catch (error) {
            }
        }
    };

    const stopCamera = () => {
        if (streaming) {
            let tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setStreaming(false);
            cancelAnimationFrame(animationFrameId.current);
            clearTimeout(timeout)
            if (controller) {
                controller.abort(); // Abort all ongoing Axios requests
                setController(null);
            }
        }
    };

    const renderBoundingBoxes = () => {
        if (recognizedPerson && recognizedPerson.person && recognizedPerson.person !== 'Unknown') {
            const video = videoRef.current;
            if (!video) return null;

            const videoRect = video.getBoundingClientRect();
            return (
                <div

                    className="absolute border-red-500 border-2"
                    style={{
                        top: `${window.innerWidth <= 426 ? videoRect.height - recognizedPerson.y : recognizedPerson.y}px`,
                        left: `${window.innerWidth <= 426 ? videoRect.width - recognizedPerson.x : recognizedPerson.x}px`,
                        width: `${recognizedPerson.width}px`,
                        height: `${recognizedPerson.height}px`,
                    }}
                >
                    <span className="bg-red-500 text-white px-1">{recognizedPerson.person}</span>
                </div>
            );
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-full">
            <div className='flex justify-center items-center w-full flex-col mb-4'>
                <div className='flex flex-row w-full justify-center items-center flex-wrap'>
                    <input type='text' onChange={(e) => setLabel(e.target.value)} value={label} className='input w-96 p-2 m-4 border-2 bg-white text-black' placeholder='Enter your name(for label)' ></input>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} className='input w-96 p-2 m-4 border-2 bg-white text-black'  ></input>
                </div>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
                    onClick={upload}
                >
                    Upload Data
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-lg flex items-center justify-center overflow-hiddenv w-3/4 min-h-96">
                <div className='relative bg-black'>
                    <video ref={videoRef} className="relative" />
                    {renderBoundingBoxes()}
                </div>
            </div>
            <div className="mt-4 space-x-4">
                <button
                    onClick={startCapture}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 focus:outline-none"
                >
                    Start
                </button>
                <button
                    onClick={stopCamera}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 focus:outline-none"
                >
                    Stop
                </button>
            </div>
        </div>
    );
}
