import Image, { ImageProps } from "next/image";

interface ImageOptimizedProps extends ImageProps {
    priority?: boolean;
}

export default function ImageOptimized({
    src,
    alt,
    priority = false,
    className,
    ...props
}: ImageOptimizedProps) {
    return (
        <div className={`relative overflow-hidden bg-neutral-100 dark:bg-neutral-800 ${className}`}>
            <Image
                src={src}
                alt={alt}
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                className="object-cover transition-opacity duration-300"
                onLoadingComplete={(image) => {
                    image.classList.remove("opacity-0");
                }}
                {...props}
            />
        </div>
    );
}
