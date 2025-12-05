import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCloudinaryUpload } from "@/hooks/use-cloudinary-upload";

interface ProductImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
}

export function ProductImageUploader({
  images = [],
  onChange,
  maxImages = 5,
  label = "Images",
}: ProductImageUploaderProps) {
  const { upload, isUploading } = useCloudinaryUpload();

  const handleUpload = async (file?: File) => {
    if (!file) return;
    const url = await upload(file);
    if (url) {
      onChange([...images, url]);
    }
  };

  const handleRemove = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="grid grid-cols-3 gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative aspect-square border rounded-md overflow-hidden group bg-muted">
            <Image src={url} alt={`Image ${index + 1}`} fill className="object-cover" />
            <Button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 w-6 h-6 bg-black/70 text-white p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              <X size={14} />
            </Button>
          </div>
        ))}
        {images.length < maxImages && (
          <Label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-md cursor-pointer hover:bg-muted/20 transition">
            {isUploading ? (
              <Loader2 size={24} className="animate-spin text-muted-foreground" />
            ) : (
              <>
                <UploadCloud size={24} className="text-muted-foreground" />
                <span className="mt-2 text-xs text-muted-foreground">Upload</span>
              </>
            )}
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={(e) => handleUpload(e.target.files?.[0])}
            />
          </Label>
        )}
      </div>
    </div>
  );
}

