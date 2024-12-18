import { useEffect, useState } from "react";
import { useModal } from "@/context/modal-context";
import { FaCheckCircle } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import CircularProgress from "@/assets/icons/circular-progress";

const UploadProgressModal = () => {
  const { isOpen, type, data } = useModal();
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  const isModalOpen = isOpen && type === "uploadFile";

  useEffect(() => {
    if (data?.progress) {
      setProgress(data.progress);
    }
    if (data?.isLoading === false) {
      setIsComplete(true);
    }

    if (!data) {
      setIsComplete(false);
    }
  }, [data]);

  return (
    <Dialog open={isModalOpen}>
      <DialogContent className="sm:max-w-[425px]" hidden>
        <DialogHeader className="text-center">
          <DialogTitle>{data?.title}</DialogTitle>
        </DialogHeader>
        <Separator />
        <div className="flex justify-center flex-col items-center">
          {!isComplete ? (
            <CircularProgress percentage={progress} />
          ) : (
            <>
              <FaCheckCircle className="text-green-500 transition-all duration-300 ease-in-out opacity-100 size-10" />
              <span>Upload Complete</span>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
export default UploadProgressModal;
