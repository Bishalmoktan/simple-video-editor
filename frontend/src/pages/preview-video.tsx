import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-context";
import { useToast } from "@/hooks/use-toast";
import { axiosClient } from "@/services/api-service";
import { useEffect, useState } from "react";

const PreviewVideo = () => {
  const { firstImageVideo, lastImageVideo, videos, transitions } =
    useAppContext();
  const [video, setVideo] = useState<string | null>(null);
  const { toast } = useToast();
  useEffect(() => {
    const mergeVideos = async () => {
      const videoUrls = videos.map((video) => video.videoUrl);
      if (firstImageVideo) {
        videoUrls.unshift(firstImageVideo);
      }
      if (lastImageVideo) {
        videoUrls.push(lastImageVideo);
      }

      if (!videoUrls || videoUrls.length <= 1) {
        toast({
          description: "Please upload at least two videos!",
          variant: "destructive",
        });
        return;
      }

      if (videoUrls.length - 1 !== transitions.length) {
        toast({
          title: "Invalid transition",
          description:
            "Make sure you have provided all the transitions in apply transition page",
          variant: "destructive",
        });
        return;
      }
      const response = await axiosClient.post(
        "/api/videos/merge-videos",
        {
          videoUrls,
          transitions,
        },
        {
          responseType: "arraybuffer",
        }
      );
      const videoBlob = new Blob([response.data], { type: "video/mp4" });

      // Generate a URL for the video Blob
      const videoObjectUrl = URL.createObjectURL(videoBlob);

      // Set the generated URL in the state
      setVideo(videoObjectUrl);
    };

    mergeVideos();
  }, []);
  return (
    <div className="p-8">
      <h2 className="h2">Preview your video</h2>
      {video && (
        <div className="flex justify-center py-16 items-center flex-col gap-8">
          <div>
            <video src={video} controls className="rounded-md w-[500px]" />
          </div>
          <div className="space-x-2">
            <Button className="btn-primary">
              <a href={video} download={"mergedVideo.mp4"}>
                {" "}
                Download
              </a>
            </Button>
            <Button className="btn-primary">Remove WaterMark</Button>
          </div>
        </div>
      )}
    </div>
  );
};
export default PreviewVideo;
