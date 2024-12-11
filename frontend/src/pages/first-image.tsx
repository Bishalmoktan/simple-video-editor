import EditImage from "@/components/edit-image";
import temp from "../../public/temp.png";

const FirstImage = () => {
  return (
    <div>
      <EditImage imageUrl={temp} type="firstImage" />
    </div>
  );
};
export default FirstImage;
