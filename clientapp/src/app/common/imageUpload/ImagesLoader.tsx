import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Button, Card, Divider, Image, Item } from "semantic-ui-react";
import { RootStoreContext } from "../../stores/rootStore";
import ImagesDropzoneButton from "./ImagesDropzoneButton";

interface Props {
  PreviewMode: boolean;
}

const ImagesLoader = ({ PreviewMode }: Props) => {
  const rootStore = useContext(RootStoreContext);
  const { addImage, uploadImage } = rootStore.imageStore;

  const [files, setFiles] = useState<any[]>([]);

  function onConfirm() {
    if (PreviewMode === true) {
      files.forEach((file) => addImage(file.name, file));
    } else {
      files.forEach((file) => {
        addImage(file.name, file);
        uploadImage(file.name, file);
      });
    }
    setFiles([]);
  }

  useEffect(() => {
    return () => {
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    };
  }, [files]);

  const handleRemoveIamge = (image: any) => {
    setFiles(files.filter((file) => file.name !== image.name));
    URL.revokeObjectURL(image.preview);
  };

  return (
    <>
      <Item>
        <ImagesDropzoneButton setFiles={setFiles} />
      </Item>
      {files && files.length > 0 && (
        <>
          <Divider horizontal section>
            Preview
          </Divider>
          <Item>
            <Card.Group stackable itemsPerRow={4}>
              {files &&
                files.length > 0 &&
                files.map((file, index) => (
                  <Card key={index}>
                    <Card.Content style={{ padding: "2px" }}>
                      <Image src={file.preview} />
                    </Card.Content>
                    <Card.Content extra style={{ padding: "5px" }}>
                      <Button basic color="red" fluid={true} size="small" onClick={() => handleRemoveIamge(file)}>
                        Remove
                      </Button>
                    </Card.Content>
                  </Card>
                ))}
            </Card.Group>
          </Item>
          <Divider horizontal section>
            Confirm
          </Divider>
          <Item>
            <Button.Group fluid size="small" style={{ marginTop: 2 }}>
              <Button content="Cancel" icon="close" labelPosition="left" onClick={() => setFiles([])} />
              <Button positive content="Accept" icon="check" labelPosition="right" onClick={onConfirm} />
            </Button.Group>
          </Item>
        </>
      )}
    </>
  );
};

export default observer(ImagesLoader);
