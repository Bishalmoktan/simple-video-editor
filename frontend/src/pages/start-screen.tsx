import AddImageIcon from "@/assets/icons/add-image";
import AddImageVideo from "@/components/add-image-video";
import PreviewCard from "@/components/preview-card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/app-context";
import TemplateSection from "@/components/template-section";
import useFetchTemplates from "@/hooks/use-fetch-templates";

const StartScreen = () => {

  const templateImages = useFetchTemplates(
    "/api/videos/sample-images",
    "Image Templates"
  );
  const templateVideos = useFetchTemplates(
    "/api/videos/sample-videos",
    "Video Templates"
  );
  const { firstImage } = useAppContext();

  return (
    <section className="px-8 py-4 space-y-8">
      {/* add first and last image section  */}
      <div className="flex flex-wrap justify-center my-2 md:justify-start gap-y-16 gap-x-2">
        <AddImageVideo
          icon={AddImageIcon}
          title="Add First Image"
          className="bg-gradient-to-r from-[#008080] via-[#66b3b3] to-[#99cccc] text-black"
          type="first-image"
        />
      </div>

      {/* added temporary images section  */}
      <div>
        <h2 className="h2">Add first scene of your video</h2>
        <div className="flex flex-wrap justify-center my-2 md:justify-start gap-y-8 gap-x-2">
          {firstImage && <PreviewCard {...firstImage} />}
          {!firstImage && <div>No medias added.</div>}
        </div>
      </div>

      <Tabs defaultValue="image">
        <TabsList className="w-full bg-transparent">
          <div className="flex flex-col justify-between w-full gap-2 md:flex-row">
            <div>
              <TabsTrigger value="image" className="h2">
                Image Templates
              </TabsTrigger>
              <TabsTrigger value="video" className="h2">
                Video Templates
              </TabsTrigger>
            </div>
          </div>
        </TabsList>
        <TabsContent value="image">
          {templateImages && (
            <div>
              <TemplateSection
                screenType="firstScreen"
                templates={templateImages}
              />
            </div>
          )}
        </TabsContent>
        <TabsContent value="video">
          {templateVideos && (
            <div>
              <TemplateSection
                screenType="firstScreen"
                templates={templateVideos}
              />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};
export default StartScreen;
