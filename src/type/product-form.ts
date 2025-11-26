import { UseFormReturn, FieldValues } from "react-hook-form";

export interface ProductFormProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
  thumbnail: string | null;
  onThumbnailUpload: (file?: File) => void;
  onThumbnailClear: () => void;
  onSubmit: (data: T) => void;
  onCancel: () => void;
  mode?: "create" | "edit";
}

export interface ProductThumbnailUploaderProps {
  thumbnail: string | null;
  onUpload: (file?: File) => void;
  onClear: () => void;
}
