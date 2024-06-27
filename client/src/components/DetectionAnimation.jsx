import React, { useEffect, useState } from 'react'
import Apple from '../assets/apple.png'
import Banana from '../assets/banana.png'
import Car from '../assets/car.png'
import Clock from '../assets/clock.png'
import { motion, useAnimation } from 'framer-motion'

export default function DetectionAnimation() {
    const [isAnimating, setIsAnimating] = useState(true);
    const arr = [Apple, Banana, Car, Clock]
    const arr2 = ['Apple', 'Banana', 'Car', 'Clock']
    const [img, setImg] = useState(arr[0])
    const [text, setText] = useState(arr2[0])
    const [index, setIndex] = useState(0)
    const controls = useAnimation();
    const controls_2 = useAnimation()
    const controls_3 = useAnimation()

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.1,
                staggerChildren: 0.1,
            },
        },
    };

    const childVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    useEffect(() => {
        const sequence = async () => {
            while (true) {
                await controls.start({ opacity: 1, x: 0, transition: { duration: 1, delay: 1 } });
                await controls_2.start({ opacity: 1, y: 110, transition: { duration: 1, delay: 1 } });
                await controls_2.start({ opacity: 0, y: -100, transition: { duration: 1, delay: 1 } });
                await new Promise(resolve => setTimeout(resolve, 3000));
                await controls.start({ opacity: 0, x: -100, transition: { duration: 1 } });
                await new Promise(resolve => setTimeout(resolve, 1000));
                const newIndex = (index + 1) % arr.length;
                setIndex(newIndex);
                setImg(arr[newIndex]);
                setText(arr2[newIndex]);
                controls.set({ opacity: 0, x: 110 });
                controls_2.set({ opacity: 0, y: -100 });
            }
        };
        sequence();

        return () => {
            controls.stop()
            controls_2.stop()
        }
    }, [controls, controls_2, index]);

    useEffect(() => {
        const sequence = async () => {
            while (isAnimating) {
                await new Promise(resolve => setTimeout(resolve, 5000))
                await controls_3.start('visible');
                await new Promise(resolve => setTimeout(resolve, text.length * 100 + 1000));
                await controls_3.start('hidden');
                await new Promise(resolve => setTimeout(resolve, 4000));
            }
        }
        sequence()

        return () => setIsAnimating(false)
    }, [controls_3, isAnimating, text])

    return (
        <div className='container flex w-96 h-96 relative'>
            <motion.div className='absolute w-max h-max top-14 left-0 z-0'
                initial={{ opacity: 0, x: 100 }}
                animate={controls}
                transition={{ duration: 1, delay: 1 }}
            >
                <img src={img} className='w-96 h-72 object-contain' alt={text}></img>
            </motion.div>
            <div className='absolute w-full h-full top-0 left-0 flex justify-center items-center'>
                <div className='flex justify-center items-center relative border-8 border-sky-200 bg-[rgba(255,255,255,0.13)] w-3/4 h-3/4 rounded-2xl wave-shadow z-0'>
                    <motion.p className=' w-full bg-[#ff00ff] h-3 absolute shadow-[0_0_10px_#ff00ff,0_0_15px_#ff00ff,0_0_30px_#ff00ff] z-10'
                        initial={{ opacity: 0, y: -100 }}
                        animate={controls_2}
                        transition={{ duration: 1, delay: 2 }}
                    ></motion.p>
                </div>
            </div>
            <motion.div
                className='flex w-full h-full justify-center items-end text-4xl mt-6 z-50 font-bold font-mono'
                variants={containerVariants}
                initial="hidden"
                animate={controls_3}
            >
                {text.split('').map((item, idx) => (
                    <motion.span key={idx} variants={childVariants}>
                        {item}
                    </motion.span>
                ))}
            </motion.div>
        </div>
    )
}
