import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export type TemplateSectionProps = {
  title: string;
  images: string[];
};

export default function TemplateSection({
  title,
  images,
}: TemplateSectionProps) {
  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between gap-2">
        <h2 className="h2">{title}</h2>
        <div className="relative group">
          <Input
            className="w-full md:w-[300px] rounded-full bg-gray-100 focus:outline-none"
            placeholder="Search anything..."
          />
          <Search className="absolute top-1/2 -translate-y-1/2 right-4 text-slate-400 group-focus-within:text-slate-950" />
        </div>
      </div>

      <div className="relative">
        <Separator className="mt-2 mb-6 h-[2px] rounded-md" />
        <Separator className="bg-primary-500 absolute top-0 w-[200px] h-[2px] rounded-md" />
      </div>

      <div className="responsive-flex">
        {images.map((image, index) => (
          <img className="rounded-xl" src={image} alt={image} key={index} />
        ))}
      </div>
    </div>
  );
}
