import React, { useContext, useState } from "react";
import { Button, Icon, Menu, Segment, Image } from "semantic-ui-react";
import AddImagesField from "../../app/common/form/AddImagesField";
import AddImageWithCropperField from "../../app/common/form/AddImageWithCropperField";
import { IImage } from "../../app/models/image";
import { RootStoreContext } from "../../app/stores/rootStore";

const ManageImages = () => {
  const rootStore = useContext(RootStoreContext);
  const { removeImage, removeAllImages, imageRegistry } = rootStore.imageStore;

  const [images, setImages] = useState<Map<string, Blob>>();
  const [postImages, setPostImages] = useState<IImage[]>();
  const [requireImages, setRequireImages] = useState<boolean>(false);
  const [showAddImagesField, setShowAddImagesField] = useState<boolean>(false);
  const [showAddCroppedImageField, setShowAddCroppedImageField] = useState<boolean>(false);

  const handleToggleAddImagesField = () => {
    if (showAddCroppedImageField === true) {
      setShowAddCroppedImageField(false);
    }
    setShowAddImagesField(!showAddImagesField);
  };

  const handleToggleAddCroppedImageField = () => {
    if (showAddImagesField === true) {
      setShowAddImagesField(false);
    }
    setShowAddCroppedImageField(!showAddCroppedImageField);
  };

  const handleRemoveImage = (url: string, key: string) => {
    URL.revokeObjectURL(url);
    removeImage(key);
  };
  return (
    <>
      <Menu stackable attached="top" style={{ marginTop: 0 }} size="small">
        <Menu.Item>
          <Icon name="photo" /> Manage Images
        </Menu.Item>
        <Menu.Item onClick={handleToggleAddImagesField} active={showAddImagesField}>
          Add Images
        </Menu.Item>
        <Menu.Item onClick={handleToggleAddCroppedImageField} active={showAddCroppedImageField}>
          Add Cropped Image
        </Menu.Item>
        {images && images.size > 1 && (
          <Menu.Item onClick={removeAllImages} position="right">
            Remove All Images
          </Menu.Item>
        )}
      </Menu>
      {(showAddImagesField || showAddCroppedImageField) && (
        <Segment attached>
          {showAddImagesField && <AddImagesField />}
          {showAddCroppedImageField && <AddImageWithCropperField />}
        </Segment>
      )}
      <Segment attached="bottom">
        <div style={{ display: "flex", justifyContent: "flex-start", flexWrap: "wrap" }}>
          {images &&
            images.size > 0 &&
            Array.from(images).map((blob) => {
              let imageUrl = URL.createObjectURL(blob[1]);
              let imageKey = blob[0];
              return (
                <Segment key={imageKey} style={{ padding: 0, margin: "0.5em 1em 0.5em 0 " }}>
                  <Image src={imageUrl} alt={imageKey} style={{ maxHeight: 100 }} />
                  <Button fluid compact size="mini" attached="bottom" onClick={() => handleRemoveImage(imageUrl, imageKey)}>
                    Remove
                  </Button>
                </Segment>
              );
            })}
        </div>
      </Segment>
    </>
  );
};

export default ManageImages;
