import ImageSelectForm from "@/components/image-select-form";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/app-context";

const transitionOptions = [
  { text: "Fade", value: "fade" },
  { text: "Wipe Left", value: "wipeleft" },
  { text: "Wipe Right", value: "wiperight" },
  { text: "Slide Up", value: "slideup" },
  { text: "Slide Down", value: "slidedown" },
  { text: "Circle Open", value: "circleopen" },
  { text: "Circle Close", value: "circleclose" },
];

const ApplyTransitions = () => {
  const { setTransitions, transitions, videoUrls } = useAppContext();

  const handleTransitionChange = (index: number, value: string) => {
    const normalizedValue = value.toLowerCase().replace(/\s+/g, "");
    setTransitions((prevTransitions) => {
      const updatedTransitions = [...prevTransitions];
      updatedTransitions[index] = normalizedValue;
      return updatedTransitions;
    });
  };

  return (
    <div className="p-5">
      <h2 className="h2">Apply transition on your videos</h2>
      <div className="space-y-8 my-6">
        {videoUrls.map((url, index) => (
          <div key={index} className="flex gap-10">
            <video
              className="w-[300px] h-[200px] rounded-md"
              src={url}
              controls
            />
            {videoUrls[index + 1] && (
              <div className="py-8">
                <Label className="text-sm text-slate-500">
                  Select transition for video {index + 1} and video {index + 2}
                </Label>
                <ImageSelectForm
                  value={
                    (transitions && transitions[index]) || "None" // Default to "None" if no transition is set
                  }
                  label={`Select transition for video ${index + 1} and video ${index + 2}`}
                  onChange={(value) => handleTransitionChange(index, value)}
                  options={transitionOptions}
                  placeholder={`Select transition`}
                />
              </div>
            )}
          </div>
        ))}
        {videoUrls.length <= 1 && (
          <div>
            Please provide at least two videos for applying transitions.
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplyTransitions;
