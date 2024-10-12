"use client";
import React from "react";
import { LayoutGrid } from "./ui/layout-grid";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { SparkleIcon } from "lucide-react";

export default function LayoutGridDemo() {
  return (
    <div className="overflow-auto w-full h-full flex flex-col">
      <h1 className="text-3xl font-semibold mb-5">Hurricane News and Reports</h1>
      <div className="min-h-screen pb-4 w-full overflow-auto">
        <LayoutGrid cards={cards} />
      </div>
      <div className="min-h-screen pb-5 w-full overflow-auto">
        <LayoutGrid cards={cards2} />
      </div>
    </div>
  );
}

const HurricaneCard = ({ name, year, category, damage }: { name: string; year: string; category: string; damage: string }) => {
    const router = useRouter();
  
    const handleGenerateReport = () => {
      router.push(`/hurricane-report?name=${name}&year=${year}&category=${category}&damage=${damage}`);
    };
  
    return (
      <div>
        <p className="font-bold md:text-4xl text-xl text-white">
          Hurricane {name}
        </p>
        <p className="font-normal text-base text-white">{year}</p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
          Category {category} hurricane that caused ${damage} billion in damage.
        </p>
        <Button onClick={handleGenerateReport} className="flex flex-row items-center mt-4 bg-gradient-to-r from-red-500 to-orange-500">
            <SparkleIcon className="w-4 h-4 mr-2" />
            <p>Generate Garuda Report</p>
        </Button>
      </div>
    );
  };

const cards = [
  {
    id: 1,
    content: <HurricaneCard name="Katrina" year="2005" category="5" damage="125" />,
    className: "md:col-span-2",
    thumbnail: "/hurricane1.jpg",
  },
  {
    id: 2,
    content: <HurricaneCard name="Harvey" year="2017" category="4" damage="125" />,
    className: "col-span-1",
    thumbnail: "/hurricane-harvey.jpg",
  },
  {
    id: 3,
    content: <HurricaneCard name="Kelly" year="2022" category="5" damage="50" />,
    className: "col-span-1",
    thumbnail: "/hurricane-kelly.jpg",
  },
  {
    id: 4,
    content: <HurricaneCard name="Maria" year="2017" category="5" damage="90" />,
    className: "md:col-span-2",
    thumbnail: "/hurricane-maria.jpg",
  }
];

const cards2 = [
    {
        id: 1,
        content: <HurricaneCard name="Sandy" year="2012" category="3" damage="65" />,
        className: "md:col-span-2",
        thumbnail: "/hurricane-sandy.webp",
      },
      {
        id: 2,
        content: <HurricaneCard name="Ida" year="2021" category="4" damage="75" />,
        className: "col-span-1",
        thumbnail: "/hurricane-ida.jpeg",
      },
      {
        id: 3,
        content: <HurricaneCard name="Andrew" year="1992" category="5" damage="27" />,
        className: "col-span-1",
        thumbnail: "/hurricane-andrew.webp",
      },
      {
        id: 4,
        content: <HurricaneCard name="Michael" year="2018" category="5" damage="25" />,
        className: "md:col-span-2",
        thumbnail: "/hurricane-michael.jpeg",
      },
]