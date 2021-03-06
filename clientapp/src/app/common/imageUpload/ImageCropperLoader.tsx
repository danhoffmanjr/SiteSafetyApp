import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Button, Grid, Header } from "semantic-ui-react";
import { RootStoreContext } from "../../stores/rootStore";
import ImageCropper from "./ImageCropper";
import ImageDropzone from "./ImageDropzone";

interface Props {
  PreviewMode: boolean;
}

const ImageCropperLoader = ({ PreviewMode }: Props) => {
  const rootStore = useContext(RootStoreContext);
  const { addImage, uploadImage } = rootStore.imageStore;

  const [files, setFiles] = useState<any[]>([]);
  const [cropper, setCropper] = useState<Cropper>();

  function onCrop() {
    if (cropper) {
      cropper.getCroppedCanvas().toBlob((blob) => {
        if (PreviewMode === true) {
          addImage(files[0].name, blob!);
        } else {
          addImage(files[0].name, blob!);
          uploadImage(files[0].name, blob!);
        }
      });
      setFiles([]);
    }
  }

  useEffect(() => {
    return () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  return (
    <Grid stackable>
      <Grid.Column width={4}>
        <Header sub color="blue" content="Step 1 - Add Image" />
        <ImageDropzone setFiles={setFiles} />
      </Grid.Column>
      <Grid.Column width={2} />
      <Grid.Column width={4}>
        <Header sub color="blue" content="Step 2 - Resize/Crop" />
        {files && files.length > 0 && <ImageCropper setCropper={setCropper} imagePreview={files[0].preview} />}
      </Grid.Column>
      <Grid.Column width={2} />
      <Grid.Column width={4}>
        <Header sub color="blue" content="Step 3 - Preview & Save" />
        {files && files.length > 0 && (
          <>
            <div className="img-preview" style={{ minHeight: 200, overflow: "hidden", margin: "auto", border: "1px solid #ccc" }} />
            <Button.Group fluid size="small" style={{ marginTop: 2 }}>
              <Button content="Cancel" icon="close" labelPosition="left" onClick={() => setFiles([])} />
              <Button positive content="Accept" icon="check" labelPosition="right" onClick={onCrop} />
            </Button.Group>
          </>
        )}
      </Grid.Column>
    </Grid>
  );
};

export default observer(ImageCropperLoader);
