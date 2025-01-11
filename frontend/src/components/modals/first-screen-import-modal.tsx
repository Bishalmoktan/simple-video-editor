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

const FirstScreenImport = () => {
  const { setFirstImage } = useAppContext();
  const { isOpen, type, data, closeModal } = useModal();

  const isModalOpen = isOpen && type === "firstScreen";

  const handleClose = () => {
    closeModal();
  };

  const handleImport = () => {
    if (data?.videoSrc) {
      const video = document.createElement("video");
      video.src = data.videoSrc; 
      video.onloadedmetadata = () => {
        setFirstImage({
          name: "Start Screen",
          videoUrl: video.src,
          type: "first-video",
        });
      };

      video.load();
    } else {
      setFirstImage({
        name: "First Image",
        imageUrl: data?.imageSrc,
        type: "first-image",
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
export default FirstScreenImport;
