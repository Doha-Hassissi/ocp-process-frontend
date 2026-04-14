import React from "react";
import { GlobeAltIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

function Footer() {
  return (
    <footer className="bg-green-700 text-white px-6 py-8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between items-center gap-8">

        {/* OCP section */}
        <div className="flex flex-col items-center space-y-1">
          <a href="https://www.ocpgroup.ma" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center hover:text-gray-300 transition">
            <GlobeAltIcon className="h-8 w-8 text-green-900" />
            <span className="text-sm font-semibold mt-1">OCP</span>
          </a>
          
        </div>

        {/* Email section */}
        <div className="flex flex-col items-center space-y-1">
          <a href="mailto:dohahassissi17@gmail.com" className="flex flex-col items-center hover:text-gray-300 transition">
            <EnvelopeIcon className="h-8 w-8 text-green-900" />
            <span className="text-sm font-semibold mt-1">dohahassissi17@gmail.com</span>
          </a>
        </div>

      </div>

      <div className="mt-6 text-center text-gray-200 text-xs">
        
        &copy; {new Date().getFullYear()} Digital Workflow <br />
        <span className="text-xs text-gray-200 mt-1">Fait par Doha</span>
      </div>
    </footer>
  );
}

export default Footer;