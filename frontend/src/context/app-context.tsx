import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from "react";

type AppContextType = {
  videoSrc: string[];
  setVideoSrc: React.Dispatch<SetStateAction<string[]>>;
  firstImageSrc: string | null;
  setFirstImageSrc: React.Dispatch<SetStateAction<string | null>>;
  lastImageSrc: string | null;
  setLastImageSrc: React.Dispatch<SetStateAction<string | null>>;
};

export const AppContext = createContext<AppContextType | null>(null);

export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [videoSrc, setVideoSrc] = useState<string[]>([]);
  const [firstImageSrc, setFirstImageSrc] = useState<string | null>(null);
  const [lastImageSrc, setLastImageSrc] = useState<string | null>(null);
  return (
    <AppContext.Provider
      value={{
        videoSrc,
        firstImageSrc,
        lastImageSrc,
        setFirstImageSrc,
        setLastImageSrc,
        setVideoSrc,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useModal = () => {
  return useContext(AppContext) as AppContextType;
};
