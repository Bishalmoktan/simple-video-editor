import React, { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageSelectForm from "./image-select-form";
import { CloudUpload } from "lucide-react";
import { axiosClientFormData } from "@/services/api-service";
import { env } from "@/config/env";
import { useModal } from "@/context/modal-context";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import {
  Position,
  useEditVideoContext,
  VideoState,
} from "@/context/edit-video-context";
import { useAppContext } from "@/context/app-context";

type Props = {
  index: string;
  videoUrl: string;
};

export default function EditVideo({ index, videoUrl }: Props) {
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [enablePreview, setEnablePreview] = useState(false);

  const titleRef = useRef<HTMLDivElement | null>(null);
  const subtitleRef = useRef<HTMLDivElement | null>(null);

  const fontFamilyOptions = [
    { text: "Arial", value: "Arial" },
    { text: "Times New Roman", value: "Times New Roman" },
    { text: "Helvetica", value: "Helvetica" },
    { text: "Georgia", value: "Georgia" },
    { text: "Verdana", value: "Verdana" },
  ];

  const { toast } = useToast();
  const { openModal } = useModal();
  const { editVideoState, setEditVideoState } = useEditVideoContext();
  const { setVideos } = useAppContext();

  const elementStyles: React.CSSProperties = {
    transition: "font-size 0.3s ease",
    display: "flex",
    justifyContent: "start",
    borderRadius: "4px",
    borderStyle: "dotted",
  };

  useEffect(() => {
    const idx = parseInt(index, 10);
    if (isNaN(idx)) {
      console.error("Invalid index provided:", index);
      return;
    }

    if (!editVideoState[idx]) {
      const newVideoState: VideoState = {
        title: "New Video Title",
        subtitle: "New Subtitle",
        logo: null,
        fontFamily: "Arial",
        titleFontSize: "24",
        subtitleFontSize: "18",
        textColor: "#000000",
        titlePosition: { x: 10, y: 20, width: 300, height: 50 },
        subtitlePosition: { x: 10, y: 80, width: 300, height: 30 },
        logoPosition: { x: 550, y: 220, width: 50, height: 50 },
      };

      setEditVideoState((prev) => {
        const newState = [...prev];
        newState[idx] = newVideoState;
        return newState;
      });
    }
  }, [index, editVideoState, setEditVideoState]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnablePreview(false);
    const file = e.target.files?.[0];
    if (file) {
      const idx = parseInt(index, 10);
      if (isNaN(idx)) {
        console.error("Invalid index provided:", index);
        return;
      }

      setEditVideoState((prev) => {
        const newState = [...prev];
        const currentVideoState = newState[idx] || {
          title: "",
          subtitle: "",
          logo: file,
          fontFamily: "Arial",
          titleFontSize: "24px",
          subtitleFontSize: "18px",
          textColor: "#000000",
          titlePosition: { x: 10, y: 20, width: 300, height: 50 },
          subtitlePosition: { x: 10, y: 80, width: 300, height: 30 },
          logoPosition: { x: 90, y: 90, width: 50, height: 50 },
        };

        newState[idx] = {
          ...currentVideoState,
          logo: file,
        };

        return newState;
      });
    }
  };

  const handleSave = async () => {
    const idx = parseInt(index, 10);
    if (isNaN(idx)) {
      toast({
        description: "Invalid video index.",
        variant: "destructive",
      });
      return;
    }

    const currentVideoState = editVideoState[idx];
    if (!currentVideoState) {
      toast({
        description: "Video state not initialized.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    // Find the container and handle missing container scenario
    const container = document.getElementById(`capture-area-${index}`);
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
      } = currentVideoState; // Use currentVideoState directly

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
      setNewVideoUrl(res.data.videoUrl);
      setVideos((prev) =>
        prev.map((video) =>
          video.index === Number(index)
            ? {
                ...video,
                newVideoUrl: `${env.API_BASE_URL}${res.data.videoUrl}`,
              }
            : video
        )
      );

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
      videoSrc: `${env.API_BASE_URL}${newVideoUrl || videoUrl}`,
    });
  };

  const setState = (value: string, key: keyof VideoState) => {
    const idx = parseInt(index, 10);
    if (isNaN(idx)) {
      console.error("Invalid index provided:", index);
      return;
    }

    setEditVideoState((prev) => {
      const newState = [...prev];
      const currentVideoState = newState[idx] || {
        title: "",
        subtitle: "",
        logo: null,
        fontFamily: "Arial",
        titleFontSize: "24px",
        subtitleFontSize: "18px",
        textColor: "#000000",
        titlePosition: { x: 10, y: 20, width: 300, height: 50 },
        subtitlePosition: { x: 10, y: 80, width: 300, height: 30 },
        logoPosition: { x: 5, y: 5, width: 50, height: 50 },
      };

      newState[idx] = {
        ...currentVideoState,
        [key]: value,
      };

      return newState;
    });
  };

  const setPosition = (
    positionKey: keyof VideoState,
    newPosition: Partial<Position>
  ) => {
    const idx = parseInt(index, 10);
    if (isNaN(idx) || idx < 0 || idx >= editVideoState.length) {
      console.error("Invalid index provided:", index);
      return;
    }

    setEditVideoState((prev) => {
      const newState = [...prev];
      const currentVideoState = newState[idx];

      if (currentVideoState) {
        const existingPosition = currentVideoState[positionKey];

        // Validate that the existing position is an object
        if (
          existingPosition &&
          typeof existingPosition === "object" &&
          !Array.isArray(existingPosition)
        ) {
          newState[idx] = {
            ...currentVideoState,
            [positionKey]: {
              ...existingPosition,
              ...newPosition,
            },
          };
        } else {
          console.warn(
            `Expected an object at positionKey "${String(positionKey)}", but got:`,
            existingPosition
          );

          // Optionally initialize the position key if it doesn't exist
          newState[idx] = {
            ...currentVideoState,
            [positionKey]: newPosition, // Initialize with `newPosition`
          };
        }
      } else {
        console.error("No video state found at index:", idx);
      }

      return newState;
    });
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <h2 className="text-center h2">Edit Your Video</h2>
          <div className="flex items-center justify-center my-8">
            <div className="relative ">
              <video
                id={`capture-area-${index}`}
                className="object-cover w-full h-full overflow-hidden rounded-md aspect-video"
                src={videoUrl}
                controls
              />

              {/* Title Element */}
              <Rnd
                position={{
                  x: editVideoState[parseInt(index, 10)]?.titlePosition.x || 0,
                  y: editVideoState[parseInt(index, 10)]?.titlePosition.y || 0,
                }}
                onDragStop={(_e, d) => {
                  setEnablePreview(false);
                  setPosition("titlePosition", { x: d.x, y: d.y });
                }}
                onResizeStop={(_e, _direction, ref, _delta, position) => {
                  setEnablePreview(false);
                  setPosition("titlePosition", {
                    width: parseInt(ref.style.width),
                    height: parseInt(ref.style.height),
                    x: position.x,
                    y: position.y,
                  });
                }}
                minWidth={100}
                minHeight={30}
                bounds="parent"
                className="z-10"
              >
                <div
                  style={{
                    ...elementStyles,
                    fontSize: `${editVideoState[parseInt(index, 10)]?.titleFontSize}px`,
                    width: "100%",
                    height: "100%",
                    color: editVideoState[parseInt(index, 10)]?.textColor,
                    border: "1px solid blue",
                    fontFamily: `${editVideoState[parseInt(index, 10)]?.fontFamily}`,
                  }}
                  ref={titleRef}
                  className="break-all"
                >
                  {editVideoState[parseInt(index, 10)]?.title}
                </div>
              </Rnd>

              {/* Subtitle Element */}
              <Rnd
                position={{
                  x:
                    editVideoState[parseInt(index, 10)]?.subtitlePosition.x ||
                    0,
                  y:
                    editVideoState[parseInt(index, 10)]?.subtitlePosition.y ||
                    0,
                }}
                onDragStop={(_e, d) => {
                  setEnablePreview(false);
                  setPosition("subtitlePosition", { x: d.x, y: d.y });
                }}
                onResizeStop={(_e, _direction, ref, _delta, position) => {
                  setEnablePreview(false);
                  setPosition("subtitlePosition", {
                    width: parseInt(ref.style.width),
                    height: parseInt(ref.style.height),
                    x: position.x,
                    y: position.y,
                  });
                }}
                minWidth={80}
                minHeight={20}
                bounds="parent"
                className="z-10"
              >
                <div
                  style={{
                    ...elementStyles,
                    fontSize: `${editVideoState[parseInt(index, 10)]?.subtitleFontSize}px`,
                    width: "100%",
                    height: "100%",
                    color: editVideoState[parseInt(index, 10)]?.textColor,
                    border: "1px solid blue",
                    fontFamily: `${editVideoState[parseInt(index, 10)]?.fontFamily}`,
                  }}
                  className="break-all"
                  ref={subtitleRef}
                >
                  {editVideoState[parseInt(index, 10)]?.subtitle}
                </div>
              </Rnd>

              {/* Logo Element */}
              {editVideoState[parseInt(index, 10)]?.logo && (
                <Rnd
                  position={{
                    x: editVideoState[parseInt(index, 10)]?.logoPosition.x || 0,
                    y: editVideoState[parseInt(index, 10)]?.logoPosition.y || 0,
                  }}
                  size={{
                    width:
                      editVideoState[parseInt(index, 10)]?.logoPosition.width ||
                      100,
                    height:
                      editVideoState[parseInt(index, 10)]?.logoPosition
                        .height || 100,
                  }}
                  onDragStop={(_e, d) => {
                    setEnablePreview(false);
                    setPosition("logoPosition", { x: d.x, y: d.y });
                  }}
                  onResizeStop={(_e, _direction, ref, _delta, position) => {
                    setEnablePreview(false);
                    setPosition("logoPosition", {
                      width: parseInt(ref.style.width),
                      height: parseInt(ref.style.height),
                      x: position.x,
                      y: position.y,
                    });
                  }}
                  minWidth={30}
                  minHeight={30}
                  maxWidth={500}
                  maxHeight={500}
                  bounds="parent"
                  className="z-10"
                >
                  <img
                    src={URL.createObjectURL(
                      editVideoState[parseInt(index, 10)]?.logo as Blob
                    )}
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
              value={editVideoState[parseInt(index, 10)]?.title || ""}
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
              value={editVideoState[parseInt(index, 10)]?.subtitle || ""}
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
                className="flex items-center justify-center gap-2 px-4 py-2 text-sm border rounded-md cursor-pointer "
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


          <div className="grid grid-cols-2 w-full max-w-sm items-center gap-1.5">
            <div>
              <Label htmlFor="titleFontSize" className="text-sm text-slate-500">
                Title font size
              </Label>

              <Input
                type="text"
                id="titleFontSize"
                value={editVideoState[parseInt(index, 10)]?.titleFontSize || ""}
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
                value={
                  editVideoState[parseInt(index, 10)]?.subtitleFontSize || ""
                }
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
                value={
                  editVideoState[parseInt(index, 10)]?.textColor || "#000000"
                }
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
                value={
                  editVideoState[parseInt(index, 10)]?.fontFamily || "Arial"
                }
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
