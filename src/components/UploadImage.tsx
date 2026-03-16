import type { ComponentPropsWithoutRef } from "react";

type UploadImageProps = ComponentPropsWithoutRef<"img"> & {
  fallbackSrc: string;
};

export default function UploadImage({
  fallbackSrc,
  onError,
  ...props
}: UploadImageProps) {
  return (
    <img
      {...props}
      onError={(event) => {
        const target = event.currentTarget;
        if (target.src !== fallbackSrc) {
          target.src = fallbackSrc;
        }
        onError?.(event);
      }}
    />
  );
}
