import React, { useContext } from "react";
import { Control, Controller, DeepMap, FieldError } from "react-hook-form";
import { Checkbox, Form, Grid, TextArea, Message, Icon } from "semantic-ui-react";
import Select from "react-select";
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
                <input type="text" name={`reportFields.${field.name}`} placeholder={field.placeholder} ref={register({ required: field.required })} defaultValue={field.value.toString()} />
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
                  defaultValue={""}
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
                      defaultInputValue={reportTypeFields[
                        reportTypeFields
                          .map((field) => {
                            return field.name;
                          })
                          .indexOf(`${field.name}`)
                      ].value.toString()}
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
                  defaultValue={
                    reportTypeFields[
                      reportTypeFields
                        .map((field) => {
                          return field.name;
                        })
                        .indexOf(`${field.name}`)
                    ].value
                  }
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
                  defaultValue={field.value.toString().trim() !== "" ? true : false}
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

        return false;
      })}
    </Grid>
  );
};

export default observer(ReportFieldsRenderer);
