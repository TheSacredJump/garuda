"use client";

import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Bell, Moon, Sun, Globe, Lock, User } from 'lucide-react';

const SettingsPage = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState('English');
  const [fontSize, setFontSize] = useState(16);

  const handleSave = () => {
    // Here you would typically save the settings to your backend or local storage
    console.log('Settings saved:', { darkMode, notifications, language, fontSize });
    // You can add a notification or feedback to the user here
  };

  return (
    <div className="w-full h-full p-4 bg-neutral-950 text-white overflow-auto">
      <div className="flex flex-col justify-center items-centerw-full mx-auto rounded-lg p-8 mb-8">
        <h1 className="text-3xl font-bold mb-8">Settings</h1>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Moon className="h-5 w-5" />
              <span>Dark Mode</span>
            </div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <Globe className="h-5 w-5" />
              <span>Language</span>
            </div>
            <select 
              value={language} 
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 border border-neutral-800 rounded bg-neutral-900 text-white"
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <Sun className="h-5 w-5" />
              <span>Font Size: {fontSize}px</span>
            </div>
            <Slider
              value={[fontSize]}
              onValueChange={([value]) => setFontSize(value)}
              max={24}
              min={12}
              step={1}
              className="bg-neutral-800"
            />
          </div>

          <div className="pt-4">
            <Button onClick={handleSave} className="w-full bg-eagle hover:bg-eagle/80">
              Save Settings
            </Button>
          </div>

          <div className="border-t border-neutral-800 pt-6 mt-6 space-y-4">
            <Button variant="outline" className="w-full flex items-center justify-center space-x-2 border-neutral-800 text-white hover:bg-neutral-800">
              <Lock className="h-4 w-4" />
              <span>Change Password</span>
            </Button>
            <Button variant="outline" className="w-full flex items-center justify-center space-x-2 border-neutral-800 text-white hover:bg-neutral-800">
              <User className="h-4 w-4" />
              <span>Edit Profile</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;