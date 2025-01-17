import { useFullscreen } from "@/context/full-screen-context";
import { Maximize2, Minimize2 } from "lucide-react";

const FullscreenButton: React.FC = () => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <button
      className="fixed z-50 p-2 bg-gray-800 rounded-full shadow-md top-2 right-2 hover:bg-gray-900"
      onClick={toggleFullscreen}
      aria-label="Toggle Fullscreen"
    >
      {isFullscreen ? <Minimize2 /> : <Maximize2 />}
    </button>
  );
};

export default FullscreenButton;
