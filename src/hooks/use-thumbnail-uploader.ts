import { useState } from "react";
import { toast } from "sonner";

export function useThumbnailUploader() {
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const upload = (file?: File) => {
    if (!file) {
      toast.error("Please choose an image.");
      return;
    }
    setThumbnail(URL.createObjectURL(file));
  };

  const reset = () => setThumbnail(null);

  return { thumbnail, upload, reset };
}
