import React from "react";
import { Form, Grid, Segment } from "semantic-ui-react";
import ImagesLoader from "../imageUpload/ImagesLoader";

const AddImagesField = () => {
  return (
    <Grid.Column width={16}>
      <Form.Field className="field" fluid="true">
        <label>Add Images</label>
        <Segment attached="top" style={{ marginTop: 0 }}>
          <ImagesLoader PreviewMode={true} />
        </Segment>
      </Form.Field>
    </Grid.Column>
  );
};

export default AddImagesField;
