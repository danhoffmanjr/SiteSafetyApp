import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Button, Checkbox, Form, Grid, Header, Icon, Menu, Segment, Select, TextArea, Image } from "semantic-ui-react";
import ImageCropperLoader from "../../app/common/imageUpload/ImageCropperLoader";
import ImagesLoader from "../../app/common/imageUpload/ImagesLoader";
import { IReportType } from "../../app/models/reportType";
import { RootStoreContext } from "../../app/stores/rootStore";

interface Props {
  type: IReportType;
}

const ReportTypeForm = ({ type }: Props) => {
  const rootStore = useContext(RootStoreContext);
  const { createDropdownOptions, fieldTypes } = rootStore.reportTypeStore;
  const { removeImage, removeAllImages, imageRegistry } = rootStore.imageStore;

  const [images, setImages] = useState<Map<string, Blob>>();

  const handleRemoveImage = (url: string, key: string) => {
    URL.revokeObjectURL(url);
    removeImage(key);
  };

  useEffect(() => {
    setImages(imageRegistry);
  }, [imageRegistry]);

  return (
    <>
      <Menu stackable attached="top" inverted style={{ backgroundColor: "#696969", border: "1px solid #696969" }} size="small">
        <Menu.Item color="grey">
          <Icon name="wordpress forms" size="large" /> {type.title} fields
        </Menu.Item>
      </Menu>
      <Segment attached="bottom" inverted style={{ backgroundColor: "#808080", border: "1px solid #808080" }}>
        <Form inverted>
          <Grid stackable columns={3}>
            {type &&
              type.fields?.map((field, index) => {
                if (field === undefined) return false;
                if (field?.type === undefined) return false;

                if (field?.type === fieldTypes.Text.name) {
                  return (
                    <Grid.Column key={index}>
                      <Form.Field key={index} className="field" fluid="true">
                        <label>{field.required === false ? field.name : `${field.name} [Required]`}</label>
                        <input type="text" name={field.name} placeholder={field.placeholder ? field.placeholder : "[input placeholder text]"} />
                      </Form.Field>
                    </Grid.Column>
                  );
                }

                if (field.type && field.type === "Dropdown") {
                  let options = createDropdownOptions(field.options);
                  return (
                    <Grid.Column key={index}>
                      <Form.Field key={index} className="field" fluid="true">
                        <label>{field.required === false ? field.name : `${field.name} [Required]`}</label>
                        <Select placeholder={field.placeholder ? field.placeholder : "[dropdown placeholder text]"} options={options} />
                      </Form.Field>
                    </Grid.Column>
                  );
                }

                if (field.type && field.type === "Textarea") {
                  return (
                    <Grid.Column key={index}>
                      <Form.Field key={index} className="field" fluid="true">
                        <label>{field.required === false ? field.name : `${field.name} [Required]`}</label>
                        <TextArea name={field.name} placeholder={field.placeholder ? field.placeholder : "[textarea placeholder text]"} />
                      </Form.Field>
                    </Grid.Column>
                  );
                }

                if (field.type && field.type === "Checkbox") {
                  return (
                    <Grid.Column key={index}>
                      <Form.Field className="field" fluid="true">
                        <label>{field.required === false ? "&nbsp;" : "[Required]"}</label>
                        <Checkbox name={field.name} label={field.placeholder ? field.placeholder : "[checkbox content = placeholder text]"} />
                      </Form.Field>
                    </Grid.Column>
                  );
                }

                if (field.type && field.type === "ImagesLoader") {
                  return (
                    <Grid.Column key={index} width={16}>
                      <Form.Field className="field" fluid="true">
                        <label>{field.required === false ? field.name : `${field.name} [Required]`}</label>
                        <Segment attached="top" style={{ marginTop: 0 }}>
                          <ImagesLoader PreviewMode={true} />
                        </Segment>
                        <Segment attached="bottom">
                          <Header sub color="blue">
                            Images:{" "}
                            {imageRegistry && imageRegistry.size > 1 && (
                              <Button compact size="mini" onClick={removeAllImages}>
                                Remove All
                              </Button>
                            )}
                          </Header>
  
                          <div style={{ display: "flex", justifyContent: "flex-start", flexWrap: "wrap" }}>
                            {imageRegistry &&
                              imageRegistry.size > 0 &&
                              Array.from(imageRegistry).map((blob) => {
                                let imageUrl = URL.createObjectURL(blob[1]);
                                let imageKey = blob[0];
                                console.log("From Image Registry: ", blob); //remove
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
                      </Form.Field>
                    </Grid.Column>
                  );
                }

                if (field.type && field.type === "ImageCropperLoader") {
                  return (
                    <Grid.Column key={index} width={16}>
                      <Form.Field className="field" fluid="true">
                        <label>{field.required === false ? field.name : `${field.name} [Required]`}</label>
                        <Segment attached="top" style={{ marginTop: 0 }}>
                          <ImageCropperLoader PreviewMode={true} />
                        </Segment>
                        <Segment attached="bottom">
                          <Header sub color="blue">
                            Images:{" "}
                            {images && images.size > 1 && (
                              <Button compact size="mini" onClick={removeAllImages}>
                                Remove All
                              </Button>
                            )}
                          </Header>

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
                      </Form.Field>
                    </Grid.Column>
                  );
                }

                return false;
              })}
          </Grid>
        </Form>
      </Segment>
    </>
  );
};

export default observer(ReportTypeForm);
