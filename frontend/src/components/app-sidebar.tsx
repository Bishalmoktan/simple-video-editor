import { ArrowLeftRight, Eye, HomeIcon, ImagePlus } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import logo from "../../public/logo.png";

// Menu items.
const items = [
  {
    title: "Start",
    url: "#",
    icon: HomeIcon,
  },
  {
    title: "Add Images",
    url: "#",
    icon: ImagePlus,
  },
  {
    title: "Apply Transitions",
    url: "#",
    icon: ArrowLeftRight,
  },
  {
    title: "Preview Video",
    url: "#",
    icon: Eye,
  },
];

export function AppSidebar() {
  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="my-8">
            <img src={logo} alt="Logo" />
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div>
                      <item.icon />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
