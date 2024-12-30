import React, { createContext, useContext, useState } from "react";

const FullscreenContext = createContext<{
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}>({
  isFullscreen: false,
  toggleFullscreen: () => {},
});

export const FullscreenProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const element = document.documentElement; // Fullscreen the entire document
    if (!document.fullscreenElement) {
      element.requestFullscreen().then(() => setIsFullscreen(true));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false));
    }
  };

  return (
    <FullscreenContext.Provider value={{ isFullscreen, toggleFullscreen }}>
      {children}
    </FullscreenContext.Provider>
  );
};

export const useFullscreen = () => useContext(FullscreenContext);
