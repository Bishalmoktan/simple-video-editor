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

const ImageImportModal = () => {
  const { setFirstImage, setLastImage } = useAppContext();
  const { isOpen, type, data, closeModal } = useModal();

  const isModalOpen = isOpen && type === "imageImport";

  const handleClose = () => {
    closeModal();
  };

  const handleFirst = () => {
    setFirstImage({
      name: "First Image",
      imageUrl: data?.imageSrc,
      type: "first-image",
    });
    handleClose();
  };

  const handleLast = () => {
    setLastImage({
      name: "Last Image",
      imageUrl: data?.imageSrc,
      type: "last-image",
    });
    handleClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center">
          <DialogTitle>{data?.title}</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex justify-center flex-col items-center">
          <img
            src={data?.imageSrc}
            className="rounded-xl w-[300px] h-[200px] object-cover cursor-pointer"
          />
        </div>
        <DialogFooter className="gap-2">
          <Button className="btn-primary" onClick={handleFirst}>
            Import as First Image
          </Button>
          <Button className="btn-primary" onClick={handleLast}>
            Import as last Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default ImageImportModal;
