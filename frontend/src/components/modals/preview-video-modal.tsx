import { useModal } from "@/context/modal-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const PreviewVideoModal = () => {
  const { closeModal, isOpen, type, data } = useModal();
  const isModalOpen = isOpen && type === "previewVideo";

  const handleClose = () => {
    closeModal();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center">
          <DialogTitle>{data?.title} Preview</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex justify-center">
          <video
            src={data?.videoSrc}
            controls
            className="rounded-xl w-[300px] h-[200px] object-cover cursor-pointer"
          ></video>
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default PreviewVideoModal;
