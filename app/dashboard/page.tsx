"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconArrowLeft,
  IconBrandTabler,
  IconSettings,
  IconExclamationCircle,
  IconNews,
  IconDrone,
  IconMap,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { UserButton, useUser } from "@clerk/nextjs";

// New imports for content components
import Dashboard from "@/components/Dashboard";
// import ProfileContent from "@/components/ProfileContent";
import Settings from "@/components/Settings";
import News from "@/components/News";
import Danger from "@/components/Danger";
import HeatmapComponent from "@/components/Heatmap";

export default function SidebarDemo() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <IconDrone className="text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Danger Detection",
      href: "#",
      icon: (
        <IconExclamationCircle className="text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Heatmap",
      href: "#",
      icon: (
        <IconMap className="text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "News",
      href: "#",
      icon: (
          <IconNews className="text-neutral-200 h-5 w-5 flex-shrink-0" />
      )
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <IconSettings className="text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const handleTabClick = (label) => {
    setActiveTab(label);
  };

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-neutral-800 w-full flex-1 mx-auto border border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink 
                  key={idx} 
                  link={link} 
                  onClick={() => handleTabClick(link.label)}
                  active={activeTab === link.label}
                />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: `${user?.firstName} ${user?.lastName}`,
                href: "#",
                icon: (
                  <UserButton />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Content activeTab={activeTab} />
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image src="/eagle_logo.png" alt="Logo" width={32} height={32} className="mr-2" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-white whitespace-pre font-mono"
      >
        GARUDA
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image src="/eagle_logo.png" alt="Logo" width={32} height={32} className="mr-2" />
    </Link>
  );
};

// Dummy dashboard component with content
const Content = ({ activeTab }) => {
    return (
      <div className="flex flex-1">
        <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-700 bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
          {activeTab === "Dashboard" && <Dashboard />}
          {activeTab === "Danger Detection" && <Danger />}
          {activeTab === "Heatmap" && <HeatmapComponent />}
          {activeTab === "Settings" && <Settings />}
          {activeTab === "News" && <News />}
        </div>
      </div>
    );
  };
  
  // Placeholder components for each tab's content
  const DashboardContent = () => (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Dashboard</h2>
      {/* Add your dashboard content here */}
    </div>
  );
  
  const ProfileContent = () => (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Profile</h2>
      {/* Add your profile content here */}
    </div>
  );
  
  const SettingsContent = () => (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Settings</h2>
      {/* Add your settings content here */}
    </div>
  );
  
  const LogoutContent = () => (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Logout</h2>
      <p className="text-white">Are you sure you want to logout?</p>
      {/* Add logout functionality here */}
    </div>
  );
