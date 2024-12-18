import ImageImportModal from "../modals/image-import-modal";
import InfoModal from "../modals/info-modal";
import LoadingModal from "../modals/loading-modal";
import PreviewVideoModal from "../modals/preview-video-modal";
import UploadProgressModal from "../modals/upload-progress-modal";
import VideoImportModal from "../modals/video-import-modal";

const ModalProvider = () => {
  return (
    <>
      <PreviewVideoModal />
      <UploadProgressModal />
      <LoadingModal />
      <VideoImportModal />
      <ImageImportModal />
      <InfoModal />
    </>
  );
};
export default ModalProvider;
