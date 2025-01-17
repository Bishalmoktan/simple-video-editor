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
  screenType: "firstScreen" | "lastScreen"
}

export default function TemplateSection({
  templates,
  screenType
}: TemplateSectionProps) {
  const { openModal } = useModal();


  return (
    <div className="w-full">
    

      <div className="relative">
        <Separator className="mt-2 mb-6 h-[2px] rounded-md dark:bg-slate-100" />
        <Separator className="dark:bg-primary-500 absolute top-0 w-[200px] h-[2px] rounded-md" />
      </div>

      <div className="responsive-flex">
        {templates.images?.map((image, index) => (
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

        {templates.videos?.map((video, index) => (
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

        {templates.images?.length === 0 && templates.videos?.length === 0 && (
          <div>No template available.</div>
        )}
      </div>
    </div>
  );
}
