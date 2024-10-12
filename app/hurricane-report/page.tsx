'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { WiHurricane, WiStrongWind, WiBarometer, WiRaindrops, WiFlood, WiHumidity } from "react-icons/wi";
import { FaCalendar, FaExclamationTriangle, FaDollarSign, FaTemperatureHigh, FaWind } from "react-icons/fa";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SparkleIcon, SparklesIcon } from 'lucide-react';
import { SparklesCore } from '@/components/ui/sparkles';
import { motion } from 'framer-motion';

const TypewriterEffect = ({ text }: { text: string }) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, 20); // Adjust typing speed here

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text]);

  return <p className="text-neutral-300 leading-relaxed mb-4">{displayText}</p>;
};

export default function HurricaneReportPage() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [data, setData] = useState(null);
  const searchParams = useSearchParams();

  const name = searchParams.get('name');
  const year = searchParams.get('year');
  const category = searchParams.get('category');
  const damage = searchParams.get('damage');

  useEffect(() => {
    const fetchData = async () => {
      // Simulating data fetch and AI report generation
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Simulated hurricane-specific data
      setData({
        windSpeed: Math.floor(Math.random() * 100) + 100,
        pressure: Math.floor(Math.random() * 50) + 900,
        rainfall: Math.floor(Math.random() * 20) + 10,
        affectedArea: Math.floor(Math.random() * 1000) + 500,
        temperature: Math.floor(Math.random() * 15) + 70,
        humidity: Math.floor(Math.random() * 30) + 70,
        windGusts: Math.floor(Math.random() * 50) + 120,
        pressureHistory: Array.from({length: 24}, () => ({
          time: new Date().toLocaleTimeString(),
          pressure: Math.floor(Math.random() * 50) + 900
        })),
        aiDamageReport: generateAIDamageReport(name, category, damage),
        movementDirection: Math.floor(Math.random() * 360),
        expectedLandfall: Math.floor(Math.random() * 24),
        hurricaneSize: Math.floor(Math.random() * 100) + 100,
        movementSpeed: Math.floor(Math.random() * 100) + 100,
        hurricaneFootprint: Math.floor(Math.random() * 100) + 100,
        energySpent: Math.floor(Math.random() * 100) + 3000,
        ecoResourceRatio: (0.1 + (Math.random() * 0.3)).toFixed(2),
      });
      setLoading(false);
    };

    fetchData();
  }, [name, category, damage]);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const generateAIDamageReport = (name, category, damage) => {
    return `Hurricane ${name}, a Category ${category} storm, caused an estimated $${damage} billion in damages. 
    The hurricane's intense winds and storm surge led to widespread destruction of coastal infrastructure, including 
    homes, businesses, and critical facilities. Inland flooding resulted in significant agricultural losses and 
    disruption to transportation networks. The recovery process is expected to take several years, with long-term 
    economic impacts on affected communities. Emergency response teams are currently focused on search and rescue 
    operations, restoration of power, and providing temporary housing for displaced residents.`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-950">
        <div className="text-center flex flex-col items-center justify-center">
          <WiHurricane className="w-32 h-32 text-red-500 animate-spin" />
          <p className="text-white mt-4 text-xl font-light">Analyzing Hurricane {name}...</p>
        </div>
        <div className="w-64 h-2 bg-neutral-700 rounded-full mt-8 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-white mt-2 font-light">{progress}% complete</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-neutral-900 text-neutral-200">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          className="flex justify-between items-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-white">Hurricane {name} ({year})</h1>
          <Link href="/dashboard" passHref>
            <Button className="bg-red-500 text-white hover:bg-red-600 transition-colors">Back to Dashboard</Button>
          </Link>
        </motion.div>

        <motion.div 
          className='rounded-lg relative overflow-hidden min-h-64 w-full mb-10 mx-auto bg-gradient-to-br from-gray-950 from-35% via-eagle via-55% to-gray-950 to-75%'
          {...fadeInUp}
        >
            <div className="w-full absolute inset-0 h-screen">
                <SparklesCore
                id="tsparticlesfullpage"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={100}
                className="w-full h-full"
                particleColor="#CCCCCC"
                />
            </div>
            <h2 className='z-20 ml-4 mt-4 text-2xl font-bold'>Garuda Report</h2>
            <p className='z-20 ml-4 mt-1 text-sm text-neutral-400'>AI-Powered Analytics for Hurricanes Anywhere, Anytime</p>
            <div className='grid grid-cols-4 gap-8 w-[95%] mx-auto mb-10'>
                <div className="p-5 bg-neutral-800/25 w-full mt-8 z-20 rounded-lg backdrop-blur-lg border border-white/10 shadow-xl">
                    <h3 className="text-lg font-semibold text-orange-400 mb-2">Intensity</h3>
                    <p className="text-3xl font-bold text-white mb-2">{category}</p>
                    <p className="text-sm text-neutral-300">Sustained winds: {data.windSpeed} mph</p>
                    <p className="text-sm text-neutral-300">Central pressure: {data.pressure} mbar</p>
                </div>
                <div className="p-5 bg-neutral-800/25 w-full mt-8 z-20 rounded-lg backdrop-blur-lg border border-white/10 shadow-xl">
                    <h3 className="text-lg font-semibold text-white mb-2">Carbon Footprint</h3>
                    <p className="text-3xl font-bold text-white mb-2">{data.hurricaneFootprint} tons CO2e</p>
                    <p className="text-sm text-neutral-300">Rebuilding efforts required tons of unecessary CO2 emissions</p>
                </div>
                <div className="p-5 bg-neutral-800/25 w-full mt-8 z-20 rounded-lg backdrop-blur-lg border border-white/10 shadow-xl">
                    <h3 className="text-lg font-semibold text-white mb-2">Energy Spent</h3>
                    <p className="text-3xl font-bold text-white mb-2">{data.energySpent} MWh</p>
                    <p className="text-sm text-neutral-300">Eco-friendly Resource Ratio: {data.ecoResourceRatio}</p>
                </div>
                <div className="p-5 bg-neutral-800/25 w-full mt-8 z-20 rounded-lg backdrop-blur-lg border border-white/10 shadow-xl">
                    <h3 className="text-lg font-semibold text-orange-400 mb-2">Potential Impact</h3>
                    <p className="text-3xl font-bold text-white mb-2">${damage} billion</p>
                    <p className="text-sm text-neutral-300">Storm surge: Up to {data.stormSurge} feet</p>
                    <p className="text-sm text-neutral-300">Rainfall: {data.rainfall} inches expected</p>
                </div>
            </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { icon: <WiStrongWind />, title: "Wind Speed", value: `${data.windSpeed} mph`, color: "red" },
            { icon: <WiBarometer />, title: "Pressure", value: `${data.pressure} mbar`, color: "orange" },
            { icon: <WiRaindrops />, title: "Rainfall", value: `${data.rainfall} in`, color: "red" },
            { icon: <WiFlood />, title: "Affected Area", value: `${data.affectedArea} mi²`, color: "orange" },
            { icon: <FaTemperatureHigh />, title: "Temperature", value: `${data.temperature}°F`, color: "red" },
            { icon: <WiHumidity />, title: "Humidity", value: `${data.humidity}%`, color: "orange" },
            { icon: <FaWind />, title: "Wind Gusts", value: `${data.windGusts} mph`, color: "red" },
            { icon: <FaExclamationTriangle />, title: "Category", value: category, color: "orange" }
          ].map((item, index) => (
            <motion.div key={index} {...fadeInUp} transition={{ delay: index * 0.1 }}>
              <DataCard {...item} />
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div className="bg-neutral-800 rounded-lg p-6 shadow-lg" {...fadeInUp}>
            <h2 className="text-2xl font-semibold mb-4 text-white">Pressure History</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.pressureHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#525252" />
                <XAxis dataKey="time" stroke="#A3A3A3" />
                <YAxis stroke="#A3A3A3" />
                <Tooltip contentStyle={{backgroundColor: 'rgba(64, 64, 64, 0.8)', border: 'none'}} />
                <Line type="monotone" dataKey="pressure" stroke="#F97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
          <motion.div className="bg-neutral-800 rounded-lg p-6 shadow-lg" {...fadeInUp}>
            <div className='flex flex-row items-center mb-4'>
              <SparklesIcon className="w-6 h-6 mr-2" />
              <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-eagle to-orange-500">AI-Generated Damage Report</h2>
            </div>
            <TypewriterEffect text={data.aiDamageReport} />
            <p className="text-neutral-400 mb-2">Last Updated: {new Date().toLocaleTimeString()}</p>
            <p className="text-neutral-400 mb-4">Reported by: Garuda</p>
          </motion.div>
        </div>

        <motion.div className="bg-neutral-800 rounded-lg p-6 shadow-lg" {...fadeInUp}>
          <h2 className="text-2xl font-semibold mb-4 text-white">Hurricane Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoItem icon={<FaCalendar />} label="Year" value={year} color="red" />
            <InfoItem icon={<FaExclamationTriangle />} label="Category" value={category} color="orange" />
            <InfoItem icon={<FaDollarSign />} label="Estimated Damage" value={`$${damage} billion`} color="red" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const DataCard = ({ icon, title, value, color }) => {
    const colorClasses = {
      red: "text-red-400 group-hover:text-red-300",
      orange: "text-orange-400 group-hover:text-orange-300"
    };
  
    return (
      <div className="bg-neutral-800 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow group">
        <div className={`text-3xl mb-2 ${colorClasses[color]} transition-colors`}>{icon}</div>
        <h2 className="text-sm font-semibold text-neutral-400 mb-1">{title}</h2>
        <p className={`text-2xl font-bold text-white transition-colors`}>{value}</p>
      </div>
    );
  };
  
  const InfoItem = ({ icon, label, value, color }) => {
    const colorClasses = {
      red: "text-red-400",
      orange: "text-orange-400"
    };
  
    return (
      <div className="flex items-center space-x-3">
        <div className={`text-2xl ${colorClasses[color]}`}>{icon}</div>
        <div>
          <p className="text-sm text-neutral-400">{label}</p>
          <p className="text-lg font-semibold text-neutral-200">{value}</p>
        </div>
      </div>
    );
  };