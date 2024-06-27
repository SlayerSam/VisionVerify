import React from 'react'
import './App.css'
import NavbarComponent from './components/Navbar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Detection from './components/Detection';
import FaceRecognition from './components/FaceRecognition';


export default function App() {
  return (
    <div>
      <BrowserRouter>
        <NavbarComponent />
        <>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detect" element={<Detection />} />
            <Route path="/faceRecognition" element={<FaceRecognition />} />
          </Routes>
        </>
      </BrowserRouter>
    </div>
  )
}
