import React, { useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CloudUpload } from "lucide-react";
import { axiosClientFormData } from "@/services/api-service";
import { env } from "@/config/env";
import { useModal } from "@/context/modal-context";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { VideoState } from "@/context/edit-video-context";
import { useAppContext } from "@/context/app-context";
import ImageSelectForm from "@/components/image-select-form";
import { useEditImageContext } from "@/context/edit-image-context";
import { useLocation } from "react-router-dom";

type Props = {
  type: "first" | "last";
};

export default function FirstLastScreen({ type }: Props) {
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [enablePreview, setEnablePreview] = useState(false);

  const titleRef = useRef<HTMLDivElement | null>(null);
  const subtitleRef = useRef<HTMLDivElement | null>(null);
  const location = useLocation();
  const { videoUrl } = location.state || {};
  console.log(videoUrl)

  const { setFirstImageVideo, setLastImageVideo } = useAppContext();

  const {
    firstImageState,
    setFirstImageState,
    lastImageState,
    setLastImageState,
  } = useEditImageContext();

  const screenState = type === "first" ? firstImageState : lastImageState;
  const setScreenState =
    type === "first" ? setFirstImageState : setLastImageState;

  const fontFamilyOptions = [
    { text: "Arial", value: "Arial" },
    { text: "Times New Roman", value: "Times New Roman" },
    { text: "Helvetica", value: "Helvetica" },
    { text: "Georgia", value: "Georgia" },
    { text: "Verdana", value: "Verdana" },
  ];

  const { toast } = useToast();
  const { openModal } = useModal();

  const elementStyles: React.CSSProperties = {
    transition: "font-size 0.3s ease",
    display: "flex",
    justifyContent: "start",
    borderRadius: "4px",
    borderStyle: "dotted",
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnablePreview(false);
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setScreenState((prevState) => ({ ...prevState, logo: fileURL }));
    }
  };

  const handleSave = async () => {
    if (!screenState) {
      toast({
        description: "Video state not initialized.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Find the container and handle missing container scenario
    const container = document.getElementById(`capture-area-${type}`);
    if (!container) {
      toast({
        description: "Video container not found.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    try {
      const formData = new FormData();
      const {
        title,
        textColor,
        subtitle,
        subtitlePosition,
        subtitleFontSize,
        titleFontSize,
        titlePosition,
        fontFamily,
        logo,
        logoPosition,
      } = screenState; // Use currentVideoState directly

      // Calculate percentage positions
      const titleXPercent = (titlePosition.x / containerWidth) * 100;
      const titleYPercent = (titlePosition.y / containerHeight) * 100;
      const subtitleXPercent = (subtitlePosition.x / containerWidth) * 100;
      const subtitleYPercent = (subtitlePosition.y / containerHeight) * 100;

      // Calculate font size percentage based on container width (or height, if preferred)
      const titleFontSizePercent =
        (Number(titleFontSize) / containerWidth) * 100;
      const subtitleFontSizePercent =
        (Number(subtitleFontSize) / containerWidth) * 100;

      // Ensure all necessary values are valid before appending
      formData.append("video", videoUrl);
      formData.append("fontFamily", fontFamily);
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("fontColor", textColor || "white");
      formData.append("titleFontSize", titleFontSize);
      formData.append("subtitleFontSize", subtitleFontSize);
      formData.append("titleFontSizePercent", titleFontSizePercent.toString());
      formData.append(
        "subtitleFontSizePercent",
        subtitleFontSizePercent.toString()
      );
      formData.append("titleXPercent", titleXPercent.toString());
      formData.append("titleYPercent", titleYPercent.toString());
      formData.append("subtitleXPercent", subtitleXPercent.toString());
      formData.append("subtitleYPercent", subtitleYPercent.toString());
      formData.append("videoWidth", containerWidth.toString());
      formData.append("videoHeight", containerHeight.toString());

      if (logo) {
        const logoXPercent = (logoPosition.x / containerWidth) * 100;
        const logoYPercent = (logoPosition.y / containerHeight) * 100;
        const logoWidthPercent = (logoPosition.width / containerHeight) * 100;
        const logoHeightPercent = (logoPosition.height / containerHeight) * 100;

        formData.append("image", logo);
        formData.append("logoXPercent", logoXPercent.toString());
        formData.append("logoYPercent", logoYPercent.toString());
        formData.append("logoWidthPercent", logoWidthPercent.toString());
        formData.append("logoHeightPercent", logoHeightPercent.toString());
      }

      // Make the API call
      const res = await axiosClientFormData.post(
        "/api/videos/create-video-text",
        formData
      );
      const url = `${env.API_BASE_URL}${res.data.videoUrl}`;
      setNewVideoUrl(url);
      if (type === "first") {
        setFirstImageVideo(url);
      } else {
        setLastImageVideo(url);
      }

      setEnablePreview(true);
      toast({
        title: "Video generated!",
        description: "Click preview to see the video",
        variant: "success",
      });
    } catch (error) {
      console.error("Error saving video:", error);
      if (error instanceof AxiosError) {
        toast({
          title: "Error saving the video",
          description:
            error.response?.data.error || "Unexpected error occurred.",
          variant: "destructive",
        });
      } else {
        toast({
          description: "Error saving the video",
          variant: "destructive",
        });
      }
    } finally {
      // Reset loading state and borders in finally
      setLoading(false);
      if (titleRef.current && subtitleRef.current) {
        titleRef.current.style.border = "1px solid blue";
        subtitleRef.current.style.border = "1px solid blue";
      }
    }
  };

  const handlePreview = () => {
    openModal("previewVideo", {
      title: "Preview Video",
      videoSrc: `${newVideoUrl || videoUrl}`,
    });
  };

  const setState = (value: string, key: keyof VideoState) => {
    setScreenState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <h2 className="text-center h2">Edit Your Video</h2>
          <div className="flex items-center justify-center my-8">
            <div className="relative ">
              <video
                id={`capture-area-${type}`}
                className="object-cover w-full h-full overflow-hidden rounded-md aspect-video"
                src={videoUrl}
                controls
              />

              {/* Title Element */}
              <Rnd
                position={{
                  x: screenState?.titlePosition.x || 0,
                  y: screenState?.titlePosition.y || 0,
                }}
                onDragStop={(_e, d) => {
                  setEnablePreview(false);
                  setScreenState((prev) => ({
                    ...prev,
                    titlePosition: {
                      ...prev.titlePosition,
                      x: d.x,
                      y: d.y,
                    },
                  }));
                }}
                onResizeStop={(_e, _direction, ref, _delta, position) => {
                  setEnablePreview(false);
                  setScreenState((prev) => ({
                    ...prev,
                    titlePosition: {
                      ...prev.titlePosition,
                      width: parseInt(ref.style.width),
                      height: parseInt(ref.style.height),
                      x: position.x,
                      y: position.y,
                    },
                  }));
                }}
                minWidth={100}
                minHeight={30}
                bounds="parent"
                className="z-10"
              >
                <div
                  style={{
                    ...elementStyles,
                    fontSize: `${screenState?.titleFontSize}px`,
                    width: "100%",
                    height: "100%",
                    color: screenState?.textColor,
                    border: "1px solid blue",
                    fontFamily: `${screenState?.fontFamily}`,
                  }}
                  ref={titleRef}
                  className="break-all"
                >
                  {screenState?.title}
                </div>
              </Rnd>

              {/* Subtitle Element */}
              <Rnd
                position={{
                  x: screenState?.subtitlePosition.x || 0,
                  y: screenState?.subtitlePosition.y || 0,
                }}
                onDragStop={(_e, d) => {
                  setEnablePreview(false);
                  setScreenState((prev) => ({
                    ...prev,
                    subtitlePosition: {
                      ...prev.subtitlePosition,
                      x: d.x,
                      y: d.y,
                    },
                  }));
                }}
                onResizeStop={(_e, _direction, ref, _delta, position) => {
                  setEnablePreview(false);
                  setScreenState((prev) => ({
                    ...prev,
                    subtitlePosition: {
                      ...prev.subtitlePosition,
                      width: parseInt(ref.style.width),
                      height: parseInt(ref.style.height),
                      x: position.x,
                      y: position.y,
                    },
                  }));
                }}
                minWidth={80}
                minHeight={20}
                bounds="parent"
                className="z-10"
              >
                <div
                  style={{
                    ...elementStyles,
                    fontSize: `${screenState?.subtitleFontSize}px`,
                    width: "100%",
                    height: "100%",
                    color: screenState?.textColor,
                    border: "1px solid blue",
                    fontFamily: `${screenState?.fontFamily}`,
                  }}
                  className="break-all"
                  ref={subtitleRef}
                >
                  {screenState?.subtitle}
                </div>
              </Rnd>

              {/* Logo Element */}
              {screenState?.logo && (
                <Rnd
                  position={{
                    x: screenState?.logoPosition.x || 0,
                    y: screenState?.logoPosition.y || 0,
                  }}
                  size={{
                    width: screenState?.logoPosition.width || 100,
                    height: screenState?.logoPosition.height || 100,
                  }}
                  onDragStop={(_e, d) => {
                    setEnablePreview(false);
                    setScreenState((prev) => ({
                      ...prev,
                      logoPosition: {
                        ...prev.logoPosition,
                        x: d.x,
                        y: d.y,
                      },
                    }));
                  }}
                  onResizeStop={(_e, _direction, ref, _delta, position) => {
                    setEnablePreview(false);
                    setScreenState((prev) => ({
                      ...prev,
                      logoPosition: {
                        ...prev.logoPosition,
                        width: parseInt(ref.style.width),
                        height: parseInt(ref.style.height),
                        x: position.x,
                        y: position.y,
                      },
                    }));
                  }}
                  minWidth={30}
                  minHeight={30}
                  maxWidth={500}
                  maxHeight={500}
                  bounds="parent"
                  className="z-10"
                >
                  <img
                    src={URL.createObjectURL(screenState?.logo as Blob)}
                    alt="Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </Rnd>
              )}
            </div>
          </div>

          <div className="flex justify-center gap-2">
            <Button
              onClick={handleSave}
              className="btn-primary"
              disabled={enablePreview}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={handlePreview}
              className="btn-primary"
              disabled={!enablePreview}
            >
              Preview
            </Button>
          </div>
        </div>

        {/* Right side form controls */}
        <div className="flex flex-col items-end gap-3 mt-8 md:mt-0">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="title" className="text-sm text-slate-500">
              Enter Title
            </Label>
            <Input
              type="text"
              id="title"
              placeholder="Type here"
              value={screenState?.title || ""}
              onChange={(e) => {
                setEnablePreview(false);
                setState(e.target.value, "title");
              }}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="subtitle" className="text-sm text-slate-500">
              Enter Subtitle
            </Label>
            <Input
              type="text"
              id="subtitle"
              placeholder="Type here"
              value={screenState?.subtitle || ""}
              onChange={(e) => {
                setEnablePreview(false);
                setState(e.target.value, "subtitle");
              }}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <div className="text-sm text-slate-500">Upload logo</div>
            <div>
              <Label
                htmlFor="logo"
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-white border rounded-md cursor-pointer border-slate-300 hover:bg-slate-50 text-slate-700"
              >
                <CloudUpload className="text-primary-500" />
                <span className="text-sm font-normal text-slate-500">
                  Upload logo
                </span>
              </Label>
              <Input
                onChange={handleLogoUpload}
                className="hidden"
                type="file"
                id="logo"
                accept="image/*"
              />
            </div>
          </div>

          {/* Removed the duration field as per your requirement */}

          <div className="grid grid-cols-2 w-full max-w-sm items-center gap-1.5">
            <div>
              <Label htmlFor="titleFontSize" className="text-sm text-slate-500">
                Title font size
              </Label>

              <Input
                type="text"
                id="titleFontSize"
                value={screenState?.titleFontSize || ""}
                onChange={(e) => {
                  setEnablePreview(false);
                  setState(e.target.value, "titleFontSize");
                }}
              />
            </div>

            <div>
              <Label
                htmlFor="subtitleFontSize"
                className="text-sm text-slate-500"
              >
                Subtitle font size
              </Label>

              <Input
                type="text"
                id="subtitleFontSize"
                value={screenState?.subtitleFontSize || ""}
                onChange={(e) => {
                  setEnablePreview(false);
                  setState(e.target.value, "subtitleFontSize");
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 w-full max-w-sm items-center gap-1.5">
            <div>
              <Label htmlFor="color" className="text-sm text-slate-500">
                Select Color
              </Label>

              <Input
                type="color"
                id="color"
                value={screenState?.textColor || "#000000"}
                onChange={(e) => {
                  setEnablePreview(false);
                  setState(e.target.value, "textColor");
                }}
              />
            </div>
            <div>
              <Label className="text-sm text-slate-500">Select Font</Label>
              <ImageSelectForm
                label="Select Font"
                placeholder="Select Font"
                value={screenState?.fontFamily || "Arial"}
                options={fontFamilyOptions}
                onChange={(value) => {
                  setEnablePreview(false);
                  setState(value, "fontFamily");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
