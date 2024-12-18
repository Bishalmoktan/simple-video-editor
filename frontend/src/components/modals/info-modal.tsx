import { useModal } from "@/context/modal-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const InfoModal = () => {
  const { closeModal, isOpen, type, data } = useModal();
  const isModalOpen = isOpen && type === "infoModal";

  const handleClose = () => {
    closeModal();
  };
  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center">
          <DialogTitle>{data?.title}</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex justify-center">{data?.description}</div>
      </DialogContent>
    </Dialog>
  );
};
export default InfoModal;
