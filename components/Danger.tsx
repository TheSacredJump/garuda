"use client";

import React, { useState } from "react";
import { FileUpload } from "@/components/ui/danger-upload";
import Spline from '@splinetool/react-spline';

const Danger = () => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <div className="w-full min-h-screen mx-auto border border-dashed bg-neutral-950 border-neutral-800 rounded-lg mb-4 relative">
        <FileUpload onChange={handleFileUpload} />
        <div className="absolute inset-0 flex justify-center items-center opacity-75">
          <Spline scene="https://prod.spline.design/cOLfblZJhkceLQIm/scene.splinecode" />
        </div>
    </div>
  );
}

export default Danger