"use client";

import React, { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';
import { motion, useAnimation } from 'framer-motion';

const Hero = () => {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const controls = useAnimation();
  const splineControls = useAnimation();
  const subtextWords = "Garuda is an AI-powered natural disaster assistant that helps communities respond to natural disasters in real-time and stay connected.".split(" ");

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.06, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  useEffect(() => {
    if (splineLoaded) {
      const sequence = async () => {
        // Wait for 1 second after Spline loads
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Animate the main heading
        await controls.start({ opacity: 1, y: 0, transition: { duration: 0.8 } });
        
        // Start animating the subtext
        controls.start("visible");
        
        // Wait a short moment before starting to fade in the Spline scene
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Fade in the Spline scene
        splineControls.start({ opacity: 1, transition: { duration: 1.5 } });
      };
      sequence();
    }
  }, [splineLoaded, controls, splineControls]);

  const handleSplineLoad = () => {
    setSplineLoaded(true);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full min-h-screen bg-gradient-to-br from-gray-950 from-35% via-eagle via-55% to-gray-950 to-75% w-full overflow-hidden relative">
      <div className="absolute pointer-events-none inset-0 flex items-center justify-center bg-gray-950 [mask-image:radial-gradient(ellipse_at_center,transparent_0%,black)]"></div>
      {splineLoaded && (
        <>
          <motion.h1 
            className="z-20 text-center text-4xl md:text-6xl font-bold text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={controls}
          >
            AI-Powered Disaster Response and <br /> Real-Time{' '}
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500'>
              Sustainability Analysis
            </span>
          </motion.h1>
          <motion.p 
            className="z-20 text-center text-base md:text-base font-normal text-neutral-400 max-w-xl mt-5 mx-auto"
            variants={container}
            initial="hidden"
            animate={controls}
          >
            {subtextWords.map((word, index) => (
              <motion.span
                key={index}
                className="inline-block mr-1"
                variants={child}
              >
                {word}
              </motion.span>
            ))}
          </motion.p>
        </>
      )}
      
      <motion.div 
        className='-mt-32'
        initial={{ opacity: 0 }}
        animate={splineControls}
      >
        <Spline
          scene="https://prod.spline.design/cOLfblZJhkceLQIm/scene.splinecode"
          onLoad={handleSplineLoad}
        />
      </motion.div>
    </div>
  )
}

export default Hero