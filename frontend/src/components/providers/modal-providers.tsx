import DeleteModal from "../modals/delete-modal";
import FirstScreenImport from "../modals/first-screen-import-modal";
import ImageImportModal from "../modals/image-import-modal";
import InfoModal from "../modals/info-modal";
import LastScreenImport from "../modals/last-screen-import-modal";
import LoadingModal from "../modals/loading-modal";
import PreviewVideoModal from "../modals/preview-video-modal";
import UploadProgressModal from "../modals/upload-progress-modal";

const ModalProvider = () => {
  return (
    <>
      <PreviewVideoModal />
      <UploadProgressModal />
      <LoadingModal />
      <ImageImportModal />
      <InfoModal />
      <DeleteModal />
      <FirstScreenImport />
      <LastScreenImport />
    </>
  );
};
export default ModalProvider;
