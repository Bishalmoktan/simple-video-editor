import AddVideoIcon from "@/assets/icons/add-video";
import AddImageVideo from "@/components/add-image-video";
import PreviewCard, { PreviewCardProps } from "@/components/preview-card";
import temp from "../../public/temp.png";
import TemplateSection, {
  TemplateSectionProps,
} from "@/components/template-section";
import template1 from "@/assets/template1.png";
import template2 from "@/assets/template2.png";
import template3 from "@/assets/template3.png";
import template4 from "@/assets/template4.png";
import template5 from "@/assets/template5.png";
import template6 from "@/assets/template6.png";

const videos: PreviewCardProps[] = [
  {
    type: "video",
    name: "Preview 1",
    resolution: "850x1280",
    duration: "00:07",
    imageUrl: temp,
  },
  {
    type: "video",
    name: "Preview 2",
    resolution: "850x1280",
    duration: "00:07",
    imageUrl: temp,
  },
  {
    type: "video",
    name: "Preview 3",
    resolution: "850x1280",
    duration: "00:07",
    imageUrl: temp,
  },
];

const templates: TemplateSectionProps = {
  title: "Video Templates",
  images: [template1, template2, template3, template4, template5, template6],
};

const Home = () => {
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
      <div>
        <TemplateSection {...templates} />
      </div>
    </section>
  );
};
export default Home;
