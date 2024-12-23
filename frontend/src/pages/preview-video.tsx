import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-context";
import { useModal } from "@/context/modal-context";
import { useToast } from "@/hooks/use-toast";
import { axiosClient } from "@/services/api-service";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";

const PreviewVideo = () => {
  const { firstImageVideo, lastImageVideo, videos, transitions } =
    useAppContext();
  const [video, setVideo] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { openModal, closeModal } = useModal();
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
        setError("Please upload at least two videos!");
        return;
      }

      let newTransitions: string[] = [];

      if (transitions.length === 0) {
        for (let i = 0; i < videoUrls.length - 1; i++) {
          newTransitions[i] = "fade";
        }
      } else {
        newTransitions = transitions;
      }

      if (videoUrls.length - 1 !== newTransitions.length) {
        toast({
          title: "Invalid transition",
          description:
            "Make sure you have provided all the transitions in apply transition page",
          variant: "destructive",
        });
        setError(
          "Make sure you have provided all the transitions in apply transition page"
        );

        return;
      }

      try {
        setLoading(true);
        const userType = localStorage.getItem("userType") || "free";
        const response = await axiosClient.post(
          "/api/videos/merge-videos",
          {
            videoUrls,
            transitions: newTransitions,
            userType,
          },
          {
            responseType: "arraybuffer",
          }
        );
        const videoBlob = new Blob([response.data], { type: "video/mp4" });

        const videoObjectUrl = URL.createObjectURL(videoBlob);

        setVideo(videoObjectUrl);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            description: "Something went wrong!",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    mergeVideos();
  }, []);

  useEffect(() => {
    if (loading) {
      openModal("loading", {
        title: "Merging videos",
      });
    }

    if (!loading) {
      closeModal();
    }
  }, [loading]);

  return (
    <div className="p-8">
      <h2 className="h2">Preview your video</h2>
      {video ? (
        <div className="flex justify-center py-16 items-center flex-col gap-8">
          <div>
            <video
              src={video}
              controls
              className="rounded-md w-[500px] object-contain"
            />
          </div>
          <div className="space-x-2">
            <Button className="btn-primary">
              <a href={video} download={"mergedVideo.mp4"}>
                {" "}
                Download
              </a>
            </Button>
            <Button
              className="btn-primary"
              onClick={() =>
                openModal("infoModal", {
                  title: "Remove watermark",
                  description: "Please, go for pro plan to remove watermark",
                })
              }
            >
              Remove WaterMark
            </Button>
          </div>
        </div>
      ) : (
        <div>{error}</div>
      )}
    </div>
  );
};
export default PreviewVideo;
