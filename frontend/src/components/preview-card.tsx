import { useModal } from "@/context/modal-context";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export type PreviewCardProps = {
  type: "first-image" | "last-image" | "video";
  name: string;
  index?: number;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, index: number) => void;
  onDragEnd?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent, index: number) => void;
  resolution?: string;
  duration?: string;
  imageUrl?: string;
  videoUrl?: string;
};

export default function PreviewCard({
  type,
  name,
  resolution,
  imageUrl,
  videoUrl,
  duration,
  index = -1,
  draggable = false,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: PreviewCardProps) {
  const { openModal } = useModal();
  const navigate = useNavigate();

  const handlePreviewClick = (e: React.MouseEvent) => {
    // Prevent click when dragging
    if (e.defaultPrevented) return;

    if (type === "video" && videoUrl) {
      openModal("previewVideo", {
        title: name,
        videoSrc: videoUrl,
      });
    } else {
      navigate(`/${type}`);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (type === "video" && videoUrl) {
      openModal("deleteModal", {
        title: "Delete video",
        videoSrc: videoUrl,
      });
    }
  };

  return (
    <div
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, index)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        onDragOver?.(e);
      }}
      onDrop={(e) => onDrop?.(e, index)}
      onClick={handlePreviewClick}
      className={`relative cursor-pointer transition-all duration-200`}
    >
      <div className="p-4 bg-primary-100 rounded-lg relative mb-2">
        {type === "video" ? (
          videoUrl ? (
            <video
              src={videoUrl}
              className="rounded-xl w-[250px] h-[150px] object-cover"
            />
          ) : (
            <p className="text-sm text-gray-500">No video available</p>
          )
        ) : (
          <img
            src={imageUrl || "/placeholder.png"}
            alt={name}
            className="rounded-lg w-[250px] h-[150px] object-cover"
          />
        )}
        {duration && (
          <div className="bg-gray-900 text-white absolute bg-opacity-60 p-1 text-xs left-6 bottom-4 rounded-md">
            {duration}
          </div>
        )}
        {type === "video" && (
          <div
            className="absolute bottom-4 right-5"
            onClick={handleDeleteClick}
          >
            <div className="bg-red-500 p-2 rounded-full w-fit h-fit hover:scale-105 hover:bg-red-600">
              <Trash2 className="text-white size-4" />
            </div>
          </div>
        )}
      </div>
      <p>
        {type === "video" && "Name: "} {name}
      </p>
      {resolution && <p>Resolution: {resolution}</p>}
    </div>
  );
}
