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
    description: "Add videos",
  },
  {
    title: "Start Screen",
    url: "/start-screen",
    icon: ImagePlus,
    description: "Add image or video for the first screen",
  },
  {
    title: "End Screen",
    url: "/end-screen",
    icon: ImagePlus,
    description: "Add image or video for the end screen",
  },
  {
    title: "Apply Transitions",
    url: "/apply-transitions",
    icon: ArrowLeftRight,
    description: "Apply transitions to videos",
  },
  {
    title: "Preview Video",
    url: "/preview-video",
    icon: Eye,
    description: "Merge video and watch preview",
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
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="my-8">
            <Link to={"/"}>
              <img src={logo} alt="Logo" />
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
