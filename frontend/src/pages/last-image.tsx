import EditImage from "@/components/edit-image";
import temp from "../../public/temp.png";

const LastImage = () => {
  return (
    <div>
      <EditImage imageUrl={temp} type="lastImage" />
    </div>
  );
};
export default LastImage;
