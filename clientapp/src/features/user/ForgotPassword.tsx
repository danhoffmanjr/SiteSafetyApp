import { AxiosResponse } from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, Form } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import * as yup from "yup";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { Link } from "react-router-dom";
import { IEmail } from "../../app/models/email";

const ForgotPasswordForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { forgotPassword, isSubmitting } = rootStore.userStore;

  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();

  const validationSchema = yup.object().shape({
    email: yup.string().required("Email is a required field").email("Not a valid email format"),
  });

  const { handleSubmit, register, errors, formState } = useForm<IEmail>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = (value: IEmail) => {
    forgotPassword(value).catch((error) => {
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
          <Card.Header style={centerText}>Password Reset</Card.Header>
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
            <Button fluid content="Reset Password" primary disabled={!isDirty} loading={isSubmitting} />
            {submitErrors && <ErrorMessage error={submitErrors!} />}
          </Form>
        </Card.Content>
        <Card.Content extra style={centerText}>
          <Link to="/login">Login</Link>
        </Card.Content>
        <Card.Content extra style={centerText}>
          Need an account? <Link to="/register">Sign Up</Link>
        </Card.Content>
      </Card>
    </Card.Group>
  );
};

export default ForgotPasswordForm;
