import React, { useContext, useState } from "react";
import { IFormField } from "../../app/models/formField";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Button, Form, Icon } from "semantic-ui-react";
import Select from "react-select";
import { RootStoreContext } from "../../app/stores/rootStore";
import { ISelectOptions } from "../../app/models/reactSelectOptions";
import { isNoSubstitutionTemplateLiteral } from "typescript";

interface IProps {
  onAddField: (field: IFormField) => void;
}

const AddFieldForm: React.FC<IProps> = ({ onAddField }) => {
  const rootStore = useContext(RootStoreContext);
  const { fieldTypeOptions, isRequiredOptions } = rootStore.formStore;

  const [fieldType, setFieldType] = useState<string>();
  const [isRequired, setIsRequired] = useState<boolean>();
  const showOptions = fieldType !== "Checkbox" && fieldType !== "Dropdown";

  const validationSchema = yup.object().shape({
    type: yup.string().required("Field Type is a required field"),
    name: yup.string().required("Field Name is a required field"),
    placeholder: yup.string().required("Field Placeholder is a required field"),
    isRequired: yup.string().required("Is Required is a required field"),
    options: yup.string().when("type", { is: "Dropdown", then: yup.string().required("Options are required") }),
  });

  const { handleSubmit, register, errors, formState, control, setValue, watch } = useForm<IFormField>({
    resolver: yupResolver(validationSchema),
  });

  const { isDirty, isSubmitting } = formState;

  const handleFieldTypeChange = (option: ISelectOptions) => {
    console.log("fieldType: ", option.value); //remove
    if (option !== null) {
      setFieldType(option.value);
    }
  };

  const handleIsRequiredChange = (option: ISelectOptions) => {
    if (option !== null) {
      if (option.value === "Yes") {
        setIsRequired(true);
      } else {
        setIsRequired(false);
      }
    }
  };

  //   const onSubmit = (field: IFormField) => {
  //     onAddField(field);
  //   };

  return (
    <Form onSubmit={handleSubmit(onAddField)} error>
      <Form.Group widths="equal">
        <Form.Field className={errors.type !== undefined ? "error field" : "field"}>
          <label>Type</label>
          <Controller
            name="type"
            defaultValue={null}
            control={control}
            render={({ onChange, value }) => (
              <Select
                options={fieldTypeOptions}
                onChange={(value) => {
                  onChange(value);
                  handleFieldTypeChange(value);
                }}
                value={value}
                isClearable={false}
              />
            )}
          />
          {errors.type && (
            <div className="ui pointing above prompt label" id="form-select-type-error-message" role="alert" aria-atomic="true">
              {errors.type.message}
            </div>
          )}
        </Form.Field>
        <Form.Field className={errors.name !== undefined ? "error field" : "field"}>
          <label>Name</label>
          <input type="text" name="name" placeholder="Field Name" aria-invalid={errors.name !== undefined} ref={register} />
          {errors.name && (
            <div className="ui pointing above prompt label" id="form-input-name-error-message" role="alert" aria-atomic="true">
              {errors.name.message}
            </div>
          )}
        </Form.Field>
        <Form.Field className={errors.placeholder !== undefined ? "error field" : "field"}>
          <label>Placeholder Text</label>
          <input type="text" name="placeholder" placeholder="Placeholder text..." aria-invalid={errors.placeholder !== undefined} ref={register} />
          {errors.placeholder && (
            <div className="ui pointing above prompt label" id="form-input-placeholder-error-message" role="alert" aria-atomic="true">
              {errors.placeholder.message}
            </div>
          )}
        </Form.Field>
        <Form.Field className={errors.isRequired !== undefined ? "error field" : "field"}>
          <label>Is Required</label>
          <Controller
            name="isRequired"
            defaultValue={null}
            control={control}
            render={({ onChange, value }) => (
              <Select
                options={isRequiredOptions}
                onChange={(value) => {
                  onChange(value);
                  handleIsRequiredChange(value);
                }}
                value={value}
                isClearable={false}
              />
            )}
          />
          {errors.isRequired && (
            <div className="ui pointing above prompt label" id="form-select-isRequired-error-message" role="alert" aria-atomic="true">
              {errors.isRequired.message}
            </div>
          )}
        </Form.Field>
        <Form.Field className={errors.options !== undefined ? "error field" : "field"} disabled={showOptions}>
          <label>Options</label>
          <input type="text" name="options" placeholder="Dropdown/Checkbox options list. Enter a comma separated list" aria-invalid={errors.options !== undefined} ref={register} />
          {errors.options && (
            <div className="ui pointing above prompt label" id="form-input-options-error-message" role="alert" aria-atomic="true">
              {errors.options.message}
            </div>
          )}
        </Form.Field>
        <Form.Field width={1}>
          <label>&nbsp;</label>
          <Button icon>
            <Icon color="red" name="trash" />
          </Button>
        </Form.Field>
      </Form.Group>
      <Button color="blue" content="Add Field" disabled={!isDirty} loading={isSubmitting} />
    </Form>
  );
};

export default AddFieldForm;
