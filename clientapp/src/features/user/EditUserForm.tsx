import { AxiosResponse } from "axios";
import React, { useContext, useState } from "react";
import { IProfile } from "../../app/models/profile";
import { RootStoreContext } from "../../app/stores/rootStore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { IEditUserFormValues } from "../../app/models/editUserFormValues";
import Select, { ValueType } from "react-select";
import { Button, Form, Icon, Popup, Segment } from "semantic-ui-react";
import { ISelectOptions } from "../../app/models/reactSelectOptions";
import ErrorMessage from "../../app/common/form/ErrorMessage";

interface IProps {
  profile: IProfile;
  companyOptions: ISelectOptions[];
  roleOptions: ISelectOptions[];
}

const EditUserForm: React.FC<IProps> = ({ profile, companyOptions, roleOptions }) => {
  const rootStore = useContext(RootStoreContext);
  const { updateUser, isSubmitting } = rootStore.userStore;

  const statusOptions: ISelectOptions[] = [
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();

  const validationSchema = yup.object().shape({
    id: yup.string().required("User Id is a required field"),
    companyId: yup.string().required("Company is a required field").nullable(),
    firstName: yup.string().required("First Name is a required field"),
    lastName: yup.string().required("Last Name is a required field"),
    email: yup.string().required("Email is a required field").email("Not a valid email format"),
    role: yup.string().required("Role is a required field").nullable(),
    isActive: yup.string().required("Status a required field").nullable(),
  });

  const { handleSubmit, register, errors, formState, control, setValue } = useForm<Partial<IEditUserFormValues>>({
    defaultValues: {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      companyName: profile.companyName,
      companyId: profile.companyId,
      role: profile.role,
      isActive: profile.isActive,
      contactPhoneNumber: profile.contactPhoneNumber,
    },
    resolver: yupResolver(validationSchema),
  });

  const { isDirty } = formState;

  const [selectedCompanyOption, setSelectedCompanyOption] = useState<ValueType<ISelectOptions>>(
    companyOptions.filter((option) => {
      return option.value === profile.companyId.toString();
    })
  );

  const [selectedRoleOption, setSelectedRoleOption] = useState<ValueType<ISelectOptions>>(
    roleOptions.filter((option) => {
      return option.value === profile.role;
    })
  );

  const [selectedStatusOption, setSelectedStatusOption] = useState<ValueType<ISelectOptions>>(
    statusOptions.filter((option) => {
      return option.value === profile.isActive.toString();
    })
  );

  const [companyId, setCompanyId] = useState<number>(profile.companyId);
  const [role, setRole] = useState<string>(profile.role);
  const [status, setStatus] = useState<boolean>(profile.isActive);

  function getOptionValue(propertyName: keyof ISelectOptions, option: ISelectOptions) {
    return option[propertyName];
  }

  const handleCompanyChange = (option: ValueType<ISelectOptions>) => {
    setSelectedCompanyOption(option);
    if (option !== null) {
      let id: number = parseInt(getOptionValue("value", option as ISelectOptions).toString());
      setCompanyId(id);
    }
  };

  const handleRoleChange = (option: ValueType<ISelectOptions>) => {
    setSelectedRoleOption(option);
    if (option !== null) {
      setRole(getOptionValue("value", option as ISelectOptions).toString());
    }
  };

  const handleStatusChange = (option: ValueType<ISelectOptions>) => {
    setSelectedStatusOption(option);
    if (option !== null) {
      let optionValue = (getOptionValue("value", option as ISelectOptions) as unknown) as boolean;
      setStatus(optionValue);
    }
  };

  const onSubmit = (values: Partial<IEditUserFormValues>) => {
    values = {
      ...values,
      companyId: companyId,
      role: role,
      isActive: status,
    };
    console.log("Submitted Form Values:", values); // remove after testing
    updateUser(values)
      .then(() => setSubmitErrors(undefined))
      .catch((error) => {
        setSubmitErrors(error);
      });
  };

  return (
    <Segment>
      <Form onSubmit={handleSubmit(onSubmit)} error>
        <input type="hidden" name="id" value={profile.id} aria-invalid={errors.id !== undefined} ref={register} />
        <Form.Group widths="equal">
          <Form.Field className={errors.firstName !== undefined ? "error field" : "field"}>
            <label>First Name</label>
            <input type="text" name="firstName" placeholder="First Name" aria-invalid={errors.firstName !== undefined} ref={register} />
            {errors.firstName && (
              <div className="ui pointing above prompt label" id="form-input-first-name-error-message" role="alert" aria-atomic="true">
                {errors.firstName.message}
              </div>
            )}
          </Form.Field>
          <Form.Field className={errors.lastName !== undefined ? "error field" : "field"}>
            <label>Last Name</label>
            <input type="text" name="lastName" placeholder="Last Name" aria-invalid={errors.lastName !== undefined} ref={register} />
            {errors.lastName && (
              <div className="ui pointing above prompt label" id="form-input-last-name-error-message" role="alert" aria-atomic="true">
                {errors.lastName.message}
              </div>
            )}
          </Form.Field>
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field className={errors.email !== undefined ? "error field" : "field"}>
            <label>
              Email{" "}
              <Popup content={`Changing your email address requires an email verification link to be emailed to the new address.`} trigger={<Icon color="teal" name="question circle outline" />} />
            </label>
            <input type="text" name="email" placeholder="Email" aria-invalid={errors.email !== undefined} ref={register} />
            {errors.email && (
              <div className="ui pointing above prompt label" id="form-input-email-error-message" role="alert" aria-atomic="true">
                {errors.email.message}
              </div>
            )}
          </Form.Field>
          <Form.Field className={errors.contactPhoneNumber !== undefined ? "error field" : "field"}>
            <label>Phone</label>
            <input type="text" name="contactPhoneNumber" placeholder="Contact Phone Number" aria-invalid={errors.contactPhoneNumber !== undefined} ref={register} />
            {errors.contactPhoneNumber && (
              <div className="ui pointing above prompt label" id="form-input-phone-error-message" role="alert" aria-atomic="true">
                {errors.contactPhoneNumber.message}
              </div>
            )}
          </Form.Field>
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Field className={errors.companyId !== undefined ? "error field" : "field"}>
            <label>Company</label>
            <Controller
              name="companyId"
              control={control}
              render={({ onChange }) => (
                <Select
                  options={companyOptions}
                  defaultValue={selectedCompanyOption}
                  onChange={(value) => {
                    onChange(value);
                    handleCompanyChange(value);
                  }}
                  value={selectedCompanyOption}
                  isClearable={true}
                />
              )}
            />
            {errors.companyId && (
              <div className="ui pointing above prompt label" id="form-select-company-error-message" role="alert" aria-atomic="true">
                {errors.companyId.message}
              </div>
            )}
          </Form.Field>
          <Form.Field className={errors.role !== undefined ? "error field" : "field"}>
            <label>Role</label>
            <Controller
              name="role"
              control={control}
              render={({ onChange }) => (
                <Select
                  options={roleOptions}
                  defaultValue={selectedRoleOption}
                  onChange={(value) => {
                    onChange(value);
                    handleRoleChange(value);
                  }}
                  value={selectedRoleOption}
                  isClearable={true}
                />
              )}
            />
            {errors.role && (
              <div className="ui pointing above prompt label" id="form-select-role-error-message" role="alert" aria-atomic="true">
                {errors.role.message}
              </div>
            )}
          </Form.Field>
          <Form.Field className={errors.isActive !== undefined ? "error field" : "field"}>
            <label>Status</label>
            <Controller
              name="isActive"
              control={control}
              render={({ onChange }) => (
                <Select
                  options={statusOptions}
                  defaultValue={selectedStatusOption}
                  onChange={(value) => {
                    onChange(value);
                    handleStatusChange(value);
                  }}
                  value={selectedStatusOption}
                  isClearable={true}
                />
              )}
            />
            {errors.isActive && (
              <div className="ui pointing above prompt label" id="form-select-isActive-error-message" role="alert" aria-atomic="true">
                {errors.isActive.message}
              </div>
            )}
          </Form.Field>
        </Form.Group>
        <Button color="green" content="Update" disabled={!isDirty} loading={isSubmitting} />
        {submitErrors && <ErrorMessage error={submitErrors!} />}
      </Form>
    </Segment>
  );
};

export default EditUserForm;
