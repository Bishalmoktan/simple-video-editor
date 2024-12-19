import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormEvent, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { uploadImage, uploadVideo } from "@/services/api-service";
import { AxiosError, AxiosProgressEvent } from "axios";
import { useModal } from "@/context/modal-context";
import { useAppContext } from "@/context/app-context";
import { formatMilliseconds } from "@/lib/utils";

type Props = {
  title: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  className?: string;
  type: "first-image" | "last-image" | "video";
};

export default function AddImageVideo({
  icon: Icon,
  className,
  title,
  type,
}: Props) {
  const { setFirstImage, setLastImage, setVideos } = useAppContext();
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
      title: `${type === "video" ? "Video" : "Image"} Uploading`,
      isLoading: true,
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
                isLoading: true,
                progress: progress,
              });
            }
          }
        );

        if (response.success) {
          openModal("uploadFile", {
            title: `Video Uploading`,
            isLoading: false,
            progress: 100,
          });
          setTimeout(() => closeModal(), 1500);
          const video = document.createElement("video");
          video.src = response.videoUrl;

          video.onloadedmetadata = () => {
            setVideos((prev) => [
              ...prev,
              {
                name: file.name,
                type: "video",
                duration: `${formatMilliseconds(video?.duration)}`,
                resolution: `${video.videoWidth}x${video.videoHeight}`,
                videoUrl: video.src,
              },
            ]);
          };
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
                isLoading: true,
                progress: progress,
              });
            }
          }
        );

        if (response.success) {
          openModal("uploadFile", {
            title: `Image Uploading`,
            isLoading: false,
            progress: 100,
          });
          setTimeout(() => closeModal(), 1500);
          if (type === "first-image") {
            setFirstImage({
              name: "First Image",
              type,
              imageUrl: response.imageUrl,
            });
          } else {
            setLastImage({
              name: "Last Image",
              type,
              imageUrl: response.imageUrl,
            });
          }
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
        htmlFor={type}
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
        id={type}
        accept={`${type === "video" ? type : "image"}/*`}
      />
    </div>
  );
}
