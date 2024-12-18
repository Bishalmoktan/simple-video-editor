import { useModal } from "@/context/modal-context";
import { useNavigate } from "react-router-dom";

export type PreviewCardProps = {
  type: "first-image" | "last-image" | "video";
  name: string;
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
}: PreviewCardProps) {
  const { openModal } = useModal();
  const navigate = useNavigate();
  const data = {
    title: name,
    videoSrc: videoUrl!,
  };

  const handleClick = () => {
    if (type === "video") {
      openModal("previewVideo", data);
    } else {
      navigate(`/${type}`);
    }
  };

  return (
    <div onClick={handleClick} className="w-[220px] cursor-pointer">
      <div className="p-4 bg-primary-100 rounded-lg relative">
        {type === "video" ? (
          videoUrl && (
            <video
              src={videoUrl}
              className="rounded-xl w-[300px] h-[200px] object-cover cursor-pointer"
            />
          )
        ) : (
          <img src={imageUrl} alt={name} className="rounded-lg" />
        )}
        {duration && (
          <div className="bg-gray-900 text-white absolute bg-opacity-60 p-1 text-xs left-6 bottom-2 rounded-md">
            {duration}
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
