import React, { useContext, useState } from "react";
import { Form, Button, Card } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import * as yup from "yup";
import { AxiosResponse } from "axios";
import { useForm } from "react-hook-form";
import { IUserFormValues } from "../../app/models/userFormValues";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";

const RegisterForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { registerUser, isSubmitting } = rootStore.userStore;

  const validationSchema = yup.object().shape({
    firstName: yup.string().required("First Name is a required field").min(2, "First Name must be at least 2 characters"),
    lastName: yup.string().required("Last Name is a required field").min(2, "Last Name must be at least 2 characters"),
    email: yup.string().required("Email is a required field").email("Not a valid email format"),
    password: yup.string().required("Password is a required field").min(8, "Password must be at least 8 characters"),
    confirmPassword: yup
      .string()
      .required("Confirm Password is a required field")
      .oneOf([yup.ref("password")], "Password and Confirmation Password do not match"),
  });

  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();

  const { handleSubmit, register, errors, formState } = useForm<IUserFormValues>({
    resolver: yupResolver(validationSchema),
  });

  const { isDirty } = formState;

  const onSubmit = (values: IUserFormValues) => {
    registerUser(values).catch((error) => {
      console.log("Register Error:", error.statusText);
      setSubmitErrors(error);
    });
  };

  const centerText = {
    textAlign: "center",
  };

  return (
    <Card.Group centered>
      <Card>
        <Card.Content>
          <Card.Header style={centerText}>Sign Up</Card.Header>
        </Card.Content>
        <Card.Content>
          <Form onSubmit={handleSubmit(onSubmit)} error>
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
            <Form.Field className={errors.email !== undefined ? "error field" : "field"}>
              <label>Email</label>
              <input type="text" name="email" placeholder="Email" aria-invalid={errors.email !== undefined} ref={register} />
              {errors.email && (
                <div className="ui pointing above prompt label" id="form-input-email-error-message" role="alert" aria-atomic="true">
                  {errors.email.message}
                </div>
              )}
            </Form.Field>
            <Form.Field className={errors.password !== undefined ? "error field" : "field"}>
              <label>Password</label>
              <input type="password" name="password" placeholder="Password" ref={register} />
              {errors.password && (
                <div className="ui pointing above prompt label" id="form-input-password-error-message" role="alert" aria-atomic="true">
                  {errors.password.message}
                </div>
              )}
            </Form.Field>
            <Form.Field className={errors.confirmPassword !== undefined ? "error field" : "field"}>
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" placeholder="Confirm Password" aria-invalid={errors.confirmPassword !== undefined} ref={register} />
              {errors.confirmPassword && (
                <div className="ui pointing above prompt label" id="form-input-confirm-password-error-message" role="alert" aria-atomic="true">
                  {errors.confirmPassword.message}
                </div>
              )}
            </Form.Field>
            <Button fluid color="teal" content="Register" disabled={!isDirty} loading={isSubmitting} />
            {submitErrors && <ErrorMessage error={submitErrors!} />}
          </Form>
        </Card.Content>
        <Card.Content extra style={centerText}>
          Already have an account? <Link to="/login">Login</Link>
        </Card.Content>
      </Card>
    </Card.Group>
  );
};

export default RegisterForm;
