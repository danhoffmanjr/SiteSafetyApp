import React from "react";
import { Grid, Form, Segment } from "semantic-ui-react";
import ImageCropperLoader from "../imageUpload/ImageCropperLoader";

const AddImageWithCropperField = () => {
  return (
    <Grid.Column width={16}>
      <Form.Field className="field" fluid="true">
        <label>Add Cropped Image</label>
        <Segment attached="top" style={{ marginTop: 0 }}>
          <ImageCropperLoader PreviewMode={true} />
        </Segment>
      </Form.Field>
    </Grid.Column>
  );
};

export default AddImageWithCropperField;
