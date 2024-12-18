import AddImageIcon from "@/assets/icons/add-image";
import AddImageVideo from "@/components/add-image-video";
import PreviewCard from "@/components/preview-card";
import TemplateSection, {
  TemplateSectionProps,
} from "@/components/template-section";
import { useAppContext } from "@/context/app-context";
import { useEffect, useState } from "react";
import { axiosClient } from "@/services/api-service";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";

const AddImages = () => {
  const [templates, setTemplates] = useState<TemplateSectionProps | null>(null);
  const { toast } = useToast();
  const { firstImage, lastImage } = useAppContext();

  useEffect(() => {
    const getSampleImages = async () => {
      try {
        const res = await axiosClient.get("/api/videos/sample-images");
        setTemplates({
          title: "Image Templates",
          images: res.data.images,
        });
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            description: "Error getting the sample videos",
            variant: "destructive",
          });
        }
      }
    };
    getSampleImages();
  }, []);

  return (
    <section className="px-8 py-4 space-y-8">
      {/* add first and last image section  */}
      <div className="flex justify-center md:justify-start flex-wrap gap-y-16 gap-x-2 my-2">
        <AddImageVideo
          icon={AddImageIcon}
          title="Add First Image"
          className="bg-gradient-to-r from-[#00C6DD] via-[#13D8EC] to-[#BEF3FF]"
          type="first-image"
        />

        <AddImageVideo
          icon={AddImageIcon}
          title="Add Last Image"
          className="bg-gradient-to-r from-[#78E4EF]  via-[#F0ECFD] to-[#FDA8FF]"
          type="last-image"
        />
      </div>

      {/* added temporary images section  */}
      <div>
        <h2 className="h2">Add First and Last Image of your Video</h2>
        <div className="flex justify-center md:justify-start flex-wrap gap-y-8 gap-x-2 my-2">
          {firstImage && <PreviewCard {...firstImage} />}
          {lastImage && <PreviewCard {...lastImage} />}
          {!firstImage && !lastImage && <div>No images added.</div>}
        </div>
      </div>

      {templates && (
        <div>
          <TemplateSection {...templates} />
        </div>
      )}
    </section>
  );
};
export default AddImages;
