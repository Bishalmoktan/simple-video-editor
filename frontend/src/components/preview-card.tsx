import { useModal } from "@/context/modal-context";

export type PreviewCardProps = {
  type: "image" | "video";
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
  duration,
  imageUrl,
  videoUrl,
}: PreviewCardProps) {
  const { openModal } = useModal();
  const data = {
    title: name,
    videoSrc: videoUrl!,
  };
  return (
    <div
      onClick={() => openModal("previewVideo", data)}
      className="w-[220px] cursor-pointer"
    >
      <div className="p-4 bg-primary-100 rounded-lg relative">
        <img src={imageUrl} alt={name} className="rounded-lg" />
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
