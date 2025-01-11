import React, { createContext, useState, useContext, ReactNode } from "react";

type EditImageContextType = {
  firstImageState: ImageState;
  setFirstImageState: React.Dispatch<React.SetStateAction<ImageState>>;
  lastImageState: ImageState;
  setLastImageState: React.Dispatch<React.SetStateAction<ImageState>>;
};

type ImageState = {
  title: string;
  subtitle: string;
  logo: string | Blob | null;
  duration: string;
  fontFamily: string;
  titleFontSize: string;
  subtitleFontSize: string;
  textColor: string;
  titlePosition: Position;
  subtitlePosition: Position;
  logoPosition: Position;
};

type Position = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const EditImageContext = createContext<EditImageContextType | undefined>(
  undefined
);

export const EditImageProvider = ({ children }: { children: ReactNode }) => {
  const [firstImageState, setFirstImageState] = useState<ImageState>({
    title: "First Image Title",
    subtitle: "First Image Subtitle",
    logo: null,
    duration: "3",
    titleFontSize: "32",
    subtitleFontSize: "24",
    fontFamily: "Arial",
    textColor: "#000000",
    titlePosition: { x: 16, y: 16, width: 200, height: 40 },
    subtitlePosition: { x: 16, y: 180, width: 150, height: 30 },
    logoPosition: { x: 290, y: 16, width: 48, height: 48 },
  });

  const [lastImageState, setLastImageState] = useState<ImageState>({
    title: "Last Image Title",
    subtitle: "Last Image Subtitle",
    logo: null,
    duration: "3",
    titleFontSize: "32",
    subtitleFontSize: "24",
    fontFamily: "Arial",
    textColor: "#000000",
    titlePosition: { x: 16, y: 16, width: 200, height: 40 },
    subtitlePosition: { x: 16, y: 180, width: 150, height: 30 },
    logoPosition: { x: 290, y: 16, width: 48, height: 48 },
  });

  return (
    <EditImageContext.Provider
      value={{
        firstImageState,
        setFirstImageState,
        lastImageState,
        setLastImageState,
      }}
    >
      {children}
    </EditImageContext.Provider>
  );
};

export const useEditImageContext = () => {
  const context = useContext(EditImageContext);
  if (!context) {
    throw new Error(
      "useEditImageContext must be used within EditImageProvider"
    );
  }
  return context;
};
