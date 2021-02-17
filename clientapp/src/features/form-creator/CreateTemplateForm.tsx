import React, { useContext, useState } from "react";
import { Control, Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Button, Checkbox, Form, Grid, Header, Icon, Menu, Segment, Select, TextArea } from "semantic-ui-react";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { AxiosResponse } from "axios";
import { RootStoreContext } from "../../app/stores/rootStore";
import ReactSelect from "react-select";
import "./CreateTemplateForm.scss";
import { IFormFieldType } from "../../app/models/formFieldType";
import { IFormTemplate } from "../../app/models/formTemplate";
import { observer } from "mobx-react-lite";

const CreateTemplateForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { fieldTypeOptions, isRequiredOptions } = rootStore.formStore;

  const [showAddFieldsForm, setShowAddFieldsForm] = useState(true);
  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();

  const { handleSubmit, register, watch, errors, formState, control, setValue } = useForm<IFormTemplate>({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      title: "",
      fields: [
        {
          type: "",
          name: "",
          placeholder: "",
          options: "",
          isRequired: 1,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const { isDirty, isSubmitting } = formState;

  const onSubmit = (values: IFormTemplate) => {
    console.log(values);
  };

  const toggleForm = () => {
    setShowAddFieldsForm(!showAddFieldsForm);
  };

  // move to common store as an action
  const createDropdownOptions = (options: string) => {
    let optionsArray = options.split(",");
    let dropdownOptions: { key: string; value: string; text: string }[] = [];
    optionsArray.map((option, index) => {
      dropdownOptions.push({ key: `${index}`, value: `${option}`, text: `${option}` });
    });
    return dropdownOptions;
  };

  // create HOC from this
  const Fields = ({ control }: { control: Control<IFormTemplate> }) => {
    const fieldArray = useWatch<IFormFieldType[]>({
      control,
      name: `fields`,
      defaultValue: [{ type: "Text", name: "[Name]", placeholder: "[Placeholder]", options: "", isRequired: 1 }],
    });
    return (
      <>
        {fieldArray?.map((field, index) => {
          if (field.type === "Text") {
            return (
              <Grid.Column key={index}>
                <Form.Field key={index} className="field" fluid="true">
                  <label>{field.name}</label>
                  <input type="text" name={field.name} placeholder={field.placeholder} />
                </Form.Field>
              </Grid.Column>
            );
          }

          if (field.type === "Dropdown") {
            let options = createDropdownOptions(field.options);
            return (
              <Grid.Column key={index}>
                <Form.Field key={index} className="field" fluid="true">
                  <label>{field.name}</label>
                  <Select placeholder={field.placeholder} options={options} />
                </Form.Field>
              </Grid.Column>
            );
          }

          if (field.type === "Textarea") {
            return (
              <Grid.Column key={index}>
                <Form.Field key={index} className="field" fluid="true">
                  <label>{field.name}</label>
                  <TextArea name={field.name} placeholder={field.placeholder} />
                </Form.Field>
              </Grid.Column>
            );
          }

          if (field.type === "Checkbox") {
            return (
              <Grid.Column key={index}>
                <Form.Field key={index} className="field" fluid="true">
                  <Checkbox name={field.name} placeholder={field.placeholder} label={field.name} />
                </Form.Field>
              </Grid.Column>
            );
          }

          return false;
        })}
      </>
    );
  };

  return (
    <Segment style={{ marginBottom: "2em" }}>
      <Header as="h3">Create Form Type</Header>
      <Form onSubmit={handleSubmit(onSubmit)} error>
        <Form.Field className={errors.title !== undefined ? "error field" : "field"}>
          <label>Form Title</label>
          <input
            type="text"
            name="title"
            placeholder="Form Title"
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
        <Form.Field className={errors.fields !== undefined ? "error field" : "field"} style={{ marginBottom: 0 }}>
          <label>{errors.fields !== undefined ? "Form Fields - ERRORS: Please fix the errors indicated below" : "Form Fields"}</label>
        </Form.Field>
        <Menu stackable attached="top" style={{ marginTop: 0 }}>
          <Menu.Item>
            <Icon name="list" /> Manage Fields
          </Menu.Item>
          <Menu.Item onClick={toggleForm}>
            {/* This doesn't work with useWatch. When hidden (removed from DOM) only the default field is rendered in preview. It's an issue with useFieldArray hook (see line 37) */}
            {showAddFieldsForm ? <Icon name="eye slash outline" /> : <Icon name="eye" />}
            {showAddFieldsForm ? "Hide" : "Show"}
          </Menu.Item>
          <Menu.Item position="right">
            <Button color="green" content="Create Form" type="submit" disabled={!isDirty} loading={isSubmitting} />
          </Menu.Item>
        </Menu>
        <Segment attached className={showAddFieldsForm ? "show" : "hide"}>
          {fields.map(({ id, type, name, placeholder, options, isRequired }, index) => (
            <Form.Group key={id} widths="equal">
              <Form.Field className={errors.fields && errors.fields[index]?.type?.message !== undefined ? "error field" : "field"}>
                <label>{errors.fields && errors.fields[index]?.type?.message !== undefined ? errors.fields[index]?.type?.message : "Type"}</label>
                <Controller
                  control={control}
                  name={`fields[${index}].type`}
                  defaultValue={isRequired}
                  rules={{ required: "Type is Required*" }}
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
              <Form.Field className={errors.fields && errors.fields[index]?.name?.message !== undefined ? "error field" : "field"}>
                <label>{errors.fields && errors.fields[index]?.name?.message !== undefined ? errors.fields[index]?.name?.message : "Name"}</label>
                <input
                  type="text"
                  name={`fields[${index}].name`}
                  placeholder="Field Name"
                  aria-invalid={errors.fields && errors.fields[index]?.name?.message !== undefined}
                  ref={register({
                    required: "Name is Required*",
                  })}
                  defaultValue={name}
                />
              </Form.Field>
              <Form.Field className={errors.fields && errors.fields[index]?.placeholder?.message !== undefined ? "error field" : "field"}>
                <label>{errors.fields && errors.fields[index]?.placeholder?.message !== undefined ? errors.fields[index]?.placeholder?.message : "Placeholder"}</label>
                <input
                  type="text"
                  name={`fields[${index}].placeholder`}
                  placeholder="Field Placeholder Text"
                  aria-invalid={errors.fields && errors.fields[index]?.placeholder?.message !== undefined}
                  ref={register({
                    required: "Placeholder is Required*",
                  })}
                  defaultValue={placeholder}
                />
              </Form.Field>
              <Form.Field className={errors.fields && errors.fields[index]?.options?.message !== undefined ? "error field" : "field"} disabled={watch(`fields[${index}].type`) !== "Dropdown"}>
                <label>{errors.fields && errors.fields[index]?.options?.message !== undefined ? errors.fields[index]?.options?.message : "Dropdown Options"}</label>
                <input
                  type="text"
                  name={`fields[${index}].options`}
                  placeholder="Comma separated list"
                  aria-invalid={errors.fields && errors.fields[index]?.options?.message !== undefined}
                  defaultValue={options}
                  ref={register({
                    required: { value: watch(`fields[${index}].type`) === "Dropdown", message: "Options are Required*" },
                  })}
                />
              </Form.Field>
              <Form.Field className={errors.fields && errors.fields[index]?.isRequired?.message !== undefined ? "error field" : "field"}>
                <label>{errors.fields && errors.fields[index]?.isRequired?.message !== undefined ? errors.fields[index]?.isRequired?.message : "Is Required"}</label>
                <Controller
                  control={control}
                  name={`fields[${index}].isRequired`}
                  rules={{ required: "Is Required is Required*" }}
                  render={({ onChange, value, name }) => (
                    <ReactSelect
                      options={isRequiredOptions}
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
              </Form.Field>
              <Form.Field width={1}>
                <label>&nbsp;</label>
                <Button icon onClick={() => remove(index)}>
                  <Icon color="red" name="trash alternate" />
                </Button>
              </Form.Field>
            </Form.Group>
          ))}
          <Button type="button" color="blue" content="Add Field" onClick={() => append({ type: "Text", name: "", placeholder: "", options: "", isRequired: 1 }, true)} />
        </Segment>
        {submitErrors && <ErrorMessage error={submitErrors!} />}
      </Form>
      {(fields.length > 0 && (
        <>
          <Menu stackable attached="top" inverted style={{ backgroundColor: "#696969", border: "1px solid #696969" }}>
            <Menu.Item color="grey">
              <Icon name="wordpress forms" size="large" /> Form Preview
            </Menu.Item>
          </Menu>
          <Segment attached="bottom" inverted style={{ backgroundColor: "#808080", border: "1px solid #808080" }}>
            <Form inverted>
              <Grid stackable columns={3}>
                <Fields control={control} />
              </Grid>
            </Form>
          </Segment>
        </>
      )) || (
        <>
          <Menu stackable>
            <Menu.Item>
              <Icon name="wordpress forms" size="large" /> Form Preview
            </Menu.Item>
            <Menu.Item>
              <strong style={{ color: "red" }}>No fields to show.</strong>&nbsp; Add fields in the Manage Fields section above.
            </Menu.Item>
          </Menu>
        </>
      )}
    </Segment>
  );
};

export default observer(CreateTemplateForm);
