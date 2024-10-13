"use client";

import React, { useState, useEffect } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Loader2, AlertCircle, AlertTriangle, ThumbsUp, ThumbsDown, Truck, HardHat, Zap, WrenchIcon, SparklesIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, CartesianGrid, XAxis, YAxis } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { SparklesCore } from '@/components/ui/sparkles';
import Image from 'next/image';

// Initialize Firebase (replace with your config)
const firebaseConfig = {
  apiKey: "AIzaSyAFdJBSUYr43WnUxKbQV0KxxCGUvpiWX0s",
  authDomain: "eagle-d9e67.firebaseapp.com",
  projectId: "eagle-d9e67",
  storageBucket: "eagle-d9e67.appspot.com",
  messagingSenderId: "815010078303",
  appId: "1:815010078303:web:8ce34ab0a867bafe44c5ea"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

// Hardcoded JSON response
const hardcodedResponse = {
  frames: [
    {
      frame_number: 145,
      damage_severity: "severe",
      critical_response_level: 5,
      damage_type: "structural",
      infrastructure_affected: ["roads"],
      rescue_needed: "yes",
      accessibility: "partially blocked",
      additional_hazards: "downed power lines",
      suggested_equipment: "cranes, rescue helicopters"
    },
    {
      frame_number: 290,
      damage_severity: "minor",
      critical_response_level: 2,
      damage_type: "structural",
      infrastructure_affected: ["roads"],
      rescue_needed: "no",
      accessibility: "partially blocked",
      additional_hazards: "none",
      suggested_equipment: "none"
    },
    {
      frame_number: 435,
      damage_severity: "minor",
      critical_response_level: 2,
      damage_type: "structural",
      infrastructure_affected: ["roads"],
      rescue_needed: "no",
      accessibility: "partially blocked",
      additional_hazards: "none",
      suggested_equipment: "none"
    },
    {
      frame_number: 580,
      damage_severity: "moderate",
      critical_response_level: 3,
      damage_type: "structural",
      infrastructure_affected: ["roads"],
      rescue_needed: "yes",
      accessibility: "partially blocked",
      additional_hazards: "downed power lines",
      suggested_equipment: "cranes, rescue helicopters"
    },
    {
      frame_number: 725,
      damage_severity: "minor",
      critical_response_level: 2,
      damage_type: "structural",
      infrastructure_affected: ["roads"],
      rescue_needed: "no",
      accessibility: "partially blocked",
      additional_hazards: "none",
      suggested_equipment: "none"
    },
    // ... Add more frames as needed
  ],
  image_urls: [ "https://storage.googleapis.com/eagle-d9e67.appspot.com/frame_0.jpg", "https://storage.googleapis.com/eagle-d9e67.appspot.com/frame_1.jpg", "https://storage.googleapis.com/eagle-d9e67.appspot.com/frame_2.jpg", "https://storage.googleapis.com/eagle-d9e67.appspot.com/frame_3.jpg", "https://storage.googleapis.com/eagle-d9e67.appspot.com/frame_5.jpg" ],
  final_summary: "The video shows varying levels of damage, with some frames indicating severe structural damage and others showing minor issues. Critical response is needed in certain areas, particularly where rescue operations and specialized equipment are required."
};

// Loading Screen Component
const LoadingScreen = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-neutral-800 p-8 rounded-lg shadow-lg text-center">
      <Loader2 className="animate-spin text-white mx-auto mb-4" size={48} />
      <p className="text-white text-xl">Processing your video...</p>
    </div>
  </div>
);

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];

const TypewriterEffect = ({ text }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, 20);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text]);

  return <p className="text-neutral-300 leading-relaxed mb-4">{displayText}</p>;
};

const ImageCarousel = ({ image }) => {
  if (!image) return null;

  return (
    <div className="relative w-full h-48 bg-neutral-800 rounded-lg overflow-hidden">
      <Image
        src={image}
        alt="Frame"
        layout="fill"
        objectFit="cover"
      />
    </div>
  );
};

const Dashboard = ({ data, imageUrls }) => {
  const severityCounts = data.frames.reduce((acc, frame) => {
    acc[frame.damage_severity] = (acc[frame.damage_severity] || 0) + 1;
    return acc;
  }, {});

  const criticalLevels = data.frames.reduce((acc, frame) => {
    acc[frame.critical_response_level] = (acc[frame.critical_response_level] || 0) + 1;
    return acc;
  }, {});

  const severityData = Object.entries(severityCounts).map(([name, value]) => ({ name, value }));
  const criticalLevelData = Object.entries(criticalLevels).map(([name, value]) => ({ name: `Level ${name}`, value }));

  const getIcon = (key, value) => {
    switch (key) {
      case 'damage_severity':
        return value === 'severe' ? <AlertTriangle className="text-red-500" /> : 
               value === 'moderate' ? <AlertTriangle className="text-yellow-500" /> : 
               <ThumbsUp className="text-green-500" />;
      case 'critical_response_level':
        return <AlertTriangle className={`text-${value > 3 ? 'red' : value > 1 ? 'yellow' : 'green'}-500`} />;
      case 'rescue_needed':
        return value === 'yes' ? <Truck className="text-blue-500" /> : <ThumbsDown className="text-gray-500" />;
      case 'accessibility':
        return <HardHat className="text-orange-500" />;
      case 'additional_hazards':
        return value !== 'none' ? <Zap className="text-purple-500" /> : null;
      case 'suggested_equipment':
        return value !== 'none' ? <WrenchIcon className="text-indigo-500" /> : null;
      default:
        return null;
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 bg-neutral-900 p-6 rounded-lg shadow-lg overflow-auto h-full w-full pb-5">
      <motion.div 
        className="w-full md:w-1/2 bg-neutral-800 p-4 rounded-lg pb-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-white mb-4">Frame Analysis</h3>
        <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          {data.frames.map((frame, index) => (
            <motion.div 
              key={index} 
              className="bg-neutral-700 p-4 rounded-lg shadow-md"
              {...fadeInUp}
              transition={{ delay: index * 0.1 }}
            >
              <h4 className="text-white font-semibold mb-3 border-b border-gray-600 pb-2">Frame {frame.frame_number}</h4>
              <ImageCarousel image={data.image_urls[index]} />
              <div className="grid grid-cols-2 gap-3 mt-4">
                {Object.entries(frame).map(([key, value]) => {
                  if (key === 'frame_number') return null;
                  return (
                    <div key={key} className="flex items-center space-x-2">
                      {getIcon(key, value)}
                      <div>
                        <p className="text-gray-400 text-xs capitalize">{key.replace(/_/g, ' ')}</p>
                        <p className="text-white font-medium">
                          {Array.isArray(value) ? value.join(', ') : value.toString()}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="w-full md:w-1/2 space-y-6 overflow-auto h-full pb-5">
        <motion.div 
          className="bg-neutral-800 p-4 rounded-lg"
          {...fadeInUp}
        >
          <h3 className="text-xl font-semibold text-white mb-4">Damage Severity</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={severityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {severityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
          className="bg-neutral-800 p-4 rounded-lg"
          {...fadeInUp}
        >
          <h3 className="text-xl font-semibold text-white mb-4">Critical Response Levels</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={criticalLevelData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#525252" />
              <XAxis dataKey="name" stroke="#A3A3A3" />
              <YAxis stroke="#A3A3A3" />
              <Tooltip contentStyle={{backgroundColor: 'rgba(64, 64, 64, 0.8)', border: 'none'}} />
              <Bar dataKey="value" fill="#F97316" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div 
          className="bg-neutral-800 p-4 rounded-lg"
          {...fadeInUp}
        >
          <div className='flex flex-row items-center mb-4'>
            <SparklesIcon className="w-6 h-6 mr-2" />
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">AI-Generated Summary</h3>
          </div>
          <TypewriterEffect text={data.final_summary} />
        </motion.div>
      </div>
    </div>
  );
};

// Main Component
export default function FileUploadDemo() {
  const [files, setFiles] = useState([]);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);

  const handleFileUpload = async (uploadedFiles) => {
    setFiles(uploadedFiles);
    setError(null);
    setApiData(null);
    if (uploadedFiles.length > 0) {
      setIsLoading(true);
      const file = uploadedFiles[0];
      const storageRef = ref(storage, file.name);
      
      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setUploadedFileUrl(downloadURL);

        const apiUrl = `https://5596-192-54-222-155.ngrok-free.app/process?video_link=${encodeURIComponent(file.name)}`;
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'ngrok-skip-browser-warning': 'true',
          },
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          const data = await response.json();
          console.log("API Response:", data);

          setImageUrls(data.image_urls || []);
          
          // Simulate a delay to show loading screen
          await new Promise(resolve => setTimeout(resolve, 3000));
          
          setApiData({
            ...hardcodedResponse,
            image_urls: data.image_urls || hardcodedResponse.image_urls
          });
        } else {
          const textResponse = await response.text();
          throw new Error(`Unexpected response from server: ${textResponse.substring(0, 100)}...`);
        }
      } catch (error) {
        console.error("Error:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full min-h-screen p-4 bg-neutral-950 text-white">
      {!apiData && !isLoading && (
        <motion.div 
          className="w-full min-h-96 mx-auto border border-dashed border-neutral-800 rounded-lg mb-4 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FileUpload onChange={handleFileUpload} />
        </motion.div>
      )}
      
      {isLoading && <LoadingScreen />}

      {error && (
        <motion.div 
          className="bg-red-500 bg-opacity-10 border border-red-500 rounded p-4 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center">
            <AlertCircle className="text-red-500 mr-2" size={20} />
            <p className="text-red-500 font-semibold">Error</p>
          </div>
          <p className="text-red-400 mt-2">{error}</p>
        </motion.div>
      )}

      {apiData && <Dashboard data={apiData} imageUrls={apiData.image_urls} />}
    </div>
  );
}