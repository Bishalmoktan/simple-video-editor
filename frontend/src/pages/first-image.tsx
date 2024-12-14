import EditImage from "@/components/edit-image";
import { useAppContext } from "@/context/app-context";

const FirstImage = () => {
  const { firstImage } = useAppContext();
  return (
    <div>
      {firstImage && (
        <EditImage imageUrl={firstImage.imageUrl!} type="firstImage" />
      )}
    </div>
  );
};
export default FirstImage;
