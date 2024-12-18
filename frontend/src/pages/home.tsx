import AddVideoIcon from "@/assets/icons/add-video";
import AddImageVideo from "@/components/add-image-video";
import PreviewCard from "@/components/preview-card";
import TemplateSection, {
  TemplateSectionProps,
} from "@/components/template-section";
import { useAppContext } from "@/context/app-context";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { axiosClient } from "@/services/api-service";

const Home = () => {
  const [templates, setTemplates] = useState<TemplateSectionProps | null>(null);

  const { videos } = useAppContext();
  const { toast } = useToast();

  useEffect(() => {
    const getSampleVideos = async () => {
      try {
        const res = await axiosClient.get("/api/videos/sample-videos");
        setTemplates({
          title: "Video Templates",
          videos: res.data.videos,
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
    getSampleVideos();
  }, []);

  return (
    <section className="px-8 py-4 space-y-8">
      {/* add video section  */}
      <div className="">
        <AddImageVideo
          icon={AddVideoIcon}
          title="Add Video"
          className="bg-gradient-to-r from-[#00C6DD] via-[#13D8EC] to-[#BEF3FF]"
          type="video"
        />
      </div>

      {/* added temporary videos  */}
      <div>
        <h2 className="h2">Create your first video in minutes</h2>
        <div className="responsive-flex">
          {videos.map((video, index) => (
            <PreviewCard key={index} {...video} />
          ))}
          {videos.length === 0 && <div>No videos added.</div>}
        </div>
      </div>

      {/* template sections */}
      {templates && (
        <div>
          <TemplateSection {...templates} />
        </div>
      )}
    </section>
  );
};
export default Home;
