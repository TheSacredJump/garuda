'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { FaExclamationTriangle, FaFireExtinguisher, FaWater, FaWind, FaBomb, FaQuestion, FaRoad, FaBuilding, FaBridge, FaBolt, FaTowerCell, FaAmbulance, FaRobot } from "react-icons/fa";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { SparklesIcon } from 'lucide-react';
import { SparklesCore } from '@/components/ui/sparkles';
import { motion } from 'framer-motion';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'];

const TypewriterEffect = ({ text }: { text: string }) => {
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

export default function DamageAnalyticsDashboard({ damageData }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating data load
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const getDamageTypeIcon = (type) => {
    switch(type) {
      case 'structural': return <FaBuilding />;
      case 'fire-related': return <FaFireExtinguisher />;
      case 'flood-related': return <FaWater />;
      case 'wind damage': return <FaWind />;
      case 'explosion-related': return <FaBomb />;
      default: return <FaQuestion />;
    }
  };

  const getInfrastructureIcon = (infra) => {
    switch(infra) {
      case 'roads': return <FaRoad />;
      case 'bridges': return <FaBridge />;
      case 'buildings': return <FaBuilding />;
      case 'power lines': return <FaBolt />;
      case 'communication towers': return <FaTowerCell />;
      default: return <FaQuestion />;
    }
  };

  const severityData = [
    { name: 'Minor', value: damageData.damage_severity === 'minor' ? 1 : 0 },
    { name: 'Moderate', value: damageData.damage_severity === 'moderate' ? 1 : 0 },
    { name: 'Severe', value: damageData.damage_severity === 'severe' ? 1 : 0 },
    { name: 'Catastrophic', value: damageData.damage_severity === 'catastrophic' ? 1 : 0 },
  ];

  const responseData = [
    { name: 'Response Level', value: damageData.critical_response_level }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-950">
        <div className="text-center flex flex-col items-center justify-center">
          <FaExclamationTriangle className="w-32 h-32 text-red-500 animate-pulse" />
          <p className="text-white mt-4 text-xl font-light">Analyzing Damage Data...</p>
        </div>
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
          <h1 className="text-4xl font-bold text-white">Damage Analytics Dashboard</h1>
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
            <h2 className='z-20 ml-4 mt-4 text-2xl font-bold'>Damage Report</h2>
            <p className='z-20 ml-4 mt-1 text-sm text-neutral-400'>AI-Powered Damage Assessment</p>
            <div className='grid grid-cols-4 gap-8 w-[95%] mx-auto mb-10'>
                <div className="p-5 bg-neutral-800/25 w-full mt-8 z-20 rounded-lg backdrop-blur-lg border border-white/10 shadow-xl">
                    <h3 className="text-lg font-semibold text-orange-400 mb-2">Damage Severity</h3>
                    <p className="text-3xl font-bold text-white mb-2 capitalize">{damageData.damage_severity}</p>
                    <p className="text-sm text-neutral-300">Critical Response Level: {damageData.critical_response_level}</p>
                </div>
                <div className="p-5 bg-neutral-800/25 w-full mt-8 z-20 rounded-lg backdrop-blur-lg border border-white/10 shadow-xl">
                    <h3 className="text-lg font-semibold text-white mb-2">Damage Type</h3>
                    <p className="text-3xl font-bold text-white mb-2 capitalize">{damageData.damage_type}</p>
                    <p className="text-sm text-neutral-300">Primary cause of damage</p>
                </div>
                <div className="p-5 bg-neutral-800/25 w-full mt-8 z-20 rounded-lg backdrop-blur-lg border border-white/10 shadow-xl">
                    <h3 className="text-lg font-semibold text-white mb-2">Rescue Status</h3>
                    <p className="text-3xl font-bold text-white mb-2 capitalize">{damageData.rescue_needed}</p>
                    <p className="text-sm text-neutral-300">Immediate rescue operations needed</p>
                </div>
                <div className="p-5 bg-neutral-800/25 w-full mt-8 z-20 rounded-lg backdrop-blur-lg border border-white/10 shadow-xl">
                    <h3 className="text-lg font-semibold text-orange-400 mb-2">Accessibility</h3>
                    <p className="text-3xl font-bold text-white mb-2 capitalize">{damageData.accessibility}</p>
                    <p className="text-sm text-neutral-300">Current access status to affected areas</p>
                </div>
            </div>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <DataCard icon={getDamageTypeIcon(damageData.damage_type)} title="Damage Type" value={damageData.damage_type} color="red" />
          </motion.div>
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <DataCard icon={getInfrastructureIcon(damageData.infrastructure_affected[0])} title="Infrastructure Affected" value={damageData.infrastructure_affected[0]} color="orange" />
          </motion.div>
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
            <DataCard icon={<FaAmbulance />} title="Rescue Needed" value={damageData.rescue_needed} color="red" />
          </motion.div>
          <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
            <DataCard icon={<FaExclamationTriangle />} title="Additional Hazards" value={damageData.additional_hazards} color="orange" />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div className="bg-neutral-800 rounded-lg p-6 shadow-lg" {...fadeInUp}>
            <h2 className="text-2xl font-semibold mb-4 text-white">Damage Severity</h2>
            <ResponsiveContainer width="100%" height={300}>
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
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
          <motion.div className="bg-neutral-800 rounded-lg p-6 shadow-lg" {...fadeInUp}>
            <h2 className="text-2xl font-semibold mb-4 text-white">Critical Response Level</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={responseData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#525252" />
                <XAxis dataKey="name" stroke="#A3A3A3" />
                <YAxis stroke="#A3A3A3" />
                <Tooltip contentStyle={{backgroundColor: 'rgba(64, 64, 64, 0.8)', border: 'none'}} />
                <Bar dataKey="value" fill="#F97316" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.div className="bg-neutral-800 rounded-lg p-6 shadow-lg" {...fadeInUp}>
          <div className='flex flex-row items-center mb-4'>
            <SparklesIcon className="w-6 h-6 mr-2" />
            <h2 className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-eagle to-orange-500">AI-Generated Damage Report</h2>
          </div>
          <TypewriterEffect text={`The damage severity is ${damageData.damage_severity}, with a critical response level of ${damageData.critical_response_level}. The primary damage type is ${damageData.damage_type}, affecting ${damageData.infrastructure_affected.join(', ')}. Rescue operations are ${damageData.rescue_needed === 'yes' ? 'needed' : 'not needed'}. The affected area is currently ${damageData.accessibility}. Additional hazards include ${damageData.additional_hazards}. Suggested equipment for response: ${damageData.suggested_equipment}.`} />
          <p className="text-neutral-400 mb-2">Last Updated: {new Date().toLocaleTimeString()}</p>
          <p className="text-neutral-400 mb-4">Reported by: AI Damage Assessment System</p>
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
      <p className={`text-2xl font-bold text-white transition-colors capitalize`}>{value}</p>
    </div>
  );
};