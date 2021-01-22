import { AxiosResponse } from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, Form } from "semantic-ui-react";
import { IUserFormValues } from "../../app/models/userFormValues";
import { RootStoreContext } from "../../app/stores/rootStore";
import * as yup from "yup";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { Link } from "react-router-dom";

const LoginForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { login, isSubmitting } = rootStore.userStore;

  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();

  const validationSchema = yup.object().shape({
    email: yup.string().required("Email is a required field").email("Not a valid email format"),
    password: yup.string().required("Password is a required field").min(8),
  });

  const { handleSubmit, register, errors, formState } = useForm<IUserFormValues>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (values: IUserFormValues) => {
    login(values).catch((error) => {
      console.log("Login Error", error.statusText); // remove
      setSubmitErrors(error);
    });
  };

  const { isDirty } = formState;

  const centerText = {
    textAlign: "center",
  };

  return (
    <Card.Group centered>
      <Card>
        <Card.Content>
          <Card.Header style={centerText}>Login</Card.Header>
        </Card.Content>
        <Card.Content>
          <Form onSubmit={handleSubmit(onSubmit)} error>
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
              <input type="password" name="password" placeholder="Password" aria-invalid={errors.password !== undefined} ref={register} />
              {errors.password && (
                <div className="ui pointing above prompt label" id="form-input-password-error-message" role="alert" aria-atomic="true">
                  {errors.password.message}
                </div>
              )}
            </Form.Field>
            <Button fluid content="Login" primary disabled={!isDirty} loading={isSubmitting} />
            {submitErrors && <ErrorMessage error={submitErrors!} />}
          </Form>
        </Card.Content>
        <Card.Content extra style={centerText}>
          <Link to="/users/forgotPassword">Forgot Password?</Link>
        </Card.Content>
        {/* <Card.Content extra style={centerText}>
          Need an account? <Link to="/register">Sign Up</Link>
        </Card.Content> */}
      </Card>
    </Card.Group>
  );
};

export default LoginForm;
