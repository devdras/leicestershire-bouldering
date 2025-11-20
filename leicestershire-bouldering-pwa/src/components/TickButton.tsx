// src/components/TickButton.tsx
import { Check } from "lucide-react";

interface TickButtonProps {
  isTicked: boolean;
  toggleTick: () => void;
  disabled?: boolean; // <-- ADD THIS
}

const TickButton = ({
  isTicked,
  toggleTick,
  disabled = false, // Default to not disabled
}: TickButtonProps) => {
  return (
    <button
      onClick={toggleTick}
      disabled={disabled} // <-- APPLY DISABLED ATTRIBUTE
      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
        isTicked ? "bg-green-500 text-white" : "bg-gray-200 text-gray-400"
      } ${
        disabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-80" // <-- ADD DISABLED STYLING
      }`}
      aria-label={isTicked ? "Untick route" : "Tick route"}
      aria-disabled={disabled} // Add aria-disabled for accessibility
    >
      {/* Conditional rendering or opacity changes based on `isTicked` */}
      <Check
        size={16}
        strokeWidth={3}
        className={`transition-opacity duration-150 ${
          isTicked ? "opacity-100" : "opacity-0"
        }`}
      />
      {/* Optionally, show a loading indicator */}
      {/* {disabled && !isTicked && <Spinner size={16} />} */}
    </button>
  );
};

export default TickButton;
