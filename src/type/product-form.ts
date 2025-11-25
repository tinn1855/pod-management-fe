import { CreateProductInput } from "@/schema/product.schema";
import { UseFormReturn } from "react-hook-form";

export interface ProductFormProps {
  form: UseFormReturn<CreateProductInput>;
  thumbnail: string | null;
  onThumbnailUpload: (file?: File) => void;
  onThumbnailClear: () => void;
  onSubmit: (data: CreateProductInput) => void;
  onCancel: () => void;
}

export interface ProductThumbnailUploaderProps {
  thumbnail: string | null;
  onUpload: (file?: File) => void;
  onClear: () => void;
}
