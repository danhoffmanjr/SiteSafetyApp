import React, { ChangeEvent, useContext, useEffect, useState } from "react";
import { Control, Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Button, Checkbox, Form, Header, Icon, Menu, Segment, Select, TextArea } from "semantic-ui-react";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { AxiosResponse } from "axios";
import { RootStoreContext } from "../../app/stores/rootStore";
import ReactSelect from "react-select";
import { ISelectOptions } from "../../app/models/reactSelectOptions";

const CreateTemplateForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { fieldTypeOptions, isRequiredOptions } = rootStore.formStore; // change optins list to work with Semantic-UI select components

  const [showAddFieldsForm, setShowAddFieldsForm] = useState(true);
  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();

  const { handleSubmit, register, watch, errors, formState, control, setValue } = useForm({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      title: "",
      fields: [
        {
          type: "",
          name: "",
          placeholder: "",
          options: "",
          isRequired: true,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const { isDirty, isSubmitting } = formState;

  const onSubmit = (values: { title: string; fields: { type: string; name: string; placeholder: string; options: string; isRequired: boolean }[] }) => {
    console.log(values);
  };

  const toggleForm = () => {
    setShowAddFieldsForm(!showAddFieldsForm);
  };

  const handleTypeChange = (name: string, option: ISelectOptions) => {
    if (option !== null) {
      console.log("Name:", name);
      console.log("Value:", option.value);
      setValue(name, option.value);
    }
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
  const Fields = ({ control }: { control: Control<{ title: string; fields: { type: string; name: string; placeholder: string; options: string; isRequired: boolean }[] }> }) => {
    const fields = useWatch<{ type: string; name: string; placeholder: string; options: string; isRequired: boolean }[]>({
      control,
      name: `fields`,
    });
    return (
      <div>
        {fields?.map((field, index) => {
          if (field.type === "Text") {
            return (
              <Form.Field key={index} className="field" fluid="true">
                <label>{field.name}</label>
                <input type="text" name={field.name} placeholder={field.placeholder} />
              </Form.Field>
            );
          }

          if (field.type === "Dropdown") {
            let options = createDropdownOptions(field.options);
            return (
              <Form.Field key={index} className="field" fluid="true">
                <label>{field.name}</label>
                <Select placeholder={field.placeholder} options={options} />
              </Form.Field>
            );
          }

          if (field.type === "Textarea") {
            return (
              <Form.Field key={index} className="field" fluid="true">
                <label>{field.name}</label>
                <TextArea name={field.name} placeholder={field.placeholder} />
              </Form.Field>
            );
          }

          if (field.type === "Checkbox") {
            return (
              <Form.Field key={index} className="field" fluid="true">
                <Checkbox name={field.name} placeholder={field.placeholder} label={field.name} />
              </Form.Field>
            );
          }

          return false;
        })}
      </div>
    );
  };

  return (
    <Segment>
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
          <Menu.Item onClick={toggleForm}>
            <Icon name="list" /> Manage Fields
          </Menu.Item>
        </Menu>
        <Segment attached>
          {fields.map(({ id, type, name, placeholder, options, isRequired }, index) => (
            <Form.Group key={id} widths="equal">
              <Form.Field className={errors.fields && errors.fields[index]?.type?.message !== undefined ? "error field" : "field"}>
                <label>{errors.fields && errors.fields[index]?.type?.message !== undefined ? errors.fields[index]?.type?.message : "Type"}</label>
                <Controller
                  control={control}
                  name={`fields[${index}].type`}
                  rules={{ required: "Type is Required*" }} // Rules is not working, not sure why?
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
                    />
                  )}
                />
                {/* <select
                  name={`fields[${index}].type`}
                  ref={register({
                    required: "Type is Required*",
                  })}
                  placeholder="Field Type"
                  defaultValue={type}
                  aria-invalid={errors.fields && errors.fields[index]?.type?.message !== undefined}
                >
                  <option value={undefined}></option>
                  <option value="Dropdown">Dropdown</option>
                  <option value="Text">Text</option>
                  <option value="Textarea">Textarea</option>
                  <option value="Checkbox">Checkbox</option>
                </select> */}
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
                  rules={{ required: "Is Required is Required*" }} // Rules is not working, not sure why?
                  render={({ onChange, value, name }) => (
                    <ReactSelect
                      options={isRequiredOptions}
                      onChange={(value) => {
                        onChange(value);
                        setValue(name, value.value);
                      }}
                      value={value?.value}
                      name={name}
                      defaultValue={{ label: "Yes", value: 1 }}
                      isClearable={false}
                    />
                  )}
                />
                {/* <select
                  name={`fields[${index}].isRequired`}
                  ref={register({
                    required: "Is Required is Required*",
                  })}
                  placeholder="Is Required"
                  defaultValue={isRequired}
                  aria-invalid={errors.fields && errors.fields[index]?.isRequired?.message !== undefined}
                >
                  <option value={1}>Yes</option>
                  <option value={0}>No</option>
                </select> */}
              </Form.Field>
              <Form.Field width={1}>
                <label>&nbsp;</label>
                <Button icon onClick={() => remove(index)}>
                  <Icon color="red" name="trash" />
                </Button>
              </Form.Field>
            </Form.Group>
          ))}
          <Button type="button" color="blue" content="Add Field" onClick={() => append({ name: "", type: "", placeholder: "", options: "", isRequired: true })} />
        </Segment>
        {(fields.length > 0 && (
          <Segment attached>
            <label>Form Preview</label>

            <Fields control={control} />
          </Segment>
        )) || (
          <Segment attached>
            <p>
              No fields. Click the <em>Add Field</em> button above.
            </p>
          </Segment>
        )}
        <Button color="green" content="Create Form" type="submit" disabled={!isDirty} loading={isSubmitting} style={{ marginTop: "1em" }} />
        {submitErrors && <ErrorMessage error={submitErrors!} />}
      </Form>
    </Segment>
  );
};

export default CreateTemplateForm;
