import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { AxiosResponse } from "axios";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { IImageUpdateFormValues } from "../../app/models/imageUpdateFormValues";
import { RootStoreContext } from "../../app/stores/rootStore";
import { Controller, useForm } from "react-hook-form";
import { observer } from "mobx-react-lite";
import { Form, Button, Image, TextArea, Divider, Grid, Segment, Label } from "semantic-ui-react";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { Link, RouteComponentProps } from "react-router-dom";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { toJS } from "mobx";

interface RouteParams {
  id: string;
}

interface IProps extends RouteComponentProps<RouteParams> {}

const ImageForm = ({ match }: IProps) => {
  const rootStore = useContext(RootStoreContext);
  const { loadImageById, image, updateImage, loading, isSubmitting } = rootStore.imageStore;
  const [defaultValues, setDefaultValues] = useState<IImageUpdateFormValues>({ id: 0, fileName: "what the heck?", description: "where's my data?" });

  useEffect(() => {
    loadImageById(match.params.id);
  }, [loadImageById, match]);

  useEffect(() => {
    if (image) {
      setDefaultValues({ id: image.id, fileName: image.fileName, description: image.description });
      reset({ id: image.id, fileName: image.fileName, description: image.description });
    }
  }, [image]);

  const validationSchema = yup.object().shape({
    id: yup.string().required("Id is Required"),
    fileName: yup.string().required("Image Name is Required").min(2, "Image Name must be at least 2 characters"),
    description: yup.string(),
  });

  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();

  const { handleSubmit, register, errors, control, setValue, reset, formState } = useForm<IImageUpdateFormValues>({
    defaultValues: defaultValues,
    resolver: yupResolver(validationSchema),
  });

  const { isDirty } = formState;

  const onSubmit = (values: IImageUpdateFormValues) => {
    updateImage(values).catch((error) => {
      console.log("Update Image Error:", error.statusText); //remove
      setSubmitErrors(error);
    });
  };

  if (loading) return <LoadingComponent content="Loading image..." />;

  return (
    <Grid centered columns={2}>
      <Grid.Column>
        <Segment>
          <Form onSubmit={handleSubmit(onSubmit)} error>
            <input type="hidden" name="id" ref={register} />
            <Image src={image?.imageDataUrl} alt={image?.fileName} />
            <Divider horizontal />
            <Form.Field className={errors.fileName !== undefined ? "error field" : "field"}>
              <label>Name</label>
              <input type="text" name="fileName" placeholder="Image Name" aria-invalid={errors.fileName !== undefined} ref={register} />
              {errors.fileName && (
                <div className="ui pointing above prompt label" id="form-input-image-name-error-message" role="alert" aria-atomic="true">
                  {errors.fileName.message}
                </div>
              )}
            </Form.Field>
            <Form.Field className={errors.description !== undefined ? "error field" : "field"}>
              <label>Description</label>
              <Controller
                name="description"
                defaultValue={image?.description}
                control={control}
                render={({ onChange, name, value }) => (
                  <TextArea
                    name={name}
                    placeholder="add description for image"
                    onChange={(e) => {
                      onChange(e.target.value);
                      setValue(name, e.target.value);
                    }}
                    value={value}
                  />
                )}
              />
              {errors.description && (
                <div className="ui pointing above prompt label" id="form-input-description-error-message" role="alert" aria-atomic="true">
                  {errors.description.message}
                </div>
              )}
            </Form.Field>
            <Button.Group>
              <Button type="button" as={Link} to={`/reports/manage/${image?.reportId}`}>
                Cancel
              </Button>
              <Button.Or />
              <Button positive disabled={!isDirty} loading={isSubmitting}>
                Update
              </Button>
            </Button.Group>
            {submitErrors && <ErrorMessage error={submitErrors!} />}
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ImageForm);
