import React, { useRef, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

function App() {
    const videoRef = useRef(null);
    const animationFrameId = useRef(null);
    const [objectPredictions, setObjectPredictions] = useState([])
    const [streaming, setStreaming] = useState(false);

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

    const startCamera = async () => {
        if (!streaming) {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setStreaming(true);
        }
    };

    const stopCamera = () => {
        if (streaming) {
            let tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setStreaming(false);
            cancelAnimationFrame(animationFrameId.current);
        }
    };

    const renderBoundingBoxes = () => {
        return objectPredictions.map(prediction => (
            <div
                key={prediction.detection_id}
                className="absolute border-red-500 border-2"
                style={{
                    top: `${prediction.y}px`,
                    left: `${prediction.x}px`,
                    width: `${prediction.width}px`,
                    height: `${prediction.height}px`,
                }}
            >
                <span className="bg-red-500 text-white px-1">{prediction.class}</span>
            </div>
        ));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 rel">
            <div className="w-3/4 h-3/4 bg-white rounded-lg shadow-lg flex items-center justify-center">
                <video ref={videoRef} className="w-4/6 h-5/6" />
                {renderBoundingBoxes()}
            </div>
            <div className="mt-4 space-x-4">
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
            </div>
        </div>
    );
}

export default App;
