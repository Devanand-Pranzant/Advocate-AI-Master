import React from "react";
import { Construction } from "lucide-react";

export default function UnderConstruction() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 text-center">
      <Construction size={72} className="text-yellow-600 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Page Under Construction
      </h1>
      <p className="text-xl text-gray-600 max-w-md">
        Coming soon — we're working on it!
      </p>
    </div>
  );
}