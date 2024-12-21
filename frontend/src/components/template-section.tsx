import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useModal } from "@/context/modal-context";

export type TemplateSectionProps = {
  title: string;
  images?: {
    imageUrl: string;
    name: string;
  }[];
  videos?: {
    videoUrl: string;
    name: string;
  }[];
};

export default function TemplateSection({
  title,
  images = [],
  videos = [],
}: TemplateSectionProps) {
  const { openModal } = useModal();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredImages = images.filter((image) =>
    image.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVideos = videos.filter((video) =>
    video.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between gap-2">
        <h2 className="h2">{title}</h2>
        <div className="relative group">
          <Input
            className="w-full md:w-[300px] rounded-full bg-gray-100 focus:outline-none"
            placeholder="Search anything..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 group-focus-within:text-slate-950" />
        </div>
      </div>

      <div className="relative">
        <Separator className="mt-2 mb-6 h-[2px] rounded-md" />
        <Separator className="bg-primary-500 absolute top-0 w-[200px] h-[2px] rounded-md" />
      </div>

      <div className="responsive-flex">
        {filteredImages.map((image, index) => (
          <div
            key={index}
            onClick={() =>
              openModal("imageImport", {
                title: "Import Image",
                imageSrc: image.imageUrl,
              })
            }
          >
            <img
              className="rounded-xl w-[200px] h-[250px] object-cover cursor-pointer"
              src={image.imageUrl}
              alt={image.name}
            />
          </div>
        ))}

        {filteredVideos.map((video, index) => (
          <div
            key={index}
            onClick={() =>
              openModal("videoImport", {
                title: "Import Video",
                videoSrc: video.videoUrl,
              })
            }
          >
            <video
              src={video.videoUrl}
              className="rounded-xl w-[200px] h-[250px] object-cover cursor-pointer"
            />
          </div>
        ))}

        {filteredImages.length === 0 && filteredVideos.length === 0 && (
          <div>No results found for "{searchQuery}".</div>
        )}
      </div>
    </div>
  );
}
