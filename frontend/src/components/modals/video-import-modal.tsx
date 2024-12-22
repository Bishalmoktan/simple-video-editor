import { useModal } from "@/context/modal-context";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/app-context";
import { formatMilliseconds } from "@/lib/utils";

const VideoImportModal = () => {
  const { setVideos } = useAppContext();
  const { isOpen, type, data, closeModal } = useModal();

  const isModalOpen = isOpen && type === "videoImport";

  const handleClose = () => {
    closeModal();
  };

  const handleImport = () => {
    if (data?.videoSrc) {
      const video = document.createElement("video");
      video.src = data.videoSrc;

      video.onloadedmetadata = () => {
        setVideos((prev) => [
          ...prev,
          {
            name: data.title,
            type: "video",
            duration: formatMilliseconds(video.duration!),
            resolution: `${video.videoWidth}x${video.videoHeight}`,
            videoUrl: data.videoSrc,
          },
        ]);
        handleClose();
      };

      video.load();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center">
          <DialogTitle>{data?.title}</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex justify-center flex-col items-center">
          <video
            src={data?.videoSrc}
            controls
            className="rounded-xl w-full h-[200px] object-cover cursor-pointer"
          ></video>
        </div>
        <DialogFooter>
          <Button className="btn-primary" onClick={handleImport}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default VideoImportModal;
