import { observer } from "mobx-react-lite";
import React, { useContext, useState } from "react";
import { Button, Form } from "semantic-ui-react";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { IProfile } from "../../app/models/profile";
import * as yup from "yup";
import { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { RootStoreContext } from "../../app/stores/rootStore";

const ProfileForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { updateProfile, profile, isSubmitting, isAdmin } = rootStore.userStore;

  const phoneRegExp = /((\(\d{3}\) ?)|(\d{3}-))?\d{3}-\d{4}/;

  const validationSchema = yup.object().shape({
    firstName: yup.string().required("First Name is a required field").min(2, "First Name must be at least 2 characters"),
    lastName: yup.string().required("Last Name is a required field").min(2, "Last Name must be at least 2 characters"),
    email: yup.string().required("Email is a required field").email("Not a valid email format"),
    phone: yup.string(),
    role: yup.string(),
  });

  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();

  const { handleSubmit, register, errors, formState } = useForm<IProfile>({
    defaultValues: {
      id: profile!.id,
      firstName: profile!.firstName,
      lastName: profile!.lastName,
      fullName: profile!.fullName,
      email: profile!.email,
      companyName: profile!.companyName,
      companyId: profile!.companyId,
      contactPhoneNumber: profile!.contactPhoneNumber,
      role: profile!.role,
      isActive: profile!.isActive,
      sites: profile!.sites,
    },
    resolver: yupResolver(validationSchema),
  });

  const { isDirty } = formState;

  const onSubmit = (values: IProfile) => {
    updateProfile(values).catch((error) => {
      console.log("Edit Profile Error:", error.statusText); //remove
      setSubmitErrors(error);
    });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} error>
      <input type="hidden" name="id" ref={register} />
      <Form.Field className={errors.firstName !== undefined ? "error field" : "field"}>
        {errors.firstName && (
          <div className="ui pointing below prompt label" id="form-input-first-name-error-message" role="alert" aria-atomic="true">
            {errors.firstName.message}
          </div>
        )}
        <input type="text" name="firstName" placeholder="First Name" aria-invalid={errors.firstName !== undefined} ref={register} />
      </Form.Field>
      <Form.Field className={errors.lastName !== undefined ? "error field" : "field"}>
        {errors.lastName && (
          <div className="ui pointing below prompt label" id="form-input-last-name-error-message" role="alert" aria-atomic="true">
            {errors.lastName.message}
          </div>
        )}
        <input type="text" name="lastName" placeholder="Last Name" aria-invalid={errors.lastName !== undefined} ref={register} />
      </Form.Field>
      <Form.Field className={errors.email !== undefined ? "error field" : "field"}>
        {errors.email && (
          <div className="ui pointing below prompt label" id="form-input-email-error-message" role="alert" aria-atomic="true">
            {errors.email.message}
          </div>
        )}
        <input type="text" name="email" placeholder="Email" aria-invalid={errors.email !== undefined} ref={register} />
      </Form.Field>
      <Form.Field className={errors.contactPhoneNumber !== undefined ? "error field" : "field"}>
        {errors.contactPhoneNumber && (
          <div className="ui pointing below prompt label" id="form-input-phone-error-message" role="alert" aria-atomic="true">
            {errors.contactPhoneNumber.message}
          </div>
        )}
        <input type="text" name="phone" placeholder="Contact Phone Number" ref={register} />
      </Form.Field>
      <Form.Field className={errors.role !== undefined ? "error field" : "field"}>
        {errors.role && (
          <div className="ui pointing below prompt label" id="form-input-role-error-message" role="alert" aria-atomic="true">
            {errors.role.message}
          </div>
        )}
        {isAdmin ? <input type="text" name="role" placeholder="Contact Phone Number" ref={register} /> : <input disabled type="text" name="role" placeholder="Contact Phone Number" ref={register} />}
      </Form.Field>
      <Button primary content="Update" disabled={!isDirty} loading={isSubmitting} />
      {submitErrors && <ErrorMessage error={submitErrors!} />}
    </Form>
  );
};

export default observer(ProfileForm);
