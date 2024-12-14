import { useState } from "react";
import Draggable from "react-draggable";
import html2canvas from "html2canvas";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageSelectForm from "./image-select-form";
import { CloudUpload } from "lucide-react";
import { axiosClientFormData } from "@/services/api-service";
import { env } from "@/config/env";
import { useModal } from "@/context/modal-context";
import { useToast } from "@/hooks/use-toast";

type Props = {
  type: "lastImage" | "firstImage";
  imageUrl: string;
};

export default function EditImage({ type, imageUrl }: Props) {
  const [title, setTitle] = useState("Your Title");
  const [subtitle, setSubtitle] = useState("Your Subtitle");
  const [logo, setLogo] = useState<string | null>(null);
  const [duration, setDuration] = useState("1");
  const [videoUrl, setVideoUrl] = useState("");
  const [enablePreview, setEnablePreview] = useState(false);
  const { toast } = useToast();

  const { openModal } = useModal();

  const image = type === "firstImage" ? " First " : " Last ";

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      // Capture the screenshot from the element
      const canvas = await html2canvas(
        document.getElementById("capture-area")!,
        {
          useCORS: true,
        }
      );

      // Convert canvas to Blob
      canvas.toBlob(async (blob) => {
        if (blob) {
          // Create FormData to send the image
          const formData = new FormData();
          formData.append("image", blob, "image.png");
          formData.append("duration", duration);

          // Send the Blob data via POST request
          const res = await axiosClientFormData.post(
            "/api/videos/create-image-video",
            formData
          );

          setVideoUrl(res.data.videoUrl);
          setEnablePreview(true);
        }
      }, "image/png");
    } catch (error) {
      console.error("Error saving image:", error);
    }
  };

  const handlePreview = () => {
    openModal("previewVideo", {
      title: "Preview Video",
      videoSrc: `${env.API_BASE_URL}${videoUrl}`,
    });
  };

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
              <Draggable>
                <h2 className="absolute top-4 left-4 text-black text-xl font-bold cursor-move">
                  {title}
                </h2>
              </Draggable>
              {/* Draggable Subtitle */}
              <Draggable>
                <p className="absolute bottom-4 left-4 text-black text-sm cursor-move">
                  {subtitle}
                </p>
              </Draggable>
              {/* Draggable Logo */}
              {logo && (
                <Draggable>
                  <img
                    src={logo}
                    alt="Logo"
                    className="absolute top-4 right-4 w-12 h-12 object-contain cursor-move"
                  />
                </Draggable>
              )}
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <Button onClick={handleSave} className="btn-primary">
              Save
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
        <div className="flex flex-col gap-3 items-end mt-8 md:mt-0">
          {/* title  */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="title" className="text-sm text-slate-500">
              Enter Title
            </Label>
            <Input
              type="text"
              id="title"
              placeholder="Type here"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* subtitle  */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="subtitle" className="text-sm text-slate-500">
              Enter Subtitle
            </Label>
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              type="text"
              id="subtitle"
              placeholder="Type here"
            />
          </div>

          {/* logo  */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <div className="text-sm text-slate-500">Upload logo</div>
            <div>
              <Label
                htmlFor="logo"
                className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-md cursor-pointer bg-white hover:bg-slate-50 text-slate-700 text-sm"
              >
                <CloudUpload className="text-primary-500" />
                <span className="text-slate-500 text-sm font-normal">
                  {" "}
                  Upload logo
                </span>
              </Label>
              <Input
                onChange={handleLogoUpload}
                className="hidden"
                type="file"
                id="logo"
              />
            </div>
          </div>

          {/* duration  */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="duration" className="text-sm text-slate-500">
              Enter duration of {image.toLowerCase()} image (seconds)
            </Label>
            <Input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              type="text"
              id="duration"
              placeholder="Type here"
            />
          </div>

          {/* transition  */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label className="text-sm text-slate-500">Select Transition</Label>
            <ImageSelectForm
              label="Select Transition"
              placeholder="Select Transition"
              options={["Fade In", "Fade out"]}
            />
          </div>

          <div className="grid grid-cols-2 w-full max-w-sm items-center gap-1.5">
            <div>
              <Label className="text-sm text-slate-500">Select Color</Label>
              <ImageSelectForm
                label="Select Color"
                placeholder="Select Color"
                options={["red", "blue"]}
              />
            </div>
            <div>
              <Label className="text-sm text-slate-500">Select Font</Label>
              <ImageSelectForm
                label="Select Font"
                placeholder="Select Font"
                options={["Arial", "Helvetica"]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
