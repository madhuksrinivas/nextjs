"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import classes from "./image-slideshow.module.css";

const S3_BASE_URL = process.env.NEXT_PUBLIC_S3_BASE_URL;

export default function ImageSlideshow({ images = [] }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex < images.length - 1 ? prevIndex + 1 : 0,
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className={classes.slideshow}>
      {images.map((image, index) => (
        <Image
          key={index}
          src={`${S3_BASE_URL}/${image.image}`}
          width={1280}
          height={720}
          className={index === currentImageIndex ? classes.active : ""}
          alt={image.alt}
          loading={index === 0 ? "eager" : "lazy"}
        />
      ))}
    </div>
  );
}
