import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Snackbar from 'awesome-snackbar'

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
            formData.append('label', label);

            try {
                await axios.post('/api/upload_dataset', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((res) => {
                    if (res.status == 200) {
                        new Snackbar(`Dataset uploaded successfully!`, {
                            position: 'bottom-center',
                            style: {
                                container: [
                                    ['background', 'rgb(130, 249, 103)'],
                                    ['border-radius', '5px'],
                                    ['height', '50px'],
                                    ['padding', '10px'],
                                    ['border-radius', '20px'],
                                    ['display', 'flex'],
                                    ['justify-content', 'center'],
                                ],
                                message: [
                                    ['color', 'darkgreen'],
                                    ['font-size', '18px'],
                                    ['font-weight', 'bold'],
                                ],
                                actionButton: [
                                    ['color', 'white'],
                                ],
                            }
                        });
                    }
                })
            } catch (error) {
            }
        }
        else {
            new Snackbar(`Empty Fields
                `, {
                position: 'bottom-center',
                style: {
                    container: [
                        ['background', 'rgb(246, 58, 93)'],
                        ['border-radius', '5px'],
                        ['height', '50px'],
                        ['padding', '10px'],
                        ['border-radius', '20px'],
                        ['display', 'flex'],
                        ['justify-content', 'center'],
                    ],
                    message: [
                        ['color', '#eee'],
                        ['font-size', '18px'],
                        ['font-weight', 'bold']
                    ],
                    actionButton: [
                        ['color', 'white'],
                    ],
                }
            });
        }
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
                    const response = await axios.post('/api/recognize_faces', {
                        imageData
                    });
                    setRecognizedPerson(response.data);
                    if (response) {
                        timeout = setTimeout(captureFrameAndRecognize, 10000 / 10)
                    }
                }
                else {
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
                        top: `${window.innerWidth <= 426 ? videoRect.height / recognizedPerson.y : recognizedPerson.y}px`,
                        left: `${window.innerWidth <= 426 ? videoRect.width / recognizedPerson.x : recognizedPerson.x}px`,
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-full p-4">
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
            <div className="w-full h-full bg-white rounded-lg shadow-lg flex items-center justify-center md:w-3/4 md:h-3/4">
                <div className='relative'>
                    <video ref={videoRef} className="w-full h-full object-contain" />
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
