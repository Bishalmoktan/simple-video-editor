import { PreviewCardProps } from "@/components/preview-card";
import React, {
  createContext,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
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
  runMerging: boolean;
  setRunMerging: React.Dispatch<SetStateAction<boolean>>;
  videoUrls: (string | undefined)[];
  mergedVideo: string | null;
  setMergedVideo: React.Dispatch<SetStateAction<string | null>>;
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
  const [mergedVideo, setMergedVideo] = useState<string | null>(null);
  const [runMerging, setRunMerging] = useState<boolean>(false);

  const videoUrls = useMemo(() => {
    const urls = videos.map((video) => {
      if (video.newVideoUrl) {
        return video.newVideoUrl;
      } else {
        return video.videoUrl;
      }
    });
    if (firstImageVideo) {
      urls.unshift(firstImageVideo);
    }
    if (lastImageVideo) {
      urls.push(lastImageVideo);
    }
    return urls;
  }, [videos, firstImageVideo, lastImageVideo]);

  useEffect(() => {
    setRunMerging(true);
  }, [videos, firstImageVideo, lastImageVideo, transitions]);

  useEffect(() => {
    if (videoUrls.length) {
      setTransitions(new Array(videoUrls.length - 1).fill("fade"));
    }
  }, [videos, firstImageVideo, lastImageVideo]);

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
        runMerging,
        setRunMerging,
        videoUrls,
        mergedVideo,
        setMergedVideo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext) as AppContextType;
};
