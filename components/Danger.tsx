import React, { useState } from 'react';
import { FileUpload } from "@/components/ui/danger-upload";
import Spline from '@splinetool/react-spline';
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Loader2 } from "lucide-react";

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

const Danger = () => {
  const [files, setFiles] = useState([]);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState(null);
  const [processedVideoUrl, setProcessedVideoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (uploadedFiles) => {
    setFiles(uploadedFiles);
    setError(null);
    if (uploadedFiles.length > 0) {
      setIsLoading(true);
      const file = uploadedFiles[0];
      const storageRef = ref(storage, file.name);
      
      try {
        // Upload file to Firebase
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        setUploadedVideoUrl(downloadURL);

        // Call API to process the video
        const apiUrl = `https://71ca-67-134-204-43.ngrok-free.app/process-video?video_link=${encodeURIComponent(file.name)}`;
        const response = await fetch(apiUrl, {
          method: 'GET',
          mode: 'cors', // This is the default and can be omitted
          headers: {
            'Accept': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        if (data.processed_video_url) {
          setProcessedVideoUrl(data.processed_video_url);
        } else {
          throw new Error('Processed video URL not found in API response');
        }
      } catch (error) {
        console.error("Error:", error);
        if (error.message.includes('CORS')) {
          setError("CORS error: The server needs to allow requests from this origin. Please contact the API administrator.");
        } else {
          setError(error.message || "An error occurred during processing.");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full min-h-screen mx-auto border border-dashed bg-neutral-950 border-neutral-800 rounded-lg pb-20 relative overflow-auto">
      <FileUpload onChange={handleFileUpload} />
      <div className={`${uploadedVideoUrl ? "hidden" : "block"} absolute inset-0 flex justify-center items-center opacity-90 pointer-events-none`}>
        <Spline scene="https://prod.spline.design/cOLfblZJhkceLQIm/scene.splinecode" />
      </div>
      
      <div className="relative z-10 p-8">
        {/* <FileUpload onChange={handleFileUpload} /> */}
        
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-neutral-800 p-6 rounded-lg shadow-xl flex items-center space-x-4">
              <Loader2 className="animate-spin text-white" size={24} />
              <p className="text-white text-lg">Processing video...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 bg-red-500 bg-opacity-10 border border-red-500 rounded p-4">
            <p className="text-red-500">{error}</p>
          </div>
        )}
        
        {uploadedVideoUrl && (
          <div className="mt-8 space-y-6">
            <div className="bg-neutral-900 p-4 rounded-lg">
              <h3 className="text-white text-lg font-semibold mb-2">Uploaded File</h3>
              <p className="text-neutral-300">{files[0].name}</p>
            </div>
            
            {processedVideoUrl && (
              <div className="bg-neutral-900 p-4 rounded-lg">
                <h3 className="text-white text-lg font-semibold mb-4">Processed Video</h3>
                <video 
                  src={processedVideoUrl} 
                  controls 
                  className="w-full rounded-lg shadow-lg"
                  style={{ maxHeight: "70vh" }}
                  autoPlay
                  muted
                  loop
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Danger;