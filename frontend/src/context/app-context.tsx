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
};

export const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [videos, setVideos] = useState<PreviewCardProps[]>([]);
  const [firstImage, setFirstImage] = useState<PreviewCardProps | null>(null);
  const [lastImage, setLastImage] = useState<PreviewCardProps | null>(null);

  return (
    <AppContext.Provider
      value={{
        videos,
        setVideos,
        firstImage,
        setFirstImage,
        lastImage,
        setLastImage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext) as AppContextType;
};
