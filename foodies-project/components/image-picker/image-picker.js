"use client";
import classes from "./image-picker.module.css";
import { useRef, useState } from "react";
import Image from "next/image";

export default function ImagePicker({ label, name }) {
  const inputref = useRef();
  const [selectedImage, setSelectedImage] = useState(null);
  function handleBtnClick() {
    inputref.current.click();
  }
  function handleImageChange(event) {
    const file = event.target.files[0];
    if (!file) {
      setSelectedImage(null);
      return;
    }
    setSelectedImage(file);
  }
  return (
    <>
      <div className={classes.picker}>
        <label htmlFor={name}>{label}</label>
        <div className={classes.controls}>
          <input
            className={classes.input}
            type="file"
            id={name}
            name={name}
            accept="image/jpg, image/jpeg, image/png"
            ref={inputref}
            onChange={handleImageChange}
          />
          {selectedImage && (
            <div className={classes.preview}>
              <Image
                src={URL.createObjectURL(selectedImage)}
                alt="User Selected Image"
                fill
              />
            </div>
          )}
          <button
            type="button"
            className={classes.button}
            onClick={handleBtnClick}
          >
            Choose an image
          </button>
        </div>
      </div>
    </>
  );
}
