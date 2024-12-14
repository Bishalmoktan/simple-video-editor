import PreviewVideoModal from "../modals/preview-video-modal";
import UploadProgressModal from "../modals/upload-progress-modal";

const ModalProvider = () => {
  return (
    <>
      <PreviewVideoModal />
      <UploadProgressModal />
    </>
  );
};
export default ModalProvider;
