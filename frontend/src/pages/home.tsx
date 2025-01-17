import AddVideoIcon from "@/assets/icons/add-video";
import AddImageVideo from "@/components/add-image-video";
import PreviewCard from "@/components/preview-card";;
import { useAppContext } from "@/context/app-context";

const Home = () => {

  const { videos, setVideos } = useAppContext();



  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.classList.add("opacity-50");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.classList.remove("opacity-50");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));

    if (dragIndex === dropIndex) return;

    const newVideos = [...videos];
    const [draggedVideo] = newVideos.splice(dragIndex, 1);
    newVideos.splice(dropIndex, 0, draggedVideo);

    setVideos(newVideos);
  };


  return (
    <section className="px-8 py-4 space-y-8">
      {/* add video section  */}
      <div className="">
        <AddImageVideo
          icon={AddVideoIcon}
          title="Add Video"
          className="bg-gradient-to-r from-[#008080] via-[#66b3b3] to-[#99cccc] text-black"
          type="video"
        />
      </div>

      {/* added temporary videos  */}
      <div>
        <h2 className="h2">My video clips</h2>
        <div className="responsive-flex">
          {videos.map((video, index) => (
            <PreviewCard
              key={index}
              {...video}
              index={video.index}
              draggable={true}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDrop={handleDrop}
            />
          ))}
          {videos.length === 0 && <div>No videos added.</div>}
        </div>
      </div>
    </section>
  );
};
export default Home;
