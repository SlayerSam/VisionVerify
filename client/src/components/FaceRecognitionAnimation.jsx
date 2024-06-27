import React, { useEffect } from 'react';
import img from '../assets/face.png';
import human from '../assets/human.png';
import { motion, useAnimation } from 'framer-motion';

export default function FaceRecognitionAnimation() {

    const containerVariants = {
        hidden: {
            opacity: 1,
        },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 3,
                repeat: Infinity,
                repeatDelay: 2,
                repeatType: 'loop',
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, },
    };

    const spanPositions = [
        { top: '115px', left: '125px' },
        { top: '98px', left: '155px' },
        { top: '128px', left: '155px' },
        { top: '128px', left: '218px' },
        { top: '98px', left: '218px' },
        { top: '115px', left: '249px' },
        { top: '137px', left: '172px' },
        { top: '104px', left: '186px' },
        { top: '137px', left: '202px' },
        { top: '138px', left: '186.7px' },
        { top: '139px', left: '220px' },
        { top: '139px', left: '154px' },
        { top: '132px', left: '139px' },
        { top: '132px', left: '235px' },
        { top: '145px', left: '252px' },
        { top: '183px', left: '248px' },
        { top: '211px', left: '237px' },
        { top: '229px', left: '220px' },
        { top: '204px', left: '214px' },
        { top: '216px', left: '205px' },
        { top: '164px', left: '233.5px' },
        { top: '171px', left: '205px' },
        { top: '171px', left: '169px' },
        { top: '166px', left: '180px' },
        { top: '166px', left: '193px' },
        { top: '179.9px', left: '183px' },
        { top: '179.9px', left: '190px' },
        { top: '179.5px', left: '173px' },
        { top: '179.5px', left: '201px' },
        { top: '179.5px', left: '201px' },
        { top: '145px', left: '121.5px' },
        { top: '184px', left: '127px' },
        { top: '210px', left: '137px' },
        { top: '164px', left: '140px' },
        { top: '204px', left: '160px' },
        { top: '216px', left: '169px' },
        { top: '229px', left: '153px' },
        { top: '230px', left: '176px' },
        { top: '230px', left: '198px' },
        { top: '244px', left: '198px' },
        { top: '244px', left: '176px' },
        { top: '237px', left: '172px' },
        { top: '237px', left: '201px' },
        { top: '193px', left: '178px' },
        { top: '193px', left: '195px' },
        { top: '196px', left: '186.9px' },
    ];

    return (
        <div className='container flex flex-col w-96 h-96 relative'>
            <div>
                <motion.img src={human} className='w-96 h-72 object-contain absolute top-[25px] left-[7px]' alt='Face'
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 0, opacity: 1 }}
                    transition={{ duration: 1 }}
                />

                <motion.img src={img} className='w-96 h-72 object-contain absolute drop-shadow-[0px_35px_50px_rgba(0,16,255,1)]' alt='Face'
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 2, delay: 2 }}
                />
            </div>
            <motion.div
                className="container"
                initial="hidden"
                animate="visible"
                variants={containerVariants}
            >
                {spanPositions.map((position, index) => (
                    <motion.span
                        key={index}
                        className={`bg-white w-2 h-2 rounded-full span absolute --i:${index} dot-${index}`}
                        variants={itemVariants}
                        style={{ top: position.top, left: position.left }}
                    ></motion.span>
                ))}
            </motion.div>
        </div>
    );
}
