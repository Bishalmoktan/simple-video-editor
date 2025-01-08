import EditVideo from "@/components/edit-video";
import { useLocation, useParams } from "react-router-dom";

const EditVideoPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const { videoUrl } = location.state || {};

  if (!id) {
    return <div>No video found.</div>;
  }

  return (
    <div>
      <EditVideo index={id} videoUrl={videoUrl} />
    </div>
  );
};

export default EditVideoPage;
