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

const LastScreenImport = () => {
  const { setLastImage } = useAppContext();
  const { isOpen, type, data, closeModal } = useModal();

  const isModalOpen = isOpen && type === "lastScreen";

  const handleClose = () => {
    closeModal();
  };

  const handleImport = () => {
    if (data?.videoSrc) {
      const video = document.createElement("video");
      video.src = data.videoSrc;
      video.onloadedmetadata = () => {
        setLastImage({
          name: "End Screen",
          videoUrl: video.src,
          type: "last-video",
        });
      };

      video.load();
    } else {
      setLastImage({
        name: "Last Image",
        imageUrl: data?.imageSrc,
        type: "last-image",
      });
    }
    handleClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center">
          <DialogTitle>{data?.title}</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex flex-col items-center justify-center">
          {data?.videoSrc && (
            <video
              src={data?.videoSrc}
              controls
              className="rounded-xl w-full h-[200px] object-cover cursor-pointer"
            ></video>
          )}
          {data?.imageSrc && (
            <img
              src={data?.imageSrc}
              className="rounded-xl w-full h-[200px] object-cover cursor-pointer"
            />
          )}
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
export default LastScreenImport;
