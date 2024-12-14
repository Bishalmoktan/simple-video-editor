import EditImage from "@/components/edit-image";
import { useAppContext } from "@/context/app-context";

const LastImage = () => {
  const { lastImage } = useAppContext();
  return (
    <div>
      {lastImage && (
        <EditImage imageUrl={lastImage.imageUrl!} type="lastImage" />
      )}
    </div>
  );
};
export default LastImage;
