import React, { createContext, useState, useContext, ReactNode } from "react";

type EditVideoContextType = {
  editVideoState: VideoState[];
  setEditVideoState: React.Dispatch<React.SetStateAction<VideoState[]>>;
};

export type VideoState = {
  title: string;
  subtitle: string;
  logo: string | null | Blob;
  fontFamily: string;
  titleFontSize: string;
  subtitleFontSize: string;
  textColor: string;
  titlePosition: Position;
  subtitlePosition: Position;
  logoPosition: Position;
  videoUrl?: string;
};

export type Position = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const EditVideoContext = createContext<EditVideoContextType | undefined>(
  undefined
);

export const EditVideoProvider = ({ children }: { children: ReactNode }) => {
  const [editVideoState, setEditVideoState] = useState<VideoState[]>([]);

  return (
    <EditVideoContext.Provider
      value={{
        editVideoState,
        setEditVideoState,
      }}
    >
      {children}
    </EditVideoContext.Provider>
  );
};

export const useEditVideoContext = () => {
  const context = useContext(EditVideoContext);
  if (!context) {
    throw new Error(
      "useEditVideoContext must be used within EditImageProvider"
    );
  }
  return context;
};
