import React from 'react'
import DetectionAnimation from './DetectionAnimation'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import FaceRecognitionAnimation from './FaceRecognitionAnimation'

export default function Home() {
    const navigate = useNavigate()
    return (
        <div className=' w-full h-max items-center justify-center flex flex-col md:flex-row'>
            <div className='w-full h-full min-h-dvh px-4 py-8 bg-slate-700 flex justify-center items-center'>
                <div className='flex flex-col w-full h-max justify-center items-center text-white'>
                    <motion.div
                        className="mb-12"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h1 className="text-4xl font-bold mb-4">Welcome to Object Detection</h1>
                        <p className="text-lg">Utilize the power of AI to detect objects in real time.</p>
                    </motion.div>
                    <DetectionAnimation />
                    <motion.div
                        className="mt-14 flex justify-center items-center w-full h-max"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 2 }}
                    >
                        <button className="bg-blue-500 text-white py-2 px-6 rounded-lg text-lg shadow-lg hover:bg-blue-600 transition-colors"
                            onClick={() => navigate('/detect')}
                        >
                            Get Started
                        </button>
                    </motion.div>
                </div>
            </div>
            <div className='w-full h-full min-h-dvh px-4 py-8 bg-slate-900 flex justify-center items-center'>
                <div className='flex flex-col w-full h-max justify-center items-center text-white'>
                    <motion.div
                        className="mb-12"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                    >
                        <h1 className="text-4xl font-bold mb-4">Welcome to Face Recognition</h1>
                        <p className="text-lg">Unlock the potential of AI to recognize faces with unparalleled precision and efficiency.</p>
                    </motion.div>
                    <FaceRecognitionAnimation />
                    <motion.div
                        className="mt-14 flex justify-center items-center w-full h-max"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 2 }}
                    >
                        <button className=" bg-teal-500 text-white py-2 px-6 rounded-lg text-lg shadow-lg hover:bg-teal-800 transition-colors"
                            onClick={() => navigate('/faceRecognition')}
                        >
                            Get Started
                        </button>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
