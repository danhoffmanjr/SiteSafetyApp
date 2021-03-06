import { AxiosResponse } from "axios";
import React, { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { IReportType } from "../../app/models/reportType";
import { RootStoreContext } from "../../app/stores/rootStore";
import { Button, Checkbox, Form, Header, Icon, Menu, Segment } from "semantic-ui-react";
import ReactSelect from "react-select";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { observer } from "mobx-react-lite";
import ReportTypeFormPreviewer from "./ReportTypeFormPreviewer";
import { IReportTypeFormValues } from "../../app/models/reportTypeFormValues";

const styles = {
  hide: {
    display: "none",
  },
  show: {
    display: "inherit",
  },
};

const findmax = (array: string[]) => {
  let fieldIds = array.map(Number);
  let max = 0;

  for (let i = 0; i < array.length; i++) {
    if (fieldIds[i] > max) {
      max = fieldIds[i];
    }
  }
  return max;
};

const CreateReportTypeForm = ({
  startingState = {
    id: 0,
    title: "",
    requireImages: false,
    fields: [{ type: "", name: "", placeholder: "", options: "", required: true, value: "" }],
  },
}) => {
  const rootStore = useContext(RootStoreContext);
  const { fieldTypeOptions, fieldTypes, createReportType } = rootStore.reportTypeStore;

  const [showAddFieldsForm, setShowAddFieldsForm] = useState(true);
  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();

  const { handleSubmit, register, watch, errors, formState, control, setValue } = useForm<IReportType>({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: startingState,
  });

  const { isDirty, isSubmitting } = formState;

  const [fieldIds, setFieldIds] = useState(Object.keys(startingState.fields));

  const addField = () => {
    let max = findmax(fieldIds);
    setFieldIds([...fieldIds, (max + 1).toString()]);
  };

  const removeField = (index: string) => {
    let fieldIdArray = fieldIds.filter((i) => i !== index);
    if (fieldIdArray == null) fieldIdArray = [];
    setFieldIds(fieldIdArray);
  };

  const onSubmit = (data: IReportType) => {
    let values: IReportTypeFormValues = { ...data, fields: JSON.stringify(data.fields) };
    console.log(values); // remove
    createReportType(values).catch((error) => {
      setSubmitErrors(error);
    });
  };

  const toggleForm = () => {
    setShowAddFieldsForm(!showAddFieldsForm);
  };

  const getFieldType = (name: string) => {
    if (name === undefined || name === "") return "Text" as keyof typeof fieldTypes;
    return name as keyof typeof fieldTypes;
  };

  return (
    <Segment style={{ marginBottom: "2em" }}>
      <Header as="h3">Create Form Type</Header>
      <Form onSubmit={handleSubmit(onSubmit)} error>
        <Form.Group>
          <Form.Field width={15} className={errors.title !== undefined ? "error field" : "field"}>
            <label>Form Title</label>
            <input
              type="text"
              name="title"
              placeholder="Form Title"
              defaultValue=""
              aria-invalid={errors.title !== undefined}
              ref={register({
                required: "Form Title is Required*",
              })}
            />
            {errors.title && (
              <div className="ui pointing above prompt label" id="form-input-title-error-message" role="alert" aria-atomic="true">
                {errors.title.message}
              </div>
            )}
          </Form.Field>
          <Form.Field width={3} className={errors.requireImages !== undefined ? "error field" : "field"}>
            <label>&nbsp;</label>
            <Controller
              control={control}
              name="requireImages"
              defaultValue={false}
              render={({ onChange, value, name }) => (
                <Checkbox
                  fitted
                  toggle
                  style={{ marginTop: 8 }}
                  name={name}
                  onChange={() => {
                    onChange(!value);
                  }}
                  label="Require Images"
                  checked={value}
                />
              )}
            />
          </Form.Field>
        </Form.Group>
        <Form.Field className={errors.fields !== undefined ? "error field" : "field"} style={{ marginBottom: 0 }}>
          <label>{errors.fields !== undefined ? "Form Fields - ERRORS: Please fix the errors indicated below" : "Form Fields"}</label>
        </Form.Field>
        <Menu stackable attached="top" style={{ marginTop: 0 }} size="small">
          <Menu.Item>
            <Icon name="list" /> Manage Fields
          </Menu.Item>
          <Menu.Item onClick={toggleForm}>
            {showAddFieldsForm ? <Icon name="eye slash outline" /> : <Icon name="eye" />}
            {showAddFieldsForm ? "Hide" : "Show"}
          </Menu.Item>
        </Menu>
        <Segment attached style={showAddFieldsForm ? styles.show : styles.hide}>
          {fieldIds.map((id) => (
            <Form.Group key={id} widths="equal">
              <Form.Field className={errors.fields && errors.fields[parseInt(id)]?.type?.message !== undefined ? "error field" : "field"}>
                <label>{errors.fields && errors.fields[parseInt(id)]?.type?.message !== undefined ? errors.fields[parseInt(id)]?.type?.message : "Type"}</label>
                <Controller
                  control={control}
                  name={`fields[${id}].type`}
                  rules={{ required: "Type is Required*" }}
                  defaultValue=""
                  render={({ onChange, value, name }) => (
                    <ReactSelect
                      options={fieldTypeOptions}
                      onChange={(value) => {
                        onChange(value);
                        setValue(name, value.value);
                      }}
                      value={value?.value}
                      name={name}
                      isClearable={false}
                      autoFocus={true}
                    />
                  )}
                />
              </Form.Field>
              <Form.Field className={errors.fields && errors.fields[parseInt(id)]?.name?.message !== undefined ? "error field" : "field"}>
                <label>{errors.fields && errors.fields[parseInt(id)]?.name?.message !== undefined ? errors.fields[parseInt(id)]?.name?.message : "Name"}</label>
                <input
                  type="text"
                  name={`fields[${id}].name`}
                  placeholder="Field Name"
                  defaultValue=""
                  aria-invalid={errors.fields && errors.fields[parseInt(id)]?.name?.message !== undefined}
                  ref={register({
                    required: "Name is Required*",
                  })}
                />
              </Form.Field>
              <Form.Field
                className={errors.fields && errors.fields[parseInt(id)]?.placeholder?.message !== undefined ? "error field" : "field"}
                disabled={!fieldTypes[getFieldType(watch(`fields[${id}].type`, "Text"))].requiresPlaceholder}
              >
                <label>{errors.fields && errors.fields[parseInt(id)]?.placeholder?.message !== undefined ? errors.fields[parseInt(id)]?.placeholder?.message : "Placeholder"}</label>
                <input
                  type="text"
                  name={`fields[${id}].placeholder`}
                  placeholder="Field Placeholder Text"
                  defaultValue=""
                  aria-invalid={errors.fields && errors.fields[parseInt(id)]?.placeholder?.message !== undefined}
                  ref={register({
                    required: { value: fieldTypes[getFieldType(watch(`fields[${id}].type`, "Text"))].requiresPlaceholder, message: "Placeholder is Required*" },
                  })}
                />
              </Form.Field>
              <Form.Field
                className={errors.fields && errors.fields[parseInt(id)]?.options?.message !== undefined ? "error field" : "field"}
                disabled={!fieldTypes[getFieldType(watch(`fields[${id}].type`, "Text"))].requiresOptions}
              >
                <label>{errors.fields && errors.fields[parseInt(id)]?.options?.message !== undefined ? errors.fields[parseInt(id)]?.options?.message : "Dropdown Options"}</label>
                <input
                  type="text"
                  name={`fields[${id}].options`}
                  placeholder="Comma separated list"
                  defaultValue=""
                  aria-invalid={errors.fields && errors.fields[parseInt(id)]?.options?.message !== undefined}
                  ref={register({
                    required: { value: fieldTypes[getFieldType(watch(`fields[${id}].type`, "Text"))].requiresOptions, message: "Options are Required*" },
                  })}
                />
              </Form.Field>
              <Form.Field width={1} className={errors.fields && errors.fields[parseInt(id)]?.required?.message !== undefined ? "error field" : "field"}>
                <label>{errors.fields && errors.fields[parseInt(id)]?.required?.message !== undefined ? errors.fields[parseInt(id)]?.required?.message : "Required"}</label>
                <Controller
                  control={control}
                  name={`fields[${id}].required`}
                  defaultValue={true}
                  render={({ onChange, value, name }) => (
                    <Checkbox
                      fitted
                      toggle
                      style={{ marginTop: 8 }}
                      name={name}
                      onChange={() => {
                        onChange(!value);
                      }}
                      label=""
                      checked={value}
                    />
                  )}
                />
              </Form.Field>
              <Form.Field width={1}>
                <label>&nbsp;</label>
                <Button icon onClick={() => removeField(id)}>
                  <Icon color="red" name="trash alternate" />
                </Button>
              </Form.Field>
            </Form.Group>
          ))}
        </Segment>
        <Menu stackable attached="bottom" style={{ marginTop: 0 }} size="small">
          <Menu.Item>
            <Button type="button" color="blue" content="Add Field" onClick={() => addField()} />
          </Menu.Item>
          <Menu.Item position="right">
            <Button type="submit" color="green" content="Create Form" disabled={!isDirty} loading={isSubmitting} />
          </Menu.Item>
        </Menu>
        {submitErrors && <ErrorMessage error={submitErrors!} />}
      </Form>
      {(fieldIds.length > 0 && <ReportTypeFormPreviewer control={control} />) || (
        <Menu stackable size="small">
          <Menu.Item>
            <Icon name="wordpress forms" size="large" /> Form Preview
          </Menu.Item>
          <Menu.Item>
            <strong style={{ color: "red" }}>No fields to show.</strong>&nbsp; Add fields in the Manage Fields section above.
          </Menu.Item>
        </Menu>
      )}
    </Segment>
  );
};

export default observer(CreateReportTypeForm);
