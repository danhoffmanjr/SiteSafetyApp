import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Icon } from "semantic-ui-react";

interface Props {
  setFiles: (files: any) => void;
}

export default function ImageDropzone({ setFiles }: Props) {
  const dzStyles = {
    padding: "4em 2em 0 2em",
    textAlign: "center" as "center",
    border: "dashed 3px #cccccc",
    borderColor: "#cccccc",
    borderRadius: "1em",
    cursor: "pointer",
    height: 200,
    "&:hover": {
      background: "green",
    },
  };

  const dzActive = {
    borderColor: "green",
  };

  const onDrop = useCallback(
    (acceptedFiles) => {
      console.log(acceptedFiles);
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
        <p>Drop the image here ...</p>
      ) : (
        <>
          <Button icon="upload" size="large" />
          <p>Drag 'n' drop image here, or click to select image</p>
        </>
      )}
    </div>
  );
}
