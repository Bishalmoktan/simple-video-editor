import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./App.css";

import Home from "@/pages/home";
import AddImages from "@/pages/add-images";
import ApplyTransitions from "@/pages/apply-transitions";
import PreviewVideo from "@/pages/preview-video";
import FirstImage from "@/pages/first-image";
import LastImage from "@/pages/last-image";

import { SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import { ModalContextProvider } from "@/context/modal-context.tsx";
import ModalProvider from "@/components/providers/modal-providers";
import { Toaster } from "@/components/ui/toaster";

// Shared Layout Component
const Layout: React.FC = () => {
  return (
    <>
      <ModalContextProvider>
        <AppSidebar />
        <main className="w-screen">
          <SidebarTrigger />
          <div className="relative">
            <div className="bg-gradient-to-b from-[rgba(0,170,255,0.3)] to-[rgba(255,255,255,0.5)] absolute top-0 w-full h-48 -z-10"></div>
            <Outlet />
            <ModalProvider />
          </div>
          <Toaster />
        </main>
      </ModalContextProvider>
    </>
  );
};

// Define routes with a shared layout
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "/add-images", element: <AddImages /> },
      { path: "/apply-transitions", element: <ApplyTransitions /> },
      { path: "/preview-video", element: <PreviewVideo /> },
      { path: "/first-image", element: <FirstImage /> },
      { path: "/last-image", element: <LastImage /> },
    ],
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
