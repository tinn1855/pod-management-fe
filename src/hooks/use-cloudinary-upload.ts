import { useState } from "react";
import { toast } from "sonner";

interface CloudinaryResponse {
  secure_url: string;
}

export function useCloudinaryUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const upload = async (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large (max 5MB)");
      return null;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

      if (!cloudName || !process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET) {
        toast.error("Cloudinary configuration is missing.");
        return null;
      }

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!response.ok) throw new Error("Upload failed");
      const data = (await response.json()) as CloudinaryResponse;
      return data.secure_url;
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { upload, isUploading };
}

