import { useFullscreen } from "@/context/full-screen-context";
import { Maximize2, Minimize2 } from "lucide-react";

const FullscreenButton: React.FC = () => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <button
      className="fixed top-2 right-2 z-50 p-2 bg-gray-200 rounded-full shadow-md hover:bg-gray-300"
      onClick={toggleFullscreen}
      aria-label="Toggle Fullscreen"
    >
      {isFullscreen ? <Minimize2 /> : <Maximize2 />}
    </button>
  );
};

export default FullscreenButton;
