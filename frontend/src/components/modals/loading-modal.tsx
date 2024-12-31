import { useModal } from "@/context/modal-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { LoaderCircle } from "lucide-react";

const LoadingModal = () => {
  const { isOpen, type, data } = useModal();

  const isModalOpen = isOpen && type === "loading";

  return (
    <Dialog open={isModalOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="text-center">
          <DialogTitle>{data?.title}</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex justify-center flex-col items-center">
          <LoaderCircle className="size-10 animate-spin" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default LoadingModal;
