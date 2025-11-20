import { useState } from "react";

interface ConditionalImageProps {
  src: string;
  alt: string;
}

function ConditionalImage({ src, alt }: ConditionalImageProps) {
  const [imageExists, setImageExists] = useState(true);

  const handleImageError = () => {
    setImageExists(false);
  };

  return imageExists ? (
    <div>
      <p className="font-bold">Map</p>
      <div className="w-full flex justify-center"></div>
      <img src={src} alt={alt} onError={handleImageError} />
    </div>
  ) : null; // Don't render the parent div if the image doesn't exist
}

export default ConditionalImage;
