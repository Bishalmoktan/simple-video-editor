import { useEffect, useMemo, useState } from "react";
import ImageSelectForm from "@/components/image-select-form";
import { Label } from "@/components/ui/label";
import { useAppContext } from "@/context/app-context";

const transitionOptions = [
  "None",
  "Fade",
  "Wipe Left",
  "Wipe Right",
  "Slide Up",
  "Slide Down",
  "Circle Open",
  "Circle Close",
];

const ApplyTransitions = () => {
  const {
    firstImageVideo,
    lastImageVideo,
    videos,
    setTransitions: setTransitionsFinal,
  } = useAppContext();
  const [transitions, setTransitions] = useState<string[]>([]);

  const videoUrls = useMemo(() => {
    const urls = videos.map((video) => video.videoUrl);
    if (firstImageVideo) {
      urls.unshift(firstImageVideo);
    }
    if (lastImageVideo) {
      urls.push(lastImageVideo);
    }
    return urls;
  }, [videos, firstImageVideo, lastImageVideo]);

  const handleTransitionChange = (index: number, value: string) => {
    const normalizedValue = value.toLowerCase().replace(/\s+/g, "");
    setTransitions((prevTransitions) => {
      const updatedTransitions = [...prevTransitions];
      updatedTransitions[index] = normalizedValue;
      return updatedTransitions;
    });
  };

  useEffect(() => {
    setTransitionsFinal(transitions);
  }, [transitions]);

  return (
    <div className="p-5">
      <h2 className="h2">Apply transition on your videos</h2>
      <div className="space-y-8 my-16">
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
          <div>Please provie at least two videos for applying transitons.</div>
        )}
      </div>
    </div>
  );
};

export default ApplyTransitions;
