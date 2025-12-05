"use client";

import Image, { ImageProps } from "next/image";
import { useState, useEffect } from "react";
import { DEFAULT_PRODUCT_IMAGE } from "@/constants";
import { cn } from "@/lib/utils";

interface ProductImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  fallbackSrc?: string;
}

export function ProductImage({
  src,
  alt,
  className,
  fallbackSrc = DEFAULT_PRODUCT_IMAGE,
  ...props
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const imageSrc = hasError || !src ? fallbackSrc : src;

  return (
    <Image
      {...props}
      src={imageSrc}
      alt={alt}
      className={cn("bg-muted", className)}
      onError={() => {
        setHasError(true);
      }}
    />
  );
}

