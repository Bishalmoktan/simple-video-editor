import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormEvent, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { uploadImage, uploadVideo } from "@/services/api-service";
import { AxiosError, AxiosProgressEvent } from "axios";
import { useModal } from "@/context/modal-context";

type Props = {
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  className?: string;
  type: "image" | "video";
};

export default function AddImageVideo({
  icon: Icon,
  className,
  title,
  type,
}: Props) {
  const { openModal, closeModal } = useModal();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: FormEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) {
      toast({ description: "No file is selected", variant: "destructive" });
      return;
    }

    openModal("uploadFile", {
      title: `${type === "image" ? "Image" : "Video"} Uploading`,
      isUploading: true,
      progress: 0,
    });

    if (type === "video") {
      try {
        const response = await uploadVideo(
          file,
          (event: AxiosProgressEvent) => {
            if (event.total) {
              const progress = Math.round((event.loaded / event.total) * 100);
              openModal("uploadFile", {
                title: `Video Uploading`,
                isUploading: true,
                progress: progress,
              });
            }
          }
        );

        if (response.success) {
          openModal("uploadFile", {
            title: `Video Uploading`,
            isUploading: false,
            progress: 100,
          });
          setTimeout(() => closeModal(), 1500);
          console.log(response);
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          closeModal();
          toast({
            title: "Failure",
            description: err.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Failure",
            description: "Something went wrong!",
            variant: "destructive",
          });
        }
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } else {
      try {
        const response = await uploadImage(
          file,
          (event: AxiosProgressEvent) => {
            if (event.total) {
              const progress = Math.round((event.loaded / event.total) * 100);
              openModal("uploadFile", {
                title: `Image Uploading`,
                isUploading: true,
                progress: progress,
              });
            }
          }
        );

        if (response.success) {
          openModal("uploadFile", {
            title: `Image Uploading`,
            isUploading: false,
            progress: 100,
          });
          setTimeout(() => closeModal(), 1500);
          console.log(response);
        }
      } catch (err) {
        if (err instanceof AxiosError) {
          closeModal();
          toast({
            title: "Failure",
            description: err.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Failure",
            description: "Something went wrong!",
            variant: "destructive",
          });
        }
      } finally {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  return (
    <div>
      <Label
        htmlFor="logo"
        className={`flex flex-col rounded-lg cursor-pointer  w-[220px] h-[125px] justify-center items-center space-x-2 ${className} shadow-[0_0_7.77px_rgba(220,240,255,0.25)]`}
      >
        <Icon className="size-10" />
        <span>{title}</span>
      </Label>
      <Input
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        type="file"
        id="logo"
        accept={`${type}/*`}
      />
    </div>
  );
}
