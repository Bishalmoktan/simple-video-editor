import AddImageIcon from "@/assets/icons/add-image";
import AddImageVideo from "@/components/add-image-video";
import PreviewCard from "@/components/preview-card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppContext } from "@/context/app-context";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import TemplateSection from "@/components/template-section";
import useFetchTemplates from "@/hooks/use-fetch-templates";

const StartScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

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
          className="bg-gradient-to-r from-[#00C6DD] via-[#13D8EC] to-[#BEF3FF]"
          type="first-image"
        />
      </div>

      {/* added temporary images section  */}
      <div>
        <h2 className="h2">Add first screen of your video.</h2>
        <div className="flex flex-wrap justify-center my-2 md:justify-start gap-y-8 gap-x-2">
          {firstImage && <PreviewCard {...firstImage} />}
          {!firstImage && <div>No images added.</div>}
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
            <div className="relative">
              <Input
                className="w-full md:w-[300px] rounded-full bg-gray-100 focus:outline-none"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute -translate-y-1/2 top-1/2 right-4 text-slate-400 group-focus-within:text-slate-950" />
            </div>
          </div>
        </TabsList>
        <TabsContent value="image">
          {templateImages && (
            <div>
              <TemplateSection screenType="firstScreen" query={searchQuery} templates={templateImages} />
            </div>
          )}
        </TabsContent>
        <TabsContent value="video">
          {templateVideos && (
            <div>
              <TemplateSection screenType="firstScreen" query={searchQuery} templates={templateVideos} />
            </div>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
};
export default StartScreen;
