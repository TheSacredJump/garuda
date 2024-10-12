"use client";

import React, { useState } from "react";
import { FileUpload } from "@/components/ui/file-upload";
import dynamic from 'next/dynamic';

export default function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <div className="w-full min-h-screen p-4">
      <div className="w-full min-h-96 mx-auto border border-dashed bg-neutral-950 border-neutral-800 rounded-lg mb-4">
        <FileUpload onChange={handleFileUpload} />
      </div>
      <div className="grid grid-cols-2 w-full gap-4">
        <div className="w-full h-96 rounded-lg bg-gradient-to-br from-neutral-950 from-35% via-eagle via-55% to-neutral-950 to-75% overflow-hidden">
        </div>
        <div className="w-full h-96 rounded-lg bg-gradient-to-bl from-neutral-950 from-35% via-eagle via-55% to-neutral-950 to-75%">
          {/* Content for the second grid item */}
        </div>
      </div>
    </div>
  );
}