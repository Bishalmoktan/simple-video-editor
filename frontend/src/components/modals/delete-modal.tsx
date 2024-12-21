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

const DeleteModal = () => {
  const { setVideos, setTransitions } = useAppContext();
  const { isOpen, type, data, closeModal } = useModal();

  const isModalOpen = isOpen && type === "deleteModal";

  const handleClose = () => {
    closeModal();
  };

  const handleDelete = () => {
    if (data?.videoSrc) {
      setVideos((prev) =>
        prev.filter((video) => video.videoUrl !== data.videoSrc)
      );
      setTransitions([]);
      handleClose();
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center">
          <DialogTitle>
            {data?.title || "Are you sure you want to delete this video?"}
          </DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex justify-center flex-col items-center">
          {data?.videoSrc ? (
            <video
              src={data.videoSrc}
              controls
              className="rounded-xl w-full h-[200px] object-cover cursor-pointer"
            ></video>
          ) : (
            <p className="text-sm text-gray-500">No video to display.</p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handleClose} variant={"secondary"}>
            Cancel
          </Button>
          <Button
            variant={"destructive"}
            onClick={handleDelete}
            disabled={!data?.videoSrc}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
