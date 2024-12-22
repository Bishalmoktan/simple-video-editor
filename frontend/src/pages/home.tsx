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

  const { videos, setVideos } = useAppContext();
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

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.classList.remove("opacity-50");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));

    if (dragIndex === dropIndex) return;

    const newVideos = [...videos];
    const [draggedVideo] = newVideos.splice(dragIndex, 1);
    newVideos.splice(dropIndex, 0, draggedVideo);

    setVideos(newVideos);
  };

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
            <PreviewCard
              key={index}
              {...video}
              index={index}
              draggable={true}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
            />
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
