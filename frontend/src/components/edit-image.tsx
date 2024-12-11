import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ImageSelectForm from "./image-select-form";
import { CloudUpload } from "lucide-react";

type Props = {
  type: "lastImage" | "firstImage";
  imageUrl: string;
};
export default function EditImage({ type, imageUrl }: Props) {
  const image = type === "firstImage" ? " First " : " Last ";
  return (
    <div className="p-8">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div>
          <h2 className="h2 text-center">Edit Your {image} Image</h2>
          <div className="p-8 ">
            <img className="rounded-md" src={imageUrl} alt="image" />
          </div>
          <div className="flex gap-2 justify-center">
            <Button className="btn-primary">Save</Button>
            <Button className="btn-primary">Edit</Button>
            <Button className="btn-primary">Preview</Button>
          </div>
        </div>
        <div className="flex flex-col gap-3 items-end mt-8 md:mt-0">
          {/* title  */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="title" className="text-sm text-slate-500">
              Enter Title
            </Label>
            <Input type="text" id="title" placeholder="Type here" />
          </div>

          {/* subtitle  */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="subtitle" className="text-sm text-slate-500">
              Enter Subtitle
            </Label>
            <Input type="text" id="subtitle" placeholder="Type here" />
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
              <Input className="hidden" type="file" id="logo" />
            </div>
          </div>

          {/* duration  */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="duration" className="text-sm text-slate-500">
              Enter duration of {image.toLowerCase()} image (seconds)
            </Label>
            <Input type="text" id="duration" placeholder="Type here" />
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
