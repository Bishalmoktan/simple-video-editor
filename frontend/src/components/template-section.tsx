import { Separator } from "@/components/ui/separator";
import { useModal } from "@/context/modal-context";

export type Templates = {
  id?: string;
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

type TemplateSectionProps = {
  templates: Templates;
  query: string;
  screenType: "firstScreen" | "lastScreen"
}

export default function TemplateSection({
  templates,
  query = "",
  screenType
}: TemplateSectionProps) {
  const { openModal } = useModal();
  const filteredImages = templates  && templates.images?.filter((image) =>
    image.name.toLowerCase().includes(query.toLowerCase())
  );

  const filteredVideos =
    templates &&
    templates.videos?.filter((video) =>
      video.name.toLowerCase().includes(query.toLowerCase())
    );

  return (
    <div className="w-full">
    

      <div className="relative">
        <Separator className="mt-2 mb-6 h-[2px] rounded-md" />
        <Separator className="bg-primary-500 absolute top-0 w-[200px] h-[2px] rounded-md" />
      </div>

      <div className="responsive-flex">
        {filteredImages?.map((image, index) => (
          <div
            key={index}
            onClick={() =>
              openModal(screenType, {
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

        {filteredVideos?.map((video, index) => (
          <div
            key={index}
            onClick={() =>
              openModal(screenType, {
                title: video.name,
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

        {filteredImages?.length === 0 && filteredVideos?.length === 0 && (
          <div>No results found for "{query}".</div>
        )}
      </div>
    </div>
  );
}
