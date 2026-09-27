import Image from "next/image";
import { imageUrl, type SanityImage as SanityImageValue } from "@/modules/content/image";

type Props = {
  image: SanityImageValue | undefined;
  width: number;
  height: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

export function SanityImage({ image, width, height, className, sizes, priority }: Props) {
  const src = imageUrl(image, width, height);
  if (!src) return <div className={`bg-sand ${className ?? ""}`} aria-hidden="true" />;
  return (
    <Image
      src={src}
      alt={image?.alt ?? ""}
      width={width}
      height={height}
      className={className}
      sizes={sizes ?? "100vw"}
      priority={priority}
    />
  );
}
