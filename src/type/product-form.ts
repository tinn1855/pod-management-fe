import { UseFormReturn, FieldValues } from "react-hook-form";

export interface ProductFormProps<T extends FieldValues = FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  onCancel: () => void;
  mode?: "create" | "edit";
  isLoading?: boolean;
}

export interface ProductThumbnailUploaderProps {
  thumbnail: string | null;
  onUpload: (file?: File) => void;
  onClear: () => void;
  isUploading?: boolean;
}
