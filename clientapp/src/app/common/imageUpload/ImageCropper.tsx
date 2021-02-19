import React from "react";
import { Cropper } from "react-cropper";
import "cropperjs/dist/cropper.css";

interface Props {
  setCropper: (cropper: Cropper) => void;
  imagePreview: string;
}

const ImageCropper = ({ setCropper, imagePreview }: Props) => {
  return (
    <Cropper
      src={imagePreview}
      onInitialized={(cropper) => setCropper(cropper)}
      style={{ height: 200, width: "100%" }}
      preview=".img-preview"
      guides={false}
      viewMode={1}
      autoCropArea={1}
      background={false}
    />
  );
};

export default ImageCropper;
