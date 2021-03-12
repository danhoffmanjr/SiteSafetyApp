import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Icon } from "semantic-ui-react";

interface Props {
  setFiles: (files: any) => void;
}

const ImagesDropzoneButton = ({ setFiles }: Props) => {
  const dzStyles = {
    margin: "1em 0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "dashed 3px #cccccc",
    borderColor: "#cccccc",
    borderRadius: "1em",
    cursor: "pointer",
    height: 80,
    "&:hover": {
      background: "green",
    },
  };

  const dzActive = {
    borderColor: "green",
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file: any) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
    [setFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()} style={isDragActive ? { ...dzStyles, ...dzActive } : dzStyles}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the images here ...</p>
      ) : (
        <>
          <button type="button" className="ui small icon left labeled button">
            <i aria-hidden="true" className="icon upload"></i>Drag 'n' drop folder or images here, or click to select image
          </button>
        </>
      )}
    </div>
  );
};

export default ImagesDropzoneButton;
