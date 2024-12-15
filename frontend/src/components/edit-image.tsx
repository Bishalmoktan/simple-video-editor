import { useEffect, useState } from "react";
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

type Props = {
  type: "lastImage" | "firstImage";
  imageUrl: string;
};

type Position = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default function EditImage({ type, imageUrl }: Props) {
  const [title, setTitle] = useState("Your Title");
  const [subtitle, setSubtitle] = useState("Your Subtitle");
  const [logo, setLogo] = useState<string | null>(null);
  const [duration, setDuration] = useState("1");
  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [enablePreview, setEnablePreview] = useState(false);
  const [titleFontSize, setTitleFontSize] = useState("48");
  const [subtitleFontSize, setSubtitleFontSize] = useState("32");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [textColor, setTextColor] = useState("#000000");
  const [transition, setTransition] = useState("fade");

  const fontFamilyOptions = [
    "Arial",
    "Times New Roman",
    "Helvetica",
    "Georgia",
    "Verdana",
  ];

  const transitionOptions = ["None", "Fade"];

  // State for element positions and sizes
  const [titlePosition, setTitlePosition] = useState<Position>({
    x: 16,
    y: 16,
    width: 200,
    height: 40,
  });

  const [subtitlePosition, setSubtitlePosition] = useState<Position>({
    x: 16,
    y: 180,
    width: 150,
    height: 30,
  });

  const [logoPosition, setLogoPosition] = useState<Position>({
    x: 290,
    y: 16,
    width: 48,
    height: 48,
  });

  const { toast } = useToast();
  const { openModal } = useModal();
  const image = type === "firstImage" ? " First " : " Last ";

  // Common styles for elements
  const elementStyles = {
    transition: "font-size 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: "4px",
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnablePreview(false);
    const file = e.target.files?.[0];
    if (file) {
      const fileURL = URL.createObjectURL(file);
      setLogo(fileURL);
    }
  };

  const handleSave = async () => {
    if (duration === "0") {
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
        x: (titlePosition.x / containerWidth) * 100,
        y: (titlePosition.y / containerHeight) * 100,
        width: (titlePosition.width / containerWidth) * 100,
        height: (titlePosition.height / containerHeight) * 100,
      };

      const subtitlePositionPercent = {
        x: (subtitlePosition.x / containerWidth) * 100,
        y: (subtitlePosition.y / containerHeight) * 100,
        width: (subtitlePosition.width / containerWidth) * 100,
        height: (subtitlePosition.height / containerHeight) * 100,
      };

      const formData = new FormData();
      formData.append("image", imageUrl);
      formData.append("duration", duration);
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("titlePosition", JSON.stringify(titlePositionPercent));
      formData.append(
        "subtitlePosition",
        JSON.stringify(subtitlePositionPercent)
      );
      formData.append("titleColor", textColor);
      formData.append("subtitleColor", textColor);
      formData.append("titleFontSize", titleFontSize);
      formData.append("titleFontFamily", fontFamily);
      formData.append("subtitleFontFamily", fontFamily);
      formData.append("subtitleFontSize", subtitleFontSize);
      formData.append("transitioin", transition);

      if (logo) {
        // Convert logo to blob and append
        const response = await fetch(logo);
        const logoBlob = await response.blob();
        formData.append("logo", logoBlob, "logo.png");

        const logoPositionPercent = {
          x: (logoPosition.x / containerWidth) * 100,
          y: (logoPosition.y / containerHeight) * 100,
          width: (logoPosition.width / containerWidth) * 100,
          height: (logoPosition.height / containerHeight) * 100,
        };
        formData.append("logoPosition", JSON.stringify(logoPositionPercent));
      }

      const res = await axiosClientFormData.post(
        "/api/videos/create-image-video",
        formData
      );

      setVideoUrl(res.data.videoUrl);
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
          description: error.message,
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

  useEffect(() => {
    setTitleFontSize(
      `${Math.min(titlePosition.height * 0.6, titlePosition.width * 0.15)}`
    );
  }, [titlePosition]);

  useEffect(() => {
    setSubtitleFontSize(
      `${Math.min(subtitlePosition.height * 0.6, subtitlePosition.width * 0.15)}`
    );
  }, [subtitlePosition]);

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <h2 className="h2 text-center">Edit Your {image} Image</h2>
          <div className="flex justify-center items-center my-8">
            <div className="relative w-[350px] h-[250px]" id="capture-area">
              <img
                className="rounded-md object-cover w-full h-full"
                src={imageUrl}
                alt="image"
              />

              {/* Title Element */}
              <Rnd
                position={{ x: titlePosition.x, y: titlePosition.y }}
                onDragStop={(_e, d) => {
                  setEnablePreview(false);
                  setTitlePosition((prev) => ({ ...prev, x: d.x, y: d.y }));
                }}
                onResizeStop={(_e, _direction, ref, _delta, position) => {
                  setEnablePreview(false);
                  setTitlePosition({
                    width: parseInt(ref.style.width),
                    height: parseInt(ref.style.height),
                    x: position.x,
                    y: position.y,
                  });
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
                    fontSize: `${titleFontSize}px`,
                    width: "100%",
                    height: "100%",
                    color: textColor,
                  }}
                >
                  {title}
                </div>
              </Rnd>

              {/* Subtitle Element */}
              <Rnd
                position={{ x: subtitlePosition.x, y: subtitlePosition.y }}
                onDragStop={(_e, d) => {
                  setEnablePreview(false);
                  setSubtitlePosition((prev) => ({ ...prev, x: d.x, y: d.y }));
                }}
                onResizeStop={(_e, _direction, ref, _delta, position) => {
                  setEnablePreview(false);
                  setSubtitlePosition({
                    width: parseInt(ref.style.width),
                    height: parseInt(ref.style.height),
                    x: position.x,
                    y: position.y,
                  });
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
                    fontSize: `${subtitleFontSize}}px`,
                    width: "100%",
                    height: "100%",
                    color: textColor,
                  }}
                >
                  {subtitle}
                </div>
              </Rnd>

              {/* Logo Element */}
              {logo && (
                <Rnd
                  position={{ x: logoPosition.x, y: logoPosition.y }}
                  onDragStop={(_e, d) => {
                    setEnablePreview(false);
                    setLogoPosition((prev) => ({ ...prev, x: d.x, y: d.y }));
                  }}
                  onResizeStop={(_e, _direction, ref, _delta, position) => {
                    setEnablePreview(false);
                    setLogoPosition({
                      width: parseInt(ref.style.width),
                      height: parseInt(ref.style.height),
                      x: position.x,
                      y: position.y,
                    });
                  }}
                  minWidth={30}
                  minHeight={30}
                  maxWidth={100}
                  maxHeight={100}
                  bounds="parent"
                  className="z-10"
                >
                  <img
                    src={logo}
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
              value={title}
              onChange={(e) => {
                setEnablePreview(false);
                setTitle(e.target.value);
              }}
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="subtitle" className="text-sm text-slate-500">
              Enter Subtitle
            </Label>
            <Input
              value={subtitle}
              onChange={(e) => {
                setEnablePreview(false);
                setSubtitle(e.target.value);
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
              value={duration}
              onChange={(e) => {
                setEnablePreview(false);
                setDuration(e.target.value);
              }}
              type="text"
              id="duration"
              placeholder="Type here"
            />
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label className="text-sm text-slate-500">Select Transition</Label>
            <ImageSelectForm
              label="Select Transition"
              placeholder="Select Transition"
              options={transitionOptions}
              onChange={(value) => {
                setTransition(value);
                setEnablePreview(false);
              }}
            />
          </div>

          <div className="grid grid-cols-2 w-full max-w-sm items-center gap-1.5">
            <div>
              <Label htmlFor="color" className="text-sm text-slate-500">
                Select Color
              </Label>

              <Input
                type="color"
                id="color"
                onChange={(e) => {
                  setEnablePreview(false);
                  setTextColor(e.target.value);
                }}
              />
            </div>
            <div>
              <Label className="text-sm text-slate-500">Select Font</Label>
              <ImageSelectForm
                label="Select Font"
                placeholder="Select Font"
                options={fontFamilyOptions}
                onChange={(value) => {
                  setEnablePreview(false);
                  setFontFamily(value);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
