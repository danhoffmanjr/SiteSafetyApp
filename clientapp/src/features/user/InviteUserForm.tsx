import React, { useContext, useState } from "react";
import { Form, Button, Segment, Header } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import * as yup from "yup";
import { AxiosResponse } from "axios";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { IUserInviteFormValues } from "../../app/models/userInviteFormValues";
import { observer } from "mobx-react-lite";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";
import { ISelectOptions } from "../../app/models/reactSelectOptions";

interface IProps {
  roleOptions: ISelectOptions[];
  companyOptions: ISelectOptions[];
}

const InviteUserForm: React.FC<IProps> = ({ roleOptions, companyOptions }) => {
  const rootStore = useContext(RootStoreContext);
  const { inviteUser, isSubmitting } = rootStore.userStore;
  const { getSiteOptionsByCompanyId } = rootStore.companyStore;

  const validationSchema = yup.object().shape({
    firstName: yup.string().required("First Name is a required field").min(2, "First Name must be at least 2 characters"),
    lastName: yup.string().required("Last Name is a required field").min(2, "Last Name must be at least 2 characters"),
    email: yup.string().required("Email is a required field").email("Not a valid email format"),
    roleName: yup.string().required("Role is a required field"),
    companyId: yup.string().required("Company is a required field"),
  });

  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();

  const [siteOptions, setSiteOptions] = useState<ISelectOptions[]>([]);

  const [companyIdValue, setCompanyIdValue] = useState<number | null>();
  const [siteIdValue, setSiteIdValue] = useState<number>();
  const [roleValue, setRoleValue] = useState<string>();

  const { handleSubmit, register, errors, formState, control, setValue } = useForm<IUserInviteFormValues>({
    resolver: yupResolver(validationSchema),
  });

  const { isDirty } = formState;

  const onSubmit = (formValues: IUserInviteFormValues) => {
    formValues = {
      ...formValues,
      companyId: companyIdValue,
      siteId: siteIdValue,
      roleName: roleValue,
    };
    inviteUser(formValues)
      .then(() => {
        setSubmitErrors(undefined);
      })
      .catch((error) => {
        console.log("Sned Invite Error:", error.statusText); //remove
        setSubmitErrors(error);
      });
  };

  const handleCompanyChange = (value: ISelectOptions) => {
    if (value !== null) {
      let id = parseInt(value.value);
      let options = getSiteOptionsByCompanyId(id);
      setSiteOptions(options);
      setValue("siteId", null);
      setCompanyIdValue(id);
    } else {
      setSiteOptions([]);
    }
  };

  const handleRoleChange = (value: ISelectOptions) => {
    if (value !== null) {
      setRoleValue(value.value);
    } else {
      setRoleValue("");
    }
  };

  const handleSiteChange = (value: ISelectOptions) => {
    if (value !== null) {
      setSiteIdValue(parseInt(value.value));
    } else {
      setValue("siteId", null);
    }
  };

  return (
    <Segment>
      <Header as="h3">Invite New User</Header>
      <Form onSubmit={handleSubmit(onSubmit)} error>
        <Form.Group widths="equal">
          <Form.Field className={errors.email !== undefined ? "error field" : "field"}>
            <label>Email</label>
            <input type="text" name="email" placeholder="Email" aria-invalid={errors.email !== undefined} ref={register} />
            {errors.email && (
              <div className="ui pointing above prompt label" id="form-input-email-error-message" role="alert" aria-atomic="true">
                {errors.email.message}
              </div>
            )}
          </Form.Field>
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
          <Form.Field className={errors.companyId !== undefined ? "error field" : "field"}>
            <label>Company</label>
            <Controller
              name="companyId"
              control={control}
              render={({ onChange, value }) => (
                <Select
                  options={companyOptions}
                  onChange={(value) => {
                    onChange(value);
                    handleCompanyChange(value);
                  }}
                  value={value}
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
          <Form.Field className={errors.siteId !== undefined ? "error field" : "field"}>
            <label>Site</label>
            <Controller
              name="siteId"
              control={control}
              render={({ onChange, value }) => (
                <Select
                  options={siteOptions}
                  onChange={(value) => {
                    onChange(value);
                    handleSiteChange(value);
                  }}
                  value={value}
                  isClearable={true}
                />
              )}
            />
            {errors.siteId && (
              <div className="ui pointing above prompt label" id="form-select-site-error-message" role="alert" aria-atomic="true">
                {errors.siteId.message}
              </div>
            )}
          </Form.Field>
          <Form.Field className={errors.roleName !== undefined ? "error field" : "field"}>
            <label>Role</label>
            <Controller
              name="roleName"
              control={control}
              render={({ onChange, value }) => (
                <Select
                  options={roleOptions}
                  onChange={(value) => {
                    onChange(value);
                    handleRoleChange(value);
                  }}
                  value={value}
                  isClearable={true}
                />
              )}
            />
            {errors.roleName && (
              <div className="ui pointing above prompt label" id="form-select-role-error-message" role="alert" aria-atomic="true">
                {errors.roleName.message}
              </div>
            )}
          </Form.Field>
        </Form.Group>

        <Button color="green" content="Invite" disabled={!isDirty} loading={isSubmitting} />
        {submitErrors && <ErrorMessage error={submitErrors!} />}
      </Form>
    </Segment>
  );
};

export default observer(InviteUserForm);
