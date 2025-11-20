// src/pages/About.tsx (Adjust path as needed)
import React from "react";
// Assuming 'react-router' is correct for your setup, otherwise use 'react-router-dom'
import { Link } from "react-router";
// Import the Github icon from lucide-react
import { Github } from "lucide-react";

const About: React.FC = () => {
  const githubUrl = "https://github.com/devdras/leicestershire-bouldering-pwa";

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 border-b pb-2">About This App</h2>

      {/* Increased spacing between main sections */}
      <div className="space-y-6 text-gray-700">
        <p>
          Welcome! This application serves as an unofficial digital companion
          and logbook for the fantastic bouldering guides available for
          Leicestershire.
        </p>

        {/* Data Source Section */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded">
          <h3 className="text-lg font-semibold mb-2 text-blue-800">
            Data Source
          </h3>
          <p className="text-sm">
            All the route information, including names, grades, descriptions,
            and topo images presented in this app, has been transcribed from the
            excellent and freely available PDF guides published on the{" "}
            <a
              href="https://www.leicestershirebouldering.co.uk/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              Leicestershire Bouldering website
            </a>
            .
          </p>
          <p className="text-sm mt-2">
            This app is not affiliated with the creators of the original guides.
            Please visit their website for the official PDFs and support their
            work!
          </p>
        </div>

        {/* Features Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Features</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>
              <strong>Browse Routes:</strong> Navigate through Areas, Sectors,
              and Blocks to find route details.
            </li>
            <li>
              <strong>Tick Routes:</strong> Mark routes you have climbed using
              the checkmark button (
              <span className="inline-block w-4 h-4 rounded-full bg-green-500 align-middle"></span>
              ) next to each route.
            </li>
            <li>
              <strong>Track Progress:</strong> See summaries of how many routes
              you have ticked within specific Areas, Sectors, or Blocks.
            </li>
            <li>
              <strong>Data Management:</strong> Use the{" "}
              <Link
                to="/data-export" // Ensure this route is correct
                className="text-blue-600 hover:underline font-medium"
              >
                Data Management page
              </Link>{" "}
              to export (backup) or import your ticked routes data.
            </li>
          </ul>
        </div>

        {/* PWA & Local Data Section */}
        <div className="p-4 bg-green-50 border border-green-200 rounded">
          <h3 className="text-lg font-semibold mb-2 text-green-800">
            Offline Use & Installation (PWA)
          </h3>
          <p className="text-sm mb-3">
            This app is built as a Progressive Web App (PWA), meaning you can
            install it on your device for a more app-like experience and
            potential offline access to browse data (depending on your browser's
            caching).
          </p>
          <h4 className="font-semibold mb-1 text-sm">How to Install:</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm mb-3">
            <li>
              <strong>Desktop (Chrome, Edge):</strong> Look for an install icon
              (often looks like a computer screen with a down arrow) in the
              address bar and follow the prompts.
            </li>
            <li>
              <strong>Android (Chrome):</strong> Tap the browser menu (usually
              three dots) and look for an "Install app" or "Add to Home screen"
              option.
            </li>
            <li>
              <strong>iOS (Safari):</strong> Tap the "Share" button (square with
              an up arrow) and scroll down to select "Add to Home Screen".
            </li>
          </ul>
          <p className="text-xs text-gray-600 mb-3">
            (Note: Exact steps and appearance may vary slightly depending on
            your device and browser version.)
          </p>
          <h4 className="font-semibold mb-1 text-sm">
            Important Note on Data Storage:
          </h4>
          <p className="text-sm">
            Whether you use the app in your browser or install it as a PWA, your{" "}
            <strong>
              ticked route data is stored locally on your specific device
            </strong>{" "}
            within that browser or installed app instance (using IndexedDB).
          </p>
          <p className="text-sm mt-1">
            This means your ticks <strong>do not automatically sync</strong>{" "}
            between different browsers, devices, or even different browser
            profiles on the same device. To use your data elsewhere, you must
            use the{" "}
            <Link
              to="/data-export" // Ensure this route is correct
              className="text-blue-600 hover:underline font-medium"
            >
              Export
            </Link>{" "}
            feature on one device and the{" "}
            <Link
              to="/data-export" // Ensure this route is correct
              className="text-blue-600 hover:underline font-medium"
            >
              Import
            </Link>{" "}
            feature on the other.
          </p>
        </div>

        {/* --- NEW Source Code Section --- */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Source Code</h3>
          <p className="text-sm">
            This project is open source. You can view the code, report issues,
            or contribute on GitHub:
          </p>
          <p className="mt-2">
            {/* External link using <a> tag */}
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              // Use inline-flex to align icon and text
              className="inline-flex items-center gap-1 text-blue-600 hover:underline font-medium text-sm"
            >
              <Github size={16} strokeWidth={2} /> {/* Lucide icon */}
              <span>devdras/leicestershire-bouldering-pwa</span>
            </a>
          </p>
        </div>
        {/* --- END Source Code Section --- */}

        {/* Disclaimer Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Disclaimer</h3>
          <p className="text-sm">
            While effort has been made to accurately transcribe the route data,
            the original PDF guides from Leicestershire Bouldering remain the
            definitive source. Please refer to them for the most accurate and
            up-to-date information. Your ticked data is stored only within your
            current browser; clearing your browser data may remove your ticks.
            No responsibility is taken for data loss.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
