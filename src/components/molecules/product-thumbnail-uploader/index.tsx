import Image from "next/image";
import { UploadCloud, X, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductThumbnailUploaderProps } from "@/type/product-form";

export function ProductThumbnailUploader({
  thumbnail,
  onUpload,
  onClear,
  isUploading,
}: ProductThumbnailUploaderProps) {
  return (
    <div className="space-y-2">
      <Label>Thumbnail</Label>

      {thumbnail ? (
        <div className="relative w-full h-64 border shadow-sm overflow-hidden">
          <Image
            src={thumbnail}
            alt="Thumbnail"
            fill
            className="object-cover"
          />
          <Button
            type="button"
            onClick={onClear}
            className="absolute top-2 right-2 bg-black/70 text-white p-1.5 rounded-full"
          >
            <X size={16} />
          </Button>
        </div>
      ) : (
        <Label className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed transition ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-muted/20'}`}>
          {isUploading ? (
            <Loader2 size={32} className="animate-spin text-muted-foreground" />
          ) : (
            <>
              <UploadCloud size={32} className="text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">Click to upload</p>
            </>
          )}
          <Input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={isUploading}
            onChange={(e) => onUpload(e.target.files?.[0])}
          />
        </Label>
      )}
    </div>
  );
}
