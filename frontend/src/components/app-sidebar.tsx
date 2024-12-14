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
import { images } from "@/pages/add-images";

// Menu items.
const items = [
  {
    title: "Start",
    url: "/",
    icon: HomeIcon,
  },
  {
    title: "Add Images",
    url: "/add-images",
    icon: ImagePlus,
    images: images,
  },
  {
    title: "Apply Transitions",
    url: "/apply-transitions",
    icon: ArrowLeftRight,
  },
  {
    title: "Preview Video",
    url: "/preview-video",
    icon: Eye,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { isMobile, state } = useSidebar();
  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="my-8">
            <img src={logo} alt="Logo" />
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

              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      location.pathname === item.url &&
                        "bg-sidebar-accent text-sidebar-accent-foreground"
                    )}
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                  <div
                    className={`pl-12 flex flex-col gap-2 ${item.images && images.length > 0 && "my-2"} ${
                      (state === "collapsed" || isMobile) && "hidden"
                    }`}
                  >
                    {item.images &&
                      item.images.map((image, index) => (
                        <Link
                          className="bg-primary-500 text-white rounded-sm p-2"
                          to={`/${image.type}`}
                          key={index}
                        >
                          {image.name}
                        </Link>
                      ))}
                  </div>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
