import AddImageIcon from "@/assets/icons/add-image";
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
    type: "image",
    name: "First Image",
    imageUrl: temp,
  },
  {
    type: "image",
    name: "Last Image",
    imageUrl: temp,
  },
];

const templates: TemplateSectionProps = {
  title: "Image Templates",
  images: [template1, template2, template3, template4, template5, template6],
};

const AddImages = () => {
  return (
    <section className="px-8 py-4 space-y-8">
      {/* add first and last image section  */}
      <div className="flex justify-center md:justify-start flex-wrap gap-y-16 gap-x-2 my-2">
        <AddImageVideo
          icon={AddImageIcon}
          title="Add First Image"
          className="bg-gradient-to-r from-[#00C6DD] via-[#13D8EC] to-[#BEF3FF]"
        />

        <AddImageVideo
          icon={AddImageIcon}
          title="Add Last Image"
          className="bg-gradient-to-r from-[#78E4EF]  via-[#F0ECFD] to-[#FDA8FF]"
        />
      </div>

      {/* added temporary images section  */}
      <div>
        <h2 className="h2">Add First and Last Image of your Video</h2>
        <div className="flex justify-center md:justify-start flex-wrap gap-y-8 gap-x-2 my-2">
          {videos.map((video, index) => (
            <PreviewCard key={index} {...video} />
          ))}
        </div>
      </div>

      <div>
        <TemplateSection {...templates} />
      </div>
    </section>
  );
};
export default AddImages;
