// src/pages/DataExport.tsx (Adjust path as needed)
import React, { useState, useRef, useCallback } from "react";
import { getAllRouteTicks, importRouteTicks, RouteTickRecord } from "../db"; // Adjust path

const DataExport: React.FC = () => {
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [isImporting, setIsImporting] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Export Logic ---
  const handleExport = useCallback(async () => {
    setIsExporting(true);
    setMessage(null);
    console.log("Starting data export...");

    try {
      const allTicks = await getAllRouteTicks();
      if (allTicks.length === 0) {
        setMessage({
          type: "success",
          text: "There are no ticked routes to export.",
        });
        setIsExporting(false);
        return;
      }

      // Convert data to JSON string
      const jsonString = JSON.stringify(allTicks, null, 2); // Pretty print JSON

      // Create a Blob (Binary Large Object)
      const blob = new Blob([jsonString], { type: "application/json" });

      // Create a temporary URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a temporary anchor element to trigger download
      const a = document.createElement("a");
      a.href = url;
      // Suggest a filename (users can change it)
      const dateStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
      a.download = `climbing_log_export_${dateStr}.json`;

      // Programmatically click the anchor to start download
      document.body.appendChild(a); // Append anchor to body
      a.click(); // Simulate click

      // Clean up: remove anchor and revoke the URL
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log("Export successful.");
      setMessage({
        type: "success",
        text: `Successfully exported ${allTicks.length} ticked routes.`,
      });
    } catch (error: any) {
      console.error("Export failed:", error);
      setMessage({ type: "error", text: `Export failed: ${error.message}` });
    } finally {
      setIsExporting(false);
    }
  }, []); // No dependencies needed if using functions from module scope

  // --- Import Logic ---
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(null);
      const file = event.target.files?.[0]; // Get the selected file

      if (!file) {
        console.log("No file selected.");
        return; // No file chosen
      }

      if (!file.name.endsWith(".json")) {
        setMessage({
          type: "error",
          text: "Import failed: Please select a valid JSON file (.json).",
        });
        // Reset file input value so the same file can be selected again if needed
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const reader = new FileReader();

      reader.onload = async (e) => {
        const text = e.target?.result;
        if (typeof text !== "string") {
          setMessage({
            type: "error",
            text: "Import failed: Could not read file content.",
          });
          setIsImporting(false);
          return;
        }

        setIsImporting(true); // Set importing state here, after file read starts
        console.log("File read, attempting to parse and import...");

        try {
          const importedData = JSON.parse(text);

          // Basic validation
          if (!Array.isArray(importedData)) {
            throw new Error("Invalid JSON format: Data is not an array.");
          }
          if (importedData.length > 0) {
            // Check if the first item looks like our record
            const firstItem = importedData[0];
            if (
              !firstItem ||
              typeof firstItem.routeName !== "string" ||
              typeof firstItem.areaName !== "string" ||
              typeof firstItem.ticked !== "boolean"
            ) {
              throw new Error(
                "Invalid JSON structure: Array items do not match expected RouteTickRecord format."
              );
            }
          }

          // *** Optional: Clear existing data before import? ***
          // if (window.confirm("Clear all existing ticks before importing?")) {
          //    await clearRouteTicks();
          // }

          // Import the validated data
          await importRouteTicks(importedData as RouteTickRecord[]); // Assert type after validation

          console.log("Import successful.");
          setMessage({
            type: "success",
            text: `Successfully imported ${importedData.length} records. Refresh other pages to see changes.`,
          });
        } catch (error: any) {
          console.error("Import failed:", error);
          setMessage({
            type: "error",
            text: `Import failed: ${error.message}`,
          });
        } finally {
          setIsImporting(false);
          // Reset file input value so the same file can be selected again
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };

      reader.onerror = (e) => {
        console.error("File reading error:", e);
        setMessage({
          type: "error",
          text: "Import failed: Error reading file.",
        });
        // Reset file input value
        if (fileInputRef.current) fileInputRef.current.value = "";
      };

      // Read the file as text
      reader.readAsText(file);
    },
    []
  ); // Empty dependency array

  // Trigger the hidden file input click
  const handleImportClick = useCallback(() => {
    // Clear previous message when starting a new import attempt
    setMessage(null);
    fileInputRef.current?.click();
  }, []);

  const isBusy = isExporting || isImporting;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 border-b pb-2">Data Management</h2>

      <div className="mb-6 bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded">
        <h3 className="font-semibold mb-2 text-lg">Purpose</h3>
        <p className="text-sm">
          This page allows you to manage your climbing log data stored locally
          in your browser's IndexedDB.
        </p>
        <ul className="list-disc pl-5 mt-2 text-sm space-y-1">
          <li>
            <strong>Export:</strong> Download a JSON file containing all your
            ticked routes. This is useful for creating backups or transferring
            data between devices/browsers.
          </li>
          <li>
            <strong>Import:</strong> Upload a previously exported JSON file to
            restore or add ticked routes to your log. This will update existing
            entries for the same route name or add new ones.
          </li>
        </ul>
      </div>

      {/* Export Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Export Data</h3>
        <p className="text-sm text-gray-600 mb-3">
          Download your ticked routes as a JSON backup file.
        </p>
        <button
          onClick={handleExport}
          disabled={isBusy}
          className={`px-4 py-2 rounded font-medium text-white ${
            isBusy
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          } transition-colors`}
        >
          {isExporting ? "Exporting..." : "Export Ticks to JSON"}
        </button>
      </div>

      {/* Import Section */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Import Data</h3>
        <p className="text-sm text-gray-600 mb-3">
          Upload a previously exported JSON file (`.json`). This will add or
          update ticks based on the route names in the file.
        </p>
        {/* Hidden file input, triggered by the button */}
        <input
          type="file"
          accept=".json,application/json" // Specify accepted types
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }} // Hide the default input
          disabled={isBusy}
        />
        {/* Visible button */}
        <button
          onClick={handleImportClick}
          disabled={isBusy}
          className={`px-4 py-2 rounded font-medium text-white ${
            isBusy
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          } transition-colors`}
        >
          {isImporting ? "Importing..." : "Import Ticks from JSON"}
        </button>
      </div>

      {/* Status Message Area */}
      {message && (
        <div
          className={`mt-6 p-3 rounded border ${
            message.type === "error"
              ? "bg-red-50 border-red-300 text-red-800"
              : "bg-green-50 border-green-300 text-green-800"
          }`}
          role={message.type === "error" ? "alert" : "status"}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default DataExport;
