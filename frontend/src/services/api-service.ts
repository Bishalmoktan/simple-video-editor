import { env } from "@/config/env";
import axios, { AxiosProgressEvent } from "axios";

export const axiosClientFormData = axios.create({
  baseURL: env.API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

export const uploadVideo = async (
  file: File,
  onUploadProgress: (event: AxiosProgressEvent) => void
) => {
  const formData = new FormData();
  formData.append("video", file);

  const response = await axiosClientFormData.post(
    "/api/videos/upload",
    formData,
    {
      onUploadProgress,
    }
  );

  return response.data;
};

export const uploadImage = async (
  file: File,
  onUploadProgress: (event: AxiosProgressEvent) => void
) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await axiosClientFormData.post(
    "/api/videos/upload-image",
    formData,
    {
      onUploadProgress,
    }
  );

  return response.data;
};
