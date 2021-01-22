import { AxiosResponse } from "axios";
import React, { useContext, useState } from "react";
import { IProfile } from "../../app/models/profile";
import { RootStoreContext } from "../../app/stores/rootStore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { Button, Form, Icon, Popup, Segment } from "semantic-ui-react";
import { ISelectOptions } from "../../app/models/reactSelectOptions";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { IProfileFormValues } from "../../app/models/profileFormValues";

interface IProps {
  profile: IProfile;
}

const EditProfileForm: React.FC<IProps> = ({ profile }) => {
  const rootStore = useContext(RootStoreContext);
  const { updateProfile, isSubmitting } = rootStore.userStore;

  const statusOptions: ISelectOptions[] = [
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();

  const validationSchema = yup.object().shape({
    id: yup.string().required("User Id is a required field"),
    firstName: yup.string().required("First Name is a required field"),
    lastName: yup.string().required("Last Name is a required field"),
    email: yup.string().required("Email is a required field").email("Not a valid email format"),
  });

  const { handleSubmit, register, errors, formState, control, setValue } = useForm<Partial<IProfileFormValues>>({
    defaultValues: {
      id: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      contactPhoneNumber: profile.contactPhoneNumber,
    },
    resolver: yupResolver(validationSchema),
  });

  const { isDirty } = formState;

  const onSubmit = (values: Partial<IProfileFormValues>) => {
    console.log("Submitted Form Values:", values); // remove after testing
    updateProfile(values)
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
              <Popup
                content={`Changing your email address requires a verification link be sent to the new email address before you can login again.`}
                trigger={<Icon color="teal" name="question circle outline" />}
              />
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
        <Button color="green" content="Update" disabled={!isDirty} loading={isSubmitting} />
        {submitErrors && <ErrorMessage error={submitErrors!} />}
      </Form>
    </Segment>
  );
};

export default EditProfileForm;
