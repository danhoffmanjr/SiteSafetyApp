import React, { useContext } from "react";
import { Control, useWatch } from "react-hook-form";
import { IFormTemplate } from "../../app/models/formTemplate";
import { IFormFieldType } from "../../app/models/formFieldType";
import { Button, Checkbox, Form, Grid, Header, Icon, Image, Label, Menu, Segment, Select, TextArea } from "semantic-ui-react";
import ImageUploader from "../../app/common/imageUpload/ImageUploader";
import { RootStoreContext } from "../../app/stores/rootStore";
import { observer } from "mobx-react-lite";

const FormBuilder = ({ control }: { control: Control<IFormTemplate> }) => {
  const rootStore = useContext(RootStoreContext);
  const { createDropdownOptions } = rootStore.formStore;
  const { removeImage, imageRegistry } = rootStore.imageStore;

  const fieldArray = useWatch<IFormFieldType[]>({
    control,
    name: `fields`,
    defaultValue: [{ type: "", name: "[Name]", placeholder: "[Placeholder]", options: "", isRequired: 1 }],
  });

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
            {/* <div>{JSON.stringify(fieldArray)}</div> */}
            {fieldArray.map((field, index) => {
              if (field === undefined) return false;
              if (field && field.type === undefined) return false;

              if (field.type && field.type === "Text") {
                return (
                  <Grid.Column key={index}>
                    <Form.Field key={index} className="field" fluid="true">
                      <label>{field.name ? field.name : "[Field Name]"}</label>
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
                      <label>{field.name ? field.name : "[Field Name]"}</label>
                      <Select placeholder={field.placeholder ? field.placeholder : "[dropdown placeholder text]"} options={options} />
                    </Form.Field>
                  </Grid.Column>
                );
              }

              if (field.type && field.type === "Textarea") {
                return (
                  <Grid.Column key={index}>
                    <Form.Field key={index} className="field" fluid="true">
                      <label>{field.name ? field.name : "[Field Name]"}</label>
                      <TextArea name={field.name} placeholder={field.placeholder ? field.placeholder : "[textarea placeholder text]"} />
                    </Form.Field>
                  </Grid.Column>
                );
              }

              if (field.type && field.type === "Checkbox") {
                return (
                  <Grid.Column key={index}>
                    <Form.Field key={index} className="field" fluid="true">
                      <Checkbox name={field.name} label={field.placeholder ? field.placeholder : "[checkbox content = placeholder text]"} />
                    </Form.Field>
                  </Grid.Column>
                );
              }

              if (field.type && field.type === "ImageUploader") {
                return (
                  <Grid.Column key={index} width={16}>
                    <Form.Field className="field" fluid="true">
                      <label>{field.name ? field.name : "[Field Name]"}</label>
                      <Segment attached="top" style={{ marginTop: 0 }}>
                        <ImageUploader />
                      </Segment>
                      <Segment attached="bottom">
                        <Header sub color="blue" content="Images:" />
                        <div style={{ display: "flex", justifyContent: "flex-start", flexWrap: "wrap" }}>
                          {imageRegistry &&
                            imageRegistry.size > 0 &&
                            Array.from(imageRegistry).map((blob) => (
                              <Segment style={{ padding: 0, margin: "0 1em 1em 0 " }}>
                                <Image src={URL.createObjectURL(blob[1])} alt={blob[0]} style={{ maxHeight: 100 }} />
                                <Button fluid compact size="mini" attached="bottom" onClick={() => removeImage(blob[0])}>
                                  Remove
                                </Button>
                              </Segment>
                            ))}
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
