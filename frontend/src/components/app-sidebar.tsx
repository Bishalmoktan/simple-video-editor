import { Link, useLocation } from "react-router-dom";
import { ArrowLeftRight, Eye, HomeIcon, ImagePlus, Plus } from "lucide-react";

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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
    title: "Start",
    url: "/",
    icon: HomeIcon,
    description: "Add videos",
  },
  {
    title: "Add Images",
    url: "/add-images",
    icon: ImagePlus,
    description: "Add first and last image",
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
  items[1].firstImage = firstImage;
  items[1].lastImage = lastImage;

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
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          asChild
                          className={cn(
                            location.pathname === item.url &&
                              "bg-sidebar-accent text-sidebar-accent-foreground"
                          )}
                          tooltip={item.description}
                        >
                          <Link to={item.url}>
                            <item.icon />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="z-[999999]">
                        <p>{item.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  {index === 1 && (
                    <div
                      className={`pl-12 flex flex-col ${item.firstImage && "my-2"} ${
                        (state === "collapsed" || isMobile) && "hidden"
                      }`}
                    >
                      {firstImage && (
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                className="bg-primary-500 text-white rounded-sm p-2"
                                to={`/${firstImage.type}`}
                              >
                                {firstImage.name}
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="z-[999999]">
                              <p>Edit and convert first image to video.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                      {lastImage && (
                        <TooltipProvider delayDuration={100}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Link
                                className="bg-primary-500 text-white rounded-sm p-2 mt-2"
                                to={`/${lastImage.type}`}
                              >
                                {lastImage.name}
                              </Link>
                            </TooltipTrigger>
                            <TooltipContent side="right" className="z-[999999]">
                              <p>Edit and convert last image to video.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
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
