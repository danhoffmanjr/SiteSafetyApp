import React, { useContext, useState } from "react";
import { Button, Checkbox, Form, Grid, Header, Segment, Select, TextArea, Image, Message, Icon } from "semantic-ui-react";
import ImageUploader from "../../app/common/imageUpload/ImageUploader";
import { IReportTypeField } from "../../app/models/reportTypeField";
import { RootStoreContext } from "../../app/stores/rootStore";

interface Props {
  reportFields: IReportTypeField[];
}

const ReportFieldsRenderer = ({ reportFields }: Props) => {
  const rootStore = useContext(RootStoreContext);
  const { createDropdownOptions, fieldTypes } = rootStore.reportTypeStore;
  const { removeImage, removeAllImages, imageRegistry } = rootStore.imageStore;

  const [images, setImages] = useState<Map<string, Blob>>();

  const handleRemoveImage = (url: string, key: string) => {
    URL.revokeObjectURL(url);
    removeImage(key);
  };

  return (
    <Grid stackable columns={3} padded={reportFields.length < 1 ? true : false}>
      {reportFields.length < 1 && (
        <Message icon>
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header>Report Type Fields...</Message.Header>
            This section will populate once a Report Type has been selected above.
          </Message.Content>
        </Message>
      )}
      {reportFields &&
        reportFields.map((field, index) => {
          if (field === undefined) return false;
          if (field?.type === undefined) return false;

          if (field?.type === fieldTypes.Text.name) {
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
                    <ImageUploader PreviewMode={true} />
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
  );
};

export default ReportFieldsRenderer;
