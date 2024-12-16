import { PreviewCardProps } from "@/components/preview-card";
import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from "react";

type AppContextType = {
  videos: PreviewCardProps[];
  setVideos: React.Dispatch<SetStateAction<PreviewCardProps[]>>;
  firstImage: PreviewCardProps | null;
  setFirstImage: React.Dispatch<SetStateAction<PreviewCardProps | null>>;
  lastImage: PreviewCardProps | null;
  setLastImage: React.Dispatch<SetStateAction<PreviewCardProps | null>>;
  firstImageVideo: string | null;
  setFirstImageVideo: React.Dispatch<SetStateAction<string | null>>;
  lastImageVideo: string | null;
  setLastImageVideo: React.Dispatch<SetStateAction<string | null>>;
  transitions: string[];
  setTransitions: React.Dispatch<SetStateAction<string[]>>;
};

export const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [videos, setVideos] = useState<PreviewCardProps[]>([]);
  const [firstImage, setFirstImage] = useState<PreviewCardProps | null>(null);
  const [firstImageVideo, setFirstImageVideo] = useState<string | null>(null);
  const [lastImage, setLastImage] = useState<PreviewCardProps | null>(null);
  const [lastImageVideo, setLastImageVideo] = useState<string | null>(null);
  const [transitions, setTransitions] = useState<string[]>([]);

  return (
    <AppContext.Provider
      value={{
        videos,
        setVideos,
        firstImage,
        setFirstImage,
        lastImage,
        setLastImage,
        firstImageVideo,
        setFirstImageVideo,
        lastImageVideo,
        setLastImageVideo,
        transitions,
        setTransitions,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext) as AppContextType;
};
