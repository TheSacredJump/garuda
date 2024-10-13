'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LeafIcon, DropletIcon, SunIcon, WindIcon, RecycleIcon, Trees } from 'lucide-react';

const greenPlans = [
  {
    id: 1,
    title: "Solar-Powered City Grid",
    description: "Implement a city-wide solar panel network to power all public infrastructure and encourage private adoption.",
    icon: <SunIcon className="w-8 h-8 text-yellow-400" />,
    feasibility: 75,
    carbonFootprint: 15,
  },
  {
    id: 2,
    title: "Urban Forest Initiative",
    description: "Plant dense urban forests to improve air quality, reduce heat island effect, and increase biodiversity.",
    icon: <Trees className="w-8 h-8 text-green-400" />,
    feasibility: 90,
    carbonFootprint: 5,
  },
  {
    id: 3,
    title: "Sustainable Water Management",
    description: "Implement advanced rainwater harvesting and greywater recycling systems throughout the city.",
    icon: <DropletIcon className="w-8 h-8 text-blue-400" />,
    feasibility: 80,
    carbonFootprint: 10,
  },
  {
    id: 4,
    title: "Green Building Standards",
    description: "Enforce strict green building codes for all new constructions and major renovations.",
    icon: <LeafIcon className="w-8 h-8 text-green-500" />,
    feasibility: 70,
    carbonFootprint: 20,
  },
  {
    id: 5,
    title: "Wind Energy Integration",
    description: "Develop wind farms in suitable areas and integrate wind power into the city's energy mix.",
    icon: <WindIcon className="w-8 h-8 text-sky-400" />,
    feasibility: 65,
    carbonFootprint: 25,
  },
  {
    id: 6,
    title: "Circular Economy Model",
    description: "Implement a city-wide circular economy model to minimize waste and maximize resource efficiency.",
    icon: <RecycleIcon className="w-8 h-8 text-emerald-400" />,
    feasibility: 60,
    carbonFootprint: 30,
  },
];

const GreenPlans = () => {
  const [sortedPlans, setSortedPlans] = useState(greenPlans);
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = () => {
    const sorted = [...sortedPlans].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.carbonFootprint - b.carbonFootprint;
      } else {
        return b.carbonFootprint - a.carbonFootprint;
      }
    });
    setSortedPlans(sorted);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="min-h-screen bg-neutral-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-white mb-12">Eco-Friendly City Rebuilding Plans</h1>
        <div className="mb-8 text-center">
          <button
            onClick={handleSort}
            className="bg-eagle text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Sort by Carbon Footprint ({sortOrder === 'asc' ? 'Low to High' : 'High to Low'})
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedPlans.map((plan) => (
            <motion.div
              key={plan.id}
              className="bg-neutral-800 rounded-lg shadow-lg overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  {plan.icon}
                  <span className="text-sm font-semibold text-gray-400">
                    Carbon Footprint: {plan.carbonFootprint}%
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">{plan.title}</h2>
                <p className="text-gray-300 mb-4">{plan.description}</p>
                <div className="mt-4">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-300 mr-2">Feasibility:</span>
                    <div className="flex-1 bg-neutral-700 rounded-full h-2">
                      <div
                        className="bg-eagle h-2 rounded-full"
                        style={{ width: `${plan.feasibility}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-300 ml-2">{plan.feasibility}%</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GreenPlans;