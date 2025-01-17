import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./App.css";

import Home from "@/pages/home";
import ApplyTransitions from "@/pages/apply-transitions";
import PreviewVideo from "@/pages/preview-video";
import FirstImage from "@/pages/first-image";
import LastImage from "@/pages/last-image";

import { SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { AppSidebar } from "@/components/app-sidebar.tsx";
import { ModalContextProvider } from "@/context/modal-context.tsx";
import ModalProvider from "@/components/providers/modal-providers";
import { Toaster } from "@/components/ui/toaster";
import { EditImageProvider } from "@/context/edit-image-context";
import { FullscreenProvider } from "@/context/full-screen-context";
import FullscreenButton from "@/components/full-screen-button";
import { EditVideoProvider } from "./context/edit-video-context";
import EditVideoPage from "./pages/edit-video";
import StartScreen from "./pages/start-screen";
import FirstLastScreen from "./pages/first-last-screen";
import LastScreen from "./pages/last-screen";

// Shared Layout Component
const Layout: React.FC = () => {
  return (
    <>
      <FullscreenProvider>
        <ModalContextProvider>
          <AppSidebar />
          <main className="w-screen text-gray-200 bg-gray-800 dark">
            <FullscreenButton />
            <SidebarTrigger className="md:hidden" />
            <div className="relative">
              <div className="bg-gradient-to-b from-[rgba(0,170,255,0.3)] to-[rgba(255,255,255,0.5)] absolute top-0 w-full h-48 -z-10"></div>
              <EditVideoProvider>
                <EditImageProvider>
                  <Outlet />
                </EditImageProvider>
              </EditVideoProvider>
              <ModalProvider />
            </div>
            <Toaster />
          </main>
        </ModalContextProvider>
      </FullscreenProvider>
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
      { path: "/start-screen", element: <StartScreen /> },
      { path: "/end-screen", element: <LastScreen /> },
      { path: "/first-video", element: <FirstLastScreen type="first" /> },
      { path: "/last-video", element: <FirstLastScreen type="last" /> },
      { path: "/apply-transitions", element: <ApplyTransitions /> },
      { path: "/preview-video", element: <PreviewVideo /> },
      { path: "/first-image", element: <FirstImage /> },
      { path: "/last-image", element: <LastImage /> },
      { path: "/video/:id", element: <EditVideoPage /> },
    ],
  },
]);

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
