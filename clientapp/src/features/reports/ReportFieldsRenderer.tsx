import React, { useContext, useEffect, useState } from "react";
import { Control, Controller, DeepMap, FieldError } from "react-hook-form";
import { Button, Checkbox, Form, Grid, Header, Segment, TextArea, Image, Message, Icon } from "semantic-ui-react";
import Select from "react-select";
import ImageUploader from "../../app/common/imageUpload/ImageUploader";
import { IReportField } from "../../app/models/reportField";
import { IReportFormValues } from "../../app/models/reportFormValues";
import { RootStoreContext } from "../../app/stores/rootStore";
import { observer } from "mobx-react-lite";

interface Props {
  reportTypeFields: IReportField[];
  control: Control<IReportFormValues>;
  register: any;
  setValue: any;
  errors: DeepMap<IReportFormValues, FieldError>;
}

const ReportFieldsRenderer = ({ reportTypeFields, control, register, errors, setValue }: Props) => {
  const rootStore = useContext(RootStoreContext);
  const { fieldTypes } = rootStore.reportTypeStore;
  const { createSelectOptionsFromString } = rootStore.reportStore;
  const { removeImage, removeAllImages, imageRegistry } = rootStore.imageStore;

  const [images, setImages] = useState<Map<string, Blob>>();

  useEffect(() => {
    setImages(imageRegistry);
  }, [imageRegistry]);

  useEffect(() => {
    register({ name: "reportFields.images" });
  }, []);

  useEffect(() => {
    if (images !== undefined && images.size > 0) {
      let imageEnumerator = images.entries();
      let imageArr = [];
      for (let i = 0; i < images.size; i++) {
        imageArr.push(imageEnumerator.next().value);
      }
      //TODO: map to IReportImage model
      setValue("reportFields.images", imageArr);
      setValue("reportFields.imageCount", images.size);
      console.log("useEffect ran"); //remove
    } else {
      setValue("reportFields.images", []);
      setValue("reportFields.imageCount", "");
    }
  }, [images?.size]);

  const handleRemoveImage = (url: string, key: string) => {
    URL.revokeObjectURL(url);
    removeImage(key);
  };

  return (
    <Grid stackable columns={3} padded={reportTypeFields.length < 1 ? true : false}>
      {reportTypeFields.length < 1 && (
        <Message icon>
          <Icon name="circle notched" loading />
          <Message.Content>
            <Message.Header>Report Type Fields...</Message.Header>
            This section will populate once a Report Type has been selected above.
          </Message.Content>
        </Message>
      )}
      {reportTypeFields?.map((field, index) => {
        if (field === undefined) return false;
        if (field?.type === undefined) return false;

        if (field?.type === fieldTypes.Text.name) {
          return (
            <Grid.Column key={index}>
              <Form.Field className={errors.reportFields && errors.reportFields[`${field.name}` as keyof typeof reportTypeFields] !== undefined ? "error field" : "field"}>
                <label>{field.name}</label>
                <input type="text" name={`reportFields.${field.name}`} placeholder={field.placeholder} ref={register({ required: field.required })} />
                {errors.reportFields && errors.reportFields[`${field.name}` as keyof typeof reportTypeFields] && (
                  <div className="ui pointing above prompt label" id="form-input-text-error-message" role="alert" aria-atomic="true">
                    {errors.reportFields[`${field.name}` as keyof typeof reportTypeFields] !== undefined ? `${field.name} is Required*` : false}
                  </div>
                )}
              </Form.Field>
            </Grid.Column>
          );
        }

        if (field?.type === fieldTypes.Dropdown.name) {
          let options = createSelectOptionsFromString(field.options!);
          return (
            <Grid.Column key={index}>
              <Form.Field className={errors.reportFields && errors.reportFields[`${field.name}` as keyof typeof reportTypeFields] !== undefined ? "error field" : "field"}>
                <label>{field.name}</label>
                <Controller
                  name={`reportFields.${field.name}`}
                  defaultValue={null}
                  control={control}
                  rules={{ required: field.required }}
                  render={({ onChange, name, value }) => (
                    <Select
                      options={options}
                      onChange={(value) => {
                        onChange(value);
                        setValue(name, value.value);
                      }}
                      value={value?.value}
                      name={name}
                      isClearable={false}
                    />
                  )}
                />
                {errors.reportFields && errors.reportFields[`${field.name}` as keyof typeof reportTypeFields] && (
                  <div className="ui pointing above prompt label" id="form-input-select-error-message" role="alert" aria-atomic="true">
                    {errors.reportFields[`${field.name}` as keyof typeof reportTypeFields] !== undefined ? `${field.name} is Required*` : false}
                  </div>
                )}
              </Form.Field>
            </Grid.Column>
          );
        }

        if (field?.type === fieldTypes.Textarea.name) {
          return (
            <Grid.Column key={index}>
              <Form.Field className={errors.reportFields && errors.reportFields[`${field.name}` as keyof typeof reportTypeFields] !== undefined ? "error field" : "field"}>
                <label>{field.name}</label>
                <Controller
                  name={`reportFields.${field.name}`}
                  defaultValue={""}
                  control={control}
                  rules={{ required: field.required }}
                  render={({ onChange, name, value }) => (
                    <TextArea
                      name={name}
                      placeholder={field.placeholder}
                      onChange={(e) => {
                        onChange(e.target.value);
                        setValue(name, e.target.value);
                      }}
                      value={value}
                    />
                  )}
                />
              </Form.Field>
              {errors.reportFields && errors.reportFields[`${field.name}` as keyof typeof reportTypeFields] && (
                <div className="ui pointing above prompt label" id="form-input-textarea-error-message" role="alert" aria-atomic="true">
                  {errors.reportFields[`${field.name}` as keyof typeof reportTypeFields] !== undefined ? `${field.name} is Required*` : false}
                </div>
              )}
            </Grid.Column>
          );
        }

        if (field?.type === fieldTypes.Checkbox.name) {
          return (
            <Grid.Column key={index}>
              <Form.Field className={errors.reportFields && errors.reportFields[`${field.name}` as keyof typeof reportTypeFields] !== undefined ? "error field" : "field"}>
                <label>&nbsp;</label>
                <Controller
                  name={`reportFields.${field.name}`}
                  defaultValue={false}
                  control={control}
                  rules={{ required: field.required }}
                  render={({ onChange, name, value }) => (
                    <Checkbox
                      name={name}
                      label={field.placeholder}
                      onChange={() => {
                        onChange(!value);
                      }}
                      checked={value}
                    />
                  )}
                />
                {errors.reportFields && errors.reportFields[`${field.name}` as keyof typeof reportTypeFields] && (
                  <div className="ui pointing above prompt label" id="form-input-textarea-error-message" role="alert" aria-atomic="true">
                    {errors.reportFields[`${field.name}` as keyof typeof reportTypeFields] !== undefined ? `${field.name} is Required*` : false}
                  </div>
                )}
              </Form.Field>
            </Grid.Column>
          );
        }

        if (field?.type === fieldTypes.ImageUploader.name) {
          return (
            <Grid.Column key={index} width={16}>
              <Form.Field className={errors.reportFields && errors.reportFields["imageCount" as keyof typeof reportTypeFields] !== undefined ? "error field" : "field"}>
                <label>{field.name}</label>
                <Segment attached="top" style={{ marginTop: 0 }}>
                  <ImageUploader PreviewMode={true} />
                </Segment>
                <Segment attached="bottom">
                  <Header sub color="blue">
                    Images:
                    <input type="hidden" name="reportFields.imageCount" ref={register({ required: field.required })} />
                    {errors.reportFields && errors.reportFields["imageCount" as keyof typeof reportTypeFields] && (
                      <div className="ui pointing below prompt label" id="form-input-textarea-error-message" role="alert" aria-atomic="true">
                        {errors.reportFields["imageCount" as keyof typeof reportTypeFields] !== undefined ? `${field.name} is Required*` : false}
                      </div>
                    )}
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

export default observer(ReportFieldsRenderer);
