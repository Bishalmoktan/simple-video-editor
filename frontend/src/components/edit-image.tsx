import { useState } from "react";
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
import { useAppContext } from "@/context/app-context";
import { useEditImageContext } from "@/context/edit-image-context";

type Props = {
  type: "lastImage" | "firstImage";
  imageUrl: string;
};

export default function EditImage({ type, imageUrl }: Props) {
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [enablePreview, setEnablePreview] = useState(false);

  const { setFirstImageVideo, setLastImageVideo } = useAppContext();
  const {
    firstImageState,
    setFirstImageState,
    lastImageState,
    setLastImageState,
  } = useEditImageContext();

  const imageState = type === "firstImage" ? firstImageState : lastImageState;
  const setImageState =
    type === "firstImage" ? setFirstImageState : setLastImageState;

  const fontFamilyOptions = [
    { text: "Arial", value: "Arial" },
    { text: "Times New Roman", value: "Times New Roman" },
    { text: "Helvetica", value: "Helvetica" },
    { text: "Georgia", value: "Georgia" },
    { text: "Verdana", value: "Verdana" },
  ];

  const { toast } = useToast();
  const { openModal } = useModal();
  const image = type === "firstImage" ? " First " : " Last ";

  // Common styles for elements
  const elementStyles = {
    transition: "font-size 0.3s ease",
    display: "flex",
    justifyContent: "start",
    borderRadius: "4px",
    border: "1px solid blue",
    borderStyle: "dotted",
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnablePreview(false);
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setImageState((prevState) => ({ ...prevState, logo: fileURL }));
    }
  };

  const handleSave = async () => {
    if (imageState.duration === "0") {
      toast({
        description: "Give duration at least 1 sec",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      // Convert positions to percentages relative to container size
      const container = document.getElementById("capture-area")!;
      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      const titlePositionPercent = {
        x: (imageState.titlePosition.x / containerWidth) * 100,
        y: (imageState.titlePosition.y / containerHeight) * 100,
        width: (imageState.titlePosition.width / containerWidth) * 100,
        height: (imageState.titlePosition.height / containerHeight) * 100,
      };

      const subtitlePositionPercent = {
        x: (imageState.subtitlePosition.x / containerWidth) * 100,
        y: (imageState.subtitlePosition.y / containerHeight) * 100,
        width: (imageState.subtitlePosition.width / containerWidth) * 100,
        height: (imageState.subtitlePosition.height / containerHeight) * 100,
      };

      const formData = new FormData();
      formData.append("image", imageUrl);
      formData.append("duration", imageState.duration);
      formData.append("title", imageState.title);
      formData.append("subtitle", imageState.subtitle);
      formData.append("titlePosition", JSON.stringify(titlePositionPercent));
      formData.append(
        "subtitlePosition",
        JSON.stringify(subtitlePositionPercent)
      );
      formData.append("titleColor", imageState.textColor);
      formData.append("subtitleColor", imageState.textColor);
      formData.append("titleFontSize", imageState.titleFontSize);
      formData.append("titleFontFamily", imageState.fontFamily);
      formData.append("subtitleFontFamily", imageState.fontFamily);
      formData.append("subtitleFontSize", imageState.subtitleFontSize);

      if (imageState.logo) {
        // Convert logo to blob and append
        const response = await fetch(imageState.logo);
        const logoBlob = await response.blob();
        formData.append("logo", logoBlob, "logo.png");

        const logoPositionPercent = {
          x: (imageState.logoPosition.x / containerWidth) * 100,
          y: (imageState.logoPosition.y / containerHeight) * 100,
          width: (imageState.logoPosition.width / containerWidth) * 100,
          height: (imageState.logoPosition.height / containerHeight) * 100,
        };
        formData.append("logoPosition", JSON.stringify(logoPositionPercent));
      }

      const res = await axiosClientFormData.post(
        "/api/videos/create-image-video",
        formData
      );

      setVideoUrl(res.data.videoUrl);
      if (type === "firstImage") {
        setFirstImageVideo(`${env.API_BASE_URL}${res.data.videoUrl}`);
      } else {
        setLastImageVideo(`${env.API_BASE_URL}${res.data.videoUrl}`);
      }
      setEnablePreview(true);
      toast({
        title: "Video generated!",
        description: "Click preview to see the video",
        variant: "success",
      });
    } catch (error) {
      console.error("Error saving image:", error);
      if (error instanceof AxiosError) {
        toast({
          title: "Error saving the image",
          description: error.response?.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          description: "Error saving the image",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    openModal("previewVideo", {
      title: "Preview Video",
      videoSrc: `${env.API_BASE_URL}${videoUrl}`,
    });
  };

  const setState = (value: string, key: string) => {
    setImageState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <h2 className="h2 text-center">Edit Your {image} Image</h2>
          <div className="flex justify-center items-center my-8">
            <div className="relative  aspect-video" id="capture-area">
              <img
                className="rounded-md object-cover w-full h-full"
                src={imageUrl}
                alt="image"
              />

              {/* Title Element */}
              <Rnd
                position={{
                  x: imageState.titlePosition.x,
                  y: imageState.titlePosition.y,
                }}
                onDragStop={(_e, d) => {
                  setEnablePreview(false);
                  setImageState((prev) => ({
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
                  setImageState((prev) => ({
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
                maxWidth={300}
                maxHeight={80}
                bounds="parent"
                className="z-10"
              >
                <div
                  style={{
                    ...elementStyles,
                    fontSize: `${imageState.titleFontSize}px`,
                    width: "100%",
                    height: "100%",
                    color: imageState.textColor,
                  }}
                  className="break-all"
                >
                  {imageState.title}
                </div>
              </Rnd>

              {/* Subtitle Element */}
              <Rnd
                position={{
                  x: imageState.subtitlePosition.x,
                  y: imageState.subtitlePosition.y,
                }}
                onDragStop={(_e, d) => {
                  setEnablePreview(false);
                  setImageState((prev) => ({
                    ...prev,
                    subtitlePosition: {
                      ...prev.titlePosition,
                      x: d.x,
                      y: d.y,
                    },
                  }));
                }}
                onResizeStop={(_e, _direction, ref, _delta, position) => {
                  setEnablePreview(false);
                  setImageState((prev) => ({
                    ...prev,
                    subtitlePosition: {
                      ...prev.titlePosition,
                      width: parseInt(ref.style.width),
                      height: parseInt(ref.style.height),
                      x: position.x,
                      y: position.y,
                    },
                  }));
                }}
                minWidth={80}
                minHeight={20}
                maxWidth={250}
                maxHeight={60}
                bounds="parent"
                className="z-10"
              >
                <div
                  style={{
                    ...elementStyles,
                    fontSize: `${imageState.subtitleFontSize}px`,
                    width: "100%",
                    height: "100%",
                    color: imageState.textColor,
                  }}
                  className="break-all"
                >
                  {imageState.subtitle}
                </div>
              </Rnd>

              {/* Logo Element */}
              {imageState.logo && (
                <Rnd
                  position={{
                    x: imageState.logoPosition.x,
                    y: imageState.logoPosition.y,
                  }}
                  onDragStop={(_e, d) => {
                    setEnablePreview(false);
                    setImageState((prev) => ({
                      ...prev,
                      logoPosition: {
                        ...prev.titlePosition,
                        x: d.x,
                        y: d.y,
                      },
                    }));
                  }}
                  onResizeStop={(_e, _direction, ref, _delta, position) => {
                    setEnablePreview(false);
                    setImageState((prev) => ({
                      ...prev,
                      logoPosition: {
                        ...prev.titlePosition,
                        width: parseInt(ref.style.width),
                        height: parseInt(ref.style.height),
                        x: position.x,
                        y: position.y,
                      },
                    }));
                  }}
                  minWidth={30}
                  minHeight={30}
                  maxWidth={100}
                  maxHeight={100}
                  bounds="parent"
                  className="z-10"
                >
                  <img
                    src={imageState.logo}
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

          <div className="flex gap-2 justify-center">
            <Button
              onClick={handleSave}
              className="btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </Button>
            <Button className="btn-primary">Edit</Button>
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
        <div className="flex flex-col gap-3 items-end mt-8 md:mt-0">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="title" className="text-sm text-slate-500">
              Enter Title
            </Label>
            <Input
              type="text"
              id="title"
              placeholder="Type here"
              value={imageState.title}
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
              value={imageState.subtitle}
              onChange={(e) => {
                setEnablePreview(false);
                setState(e.target.value, "subtitle");
              }}
              type="text"
              id="subtitle"
              placeholder="Type here"
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <div className="text-sm text-slate-500">Upload logo</div>
            <div>
              <Label
                htmlFor="logo"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-md cursor-pointer bg-white hover:bg-slate-50 text-slate-700 text-sm"
              >
                <CloudUpload className="text-primary-500" />
                <span className="text-slate-500 text-sm font-normal">
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

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="duration" className="text-sm text-slate-500">
              Enter duration of {image.toLowerCase()} image (seconds)
            </Label>
            <Input
              value={imageState.duration}
              onChange={(e) => {
                setEnablePreview(false);
                setState(e.target.value, "duration");
              }}
              type="text"
              id="duration"
              placeholder="Type here"
            />
          </div>

          <div className="grid grid-cols-2 w-full max-w-sm items-center gap-1.5">
            <div>
              <Label htmlFor="titleFontSize" className="text-sm text-slate-500">
                Title font size
              </Label>

              <Input
                type="text"
                id="titleFontSize"
                value={imageState.titleFontSize}
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
                value={imageState.subtitleFontSize}
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
                value={imageState.textColor}
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
                value={imageState.fontFamily}
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
