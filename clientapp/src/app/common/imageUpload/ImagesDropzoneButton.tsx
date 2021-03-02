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
          <Button icon labelPosition="left" size="small">
            <Icon name="upload" />
            Add Images
          </Button>
          <p>Drag folder/images here, or click to select images</p>
        </>
      )}
    </div>
  );
};

export default ImagesDropzoneButton;
