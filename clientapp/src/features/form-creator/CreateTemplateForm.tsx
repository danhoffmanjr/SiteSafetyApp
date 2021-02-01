import { yupResolver } from "@hookform/resolvers/yup";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form, Header, Icon, Menu, Segment } from "semantic-ui-react";
import { IFormField } from "../../app/models/formField";
import * as yup from "yup";
import { IFormTemplateValues } from "../../app/models/formTemplateValues";
import AddFieldForm from "./AddFieldForm";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { AxiosResponse } from "axios";

const CreateTemplateForm = () => {
  const [fields, setFields] = useState<IFormField[]>([]);
  const [showAddFieldsForm, setShowAddFieldsForm] = useState(false);
  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();

  const validationSchema = yup.object().shape({
    name: yup.string().required("Template Name is a required field"),
    fields: yup.string().required("Must have at least 1 form field"),
  });

  const { handleSubmit, register, errors, formState, control, setValue } = useForm<IFormTemplateValues>({
    resolver: yupResolver(validationSchema),
  });

  const { isDirty, isSubmitting } = formState;

  const onSubmit = (values: IFormTemplateValues) => {
    console.log(values);
  };

  const toggleForm = () => {
    setShowAddFieldsForm(!showAddFieldsForm);
  };

  return (
    <Segment>
      <Header as="h3">Create Form Template</Header>
      <Form onSubmit={handleSubmit(onSubmit)} error>
        <Form.Field className={errors.name !== undefined ? "error field" : "field"}>
          <label>Template Name</label>
          <input type="text" name="name" placeholder="Form Template Name" aria-invalid={errors.name !== undefined} ref={register} />
          {errors.name && (
            <div className="ui pointing above prompt label" id="form-input-name-error-message" role="alert" aria-atomic="true">
              {errors.name.message}
            </div>
          )}
        </Form.Field>
        <Form.Field className={errors.fields !== undefined ? "error field" : "field"}>
          <label>Form Fields</label>
          <input type="hidden" name="fields" value={fields?.join()} aria-invalid={errors.name !== undefined} ref={register} />
          <Segment attached>
            <Menu stackable attached="top">
              <Menu.Item onClick={toggleForm} style={showAddFieldsForm ? { backgroundColor: "red", color: "#FFF", fontWeight: "bold" } : null}>
                {showAddFieldsForm ? <Icon name="times" /> : <Icon name="plus" />}
                {showAddFieldsForm ? "Cancel" : "Add Field"}
              </Menu.Item>
            </Menu>
            {showAddFieldsForm && (
              <Segment attached>
                <AddFieldForm />
              </Segment>
            )}
            {(fields[0] && (
              <Segment attached>
                {fields.map((field) => {
                  <p>{field.name}</p>;
                })}
              </Segment>
            )) || (
              <Segment attached>
                <p>
                  No fields. Click the <em>Add Field</em> button above.
                </p>
              </Segment>
            )}
          </Segment>
          {errors.fields && (
            <div className="ui pointing above prompt label" id="form-input-fields-error-message" role="alert" aria-atomic="true">
              {errors.fields.message}
            </div>
          )}
        </Form.Field>
        <Button color="green" content="Create" disabled={!isDirty} loading={isSubmitting} />
        {submitErrors && <ErrorMessage error={submitErrors!} />}
      </Form>
    </Segment>
  );
};

export default CreateTemplateForm;
