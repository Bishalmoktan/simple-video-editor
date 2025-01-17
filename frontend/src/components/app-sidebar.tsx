import { Link, useLocation } from "react-router-dom";
import {
  ArrowLeftRight,
  CircleHelp,
  Eye,
  HomeIcon,
  ImagePlus,
  Plus,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import logo from "../../public/logo.png";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/context/app-context";
import { PreviewCardProps } from "./preview-card";
import { useModal } from "@/context/modal-context";

// Menu items.
type ItemType = {
  title: string;
  url: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  firstImage?: PreviewCardProps | null;
  lastImage?: PreviewCardProps | null;
  description: string;
};

const items: ItemType[] = [
  {
    title: "Clips",
    url: "/",
    icon: HomeIcon,
    description:
      "Upload video clips here. Please note that the entire duration of the completed video cannot exceed 240 seconds (4 minutes). For instance, if using 5 different clips, you might restrict each to about 40 seconds. If adding an intro and exit scene, you will be well within the maximum time limit. That’s plenty of time for a talent buyer to assess your performance.",
  },
  {
    title: "Start Scene",
    url: "/start-screen",
    icon: ImagePlus,
    description:
      "You can optionally add a static image here to open the video. For instance, a graphic with your band logo. Or, choose from our image and video templates to create one, and add your logo and text if desired. If uploading your own, create the image at 1280 x 720 pixels to match the video output size.",
  },
  {
    title: "End Scene",
    url: "/end-screen",
    icon: ImagePlus,
    description:
      "You can optionally add a static image here to close the video. For instance, a graphic with your contact information, website URL, etc. Or, choose from our image and video templates to create one, and add your logo and text if desired. If uploading your own image, create the image at 1280 x 720 pixels to match the video output size.",
  },
  {
    title: "Apply Transitions",
    url: "/apply-transitions",
    icon: ArrowLeftRight,
    description:
      "Choose how your video clips should merge here. By default, clips will fade from one into the next. However, there are other transition options from which you can choose. If no transitions are selected, fade will be used by default.",
  },
  {
    title: "Preview Video",
    url: "/preview-video",
    icon: Eye,
    description:
      "After your clips and scenes are merged, you can preview the compiled result here. If satisfied, select the download button to save the video. You can upload the saved video to your Band Breeze profile through the dashboard.",
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { isMobile, state } = useSidebar();
  const { firstImage, lastImage } = useAppContext();
  const { openModal } = useModal();
  items[1].firstImage = firstImage;
  items[1].lastImage = lastImage;

  const handleClick = (title: string, description: string) => {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      openModal("infoModal", {
        title,
        description,
      });
    };
  };

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarContent className="text-white bg-gray-800">
        <SidebarGroup>
          <SidebarGroupLabel className="my-8">
            <Link to={"/"}>
              <img src={logo} alt="Logo" className="" />
            </Link>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="btn-primary active:bg-primary-500 active:text-white"
                >
                  <Link to={"/"}>
                    <Plus />
                    <span>Create New</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {items.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      location.pathname === item.url &&
                        "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                    tooltip={item.description}
                  >
                    <Link to={item.url} className="flex justify-between">
                      <div className="flex items-center justify-center gap-2">
                        <item.icon className="text-inherit" />
                        <span>{item.title}</span>
                      </div>
                      <CircleHelp
                        onClick={handleClick(item.title, item.description)}
                        className="hover:scale-110"
                      />
                    </Link>
                  </SidebarMenuButton>

                  {index === 1 && (
                    <div
                      className={`pl-12 flex flex-col  ${
                        (state === "collapsed" || isMobile) && "hidden"
                      }`}
                    >
                      {firstImage && (
                        <Link
                          className="p-2 my-2 text-white rounded-sm bg-primary-500"
                          to={`/${firstImage.type}`}
                          state={{
                            videoUrl: firstImage.videoUrl,
                          }}
                        >
                          {firstImage.name}
                        </Link>
                      )}
                    </div>
                  )}
                  {index === 2 && (
                    <div
                      className={`pl-12 flex flex-col ${
                        (state === "collapsed" || isMobile) && "hidden"
                      }`}
                    >
                      {lastImage && (
                        <Link
                          className="p-2 my-2 text-white rounded-sm bg-primary-500"
                          to={`/${lastImage.type}`}
                          state={{ videoUrl: lastImage.videoUrl }}
                        >
                          {lastImage.name}
                        </Link>
                      )}
                    </div>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
