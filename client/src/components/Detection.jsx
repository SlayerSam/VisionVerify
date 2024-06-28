import React, { useRef, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

function App() {
    const videoRef = useRef(null);
    const animationFrameId = useRef(null);
    const [objectPredictions, setObjectPredictions] = useState([])
    const [streaming, setStreaming] = useState(false);
    const [mode, setMode] = useState('environment')

    const sendFrameToServer = useCallback(async (frame) => {
        try {
            const response = await axios({
                method: "POST",
                url: "https://detect.roboflow.com/coco/18",
                params: {
                    api_key: "L6vjAopLxCiMO5VQdnoe"
                },
                data: frame,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            })
            const annotatedImage = response.data;
            setObjectPredictions(response.data.predictions)
            return annotatedImage;
        } catch (error) {
            return null;
        }
    }, []);

    useEffect(() => {
        const processVideo = async () => {
            const video = videoRef.current;
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');

            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const frame = canvas.toDataURL('image/jpeg');

            await sendFrameToServer(frame);
            animationFrameId.current = requestAnimationFrame(processVideo);
        };
        if (streaming) {
            setInterval(requestAnimationFrame(processVideo), 1000 / 120);
        }
        return () => {
            cancelAnimationFrame(animationFrameId.current);
        };
    }, [streaming, sendFrameToServer]);

    const startCamera = async (newMode = mode) => {
        if (streaming) {
            stopCamera();
        }

        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: newMode } });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setStreaming(true);
    };

    const stopCamera = () => {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();

        tracks.forEach(track => {
            track.stop();
        });

        videoRef.current.srcObject = null;
        setStreaming(false);
    };

    const changeFacingMode = async (newMode) => {
        setMode(newMode);
        await startCamera(mode);
    };

    const renderBoundingBoxes = () => {
        return objectPredictions.map(prediction => {
            const video = videoRef.current;
            if (!video) return null;
            const videoRect = video.getBoundingClientRect();
            return (<div
                key={prediction.detection_id}
                className="absolute border-red-500 border-2"
                style={{
                    top: `${window.innerWidth <= 426 ? videoRect.height - recognizedPerson.y : recognizedPerson.y}px`,
                    left: `${window.innerWidth <= 426 ? videoRect.width - recognizedPerson.x : recognizedPerson.x}px`,
                    width: `${recognizedPerson.width}px`,
                    height: `${recognizedPerson.height}px`,
                }}
            >
                <span className="bg-red-500 text-white px-1">{prediction.class}</span>
            </div>
            )
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative p-4">
            <h1 className={`text-2xl text-black md:hidden font-bold capitalize flex items-center`}>scroll down
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3" />
                </svg>

            </h1>
            <div className="w-full h-screen bg-white rounded-lg shadow-lg flex items-center justify-center md:w-3/4 md:h-3/4">
                <video ref={videoRef} className="w-full h-[500px] object-contain" />
                {renderBoundingBoxes()}
            </div>
            <div className="mt-4 space-x-4 flex justify-center items-center flex-wrap">
                <button
                    onClick={startCamera}
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
                <button
                    onClick={() => changeFacingMode(mode == 'environment' ? 'user' : 'environment')}
                    className="px-4 py-2 bg-slate-300 text-black rounded hover:bg-slate-700 md:hidden hover:text-white focus:outline-none"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default App;
