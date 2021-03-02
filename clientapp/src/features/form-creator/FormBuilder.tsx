import React, { useContext } from "react";
import { Control, useWatch } from "react-hook-form";
import { IReportType } from "../../app/models/reportType";
import { Button, Checkbox, Form, Grid, Header, Icon, Image, Menu, Segment, Select, TextArea } from "semantic-ui-react";
import ImageCropperLoader from "../../app/common/imageUpload/ImageCropperLoader";
import { RootStoreContext } from "../../app/stores/rootStore";
import { observer } from "mobx-react-lite";
import { FormBuilderFieldType } from "./FormBuilderFieldType";
import ImagesLoader from "../../app/common/imageUpload/ImagesLoader";

const FormBuilder = ({ control }: { control: Control<IReportType> }) => {
  const rootStore = useContext(RootStoreContext);
  const { createDropdownOptions, fieldTypes } = rootStore.reportTypeStore;
  const { removeImage, removeAllImages, imageRegistry } = rootStore.imageStore;

  const fieldArray = useWatch<FormBuilderFieldType[]>({
    control,
    name: `fields`,
    defaultValue: [{ Type: "", Name: "[Name]", Placeholder: "[Placeholder]", Options: "", Required: true }],
  });

  const handleRemoveImage = (url: string, key: string) => {
    URL.revokeObjectURL(url);
    removeImage(key);
  };

  return (
    <>
      <Menu stackable attached="top" inverted style={{ backgroundColor: "#696969", border: "1px solid #696969" }} size="small">
        <Menu.Item color="grey">
          <Icon name="wordpress forms" size="large" /> Form Preview
        </Menu.Item>
      </Menu>
      <Segment attached="bottom" inverted style={{ backgroundColor: "#808080", border: "1px solid #808080" }}>
        <Form inverted>
          <Grid stackable columns={3}>
            {fieldArray.map((field, index) => {
              if (field === undefined) return false;
              if (field?.Type === undefined) return false;

              if (field?.Type === fieldTypes.Text.name) {
                return (
                  <Grid.Column key={index}>
                    <Form.Field key={index} className="field" fluid="true">
                      <label>{field.Name ? field.Name : "[Field Name]"}</label>
                      <input type="text" name={field.Name} placeholder={field.Placeholder ? field.Placeholder : "[input placeholder text]"} />
                    </Form.Field>
                  </Grid.Column>
                );
              }

              if (field.Type && field.Type === "Dropdown") {
                let options = createDropdownOptions(field.Options);
                return (
                  <Grid.Column key={index}>
                    <Form.Field key={index} className="field" fluid="true">
                      <label>{field.Name ? field.Name : "[Field Name]"}</label>
                      <Select placeholder={field.Placeholder ? field.Placeholder : "[dropdown placeholder text]"} options={options} />
                    </Form.Field>
                  </Grid.Column>
                );
              }

              if (field.Type && field.Type === "Textarea") {
                return (
                  <Grid.Column key={index}>
                    <Form.Field key={index} className="field" fluid="true">
                      <label>{field.Name ? field.Name : "[Field Name]"}</label>
                      <TextArea name={field.Name} placeholder={field.Placeholder ? field.Placeholder : "[textarea placeholder text]"} />
                    </Form.Field>
                  </Grid.Column>
                );
              }

              if (field.Type && field.Type === "Checkbox") {
                return (
                  <Grid.Column key={index}>
                    <Form.Field key={index} className="field" fluid="true">
                      <Checkbox name={field.Name} label={field.Placeholder ? field.Placeholder : "[checkbox content = placeholder text]"} />
                    </Form.Field>
                  </Grid.Column>
                );
              }

              if (field.Type && field.Type === "ImagesLoader") {
                return (
                  <Grid.Column key={index} width={16}>
                    <Form.Field className="field" fluid="true">
                      <label>{field.Name ? field.Name : "[Field Name]"}</label>
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
                              console.log("From Image Registry: ", blob);
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

              if (field.Type && field.Type === "ImageCropperLoader") {
                return (
                  <Grid.Column key={index} width={16}>
                    <Form.Field className="field" fluid="true">
                      <label>{field.Name ? field.Name : "[Field Name]"}</label>
                      <Segment attached="top" style={{ marginTop: 0 }}>
                        <ImageCropperLoader PreviewMode={true} />
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
                              console.log("From Image Registry: ", blob);
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

export default observer(FormBuilder);
