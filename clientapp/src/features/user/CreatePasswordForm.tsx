import React, { useContext, useState } from "react";
import queryString from "query-string";
import { Button, Card, Form, Header, Icon, Segment } from "semantic-ui-react";
import { RouteComponentProps } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { AxiosResponse } from "axios";
import { IPasswordReset } from "../../app/models/passwordReset";
import { RootStoreContext } from "../../app/stores/rootStore";
import ErrorMessage from "../../app/common/form/ErrorMessage";

const CreatePasswordForm: React.FC<RouteComponentProps> = ({ location }) => {
  const rootStore = useContext(RootStoreContext);
  const { createPassword, isSubmitting } = rootStore.userStore;
  const { token, email } = queryString.parse(location.search);

  const validationSchema = yup.object().shape({
    password: yup.string().required("Password is a required field").min(8, "Password must be at least 8 characters"),
    confirmPassword: yup
      .string()
      .required("Confirm Password is a required field")
      .oneOf([yup.ref("password")], "Passwords do not match"),
  });

  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();

  const { handleSubmit, register, errors, formState } = useForm<IPasswordReset>({
    defaultValues: {
      email: email as string,
      token: token as string,
      password: "",
      confirmPassword: "",
    },
    resolver: yupResolver(validationSchema),
  });

  const { isDirty } = formState;

  const onSubmit = (values: IPasswordReset) => {
    createPassword(values).catch((error) => {
      console.log("Create Password Error:", error.statusText);
      setSubmitErrors(error);
    });
  };
  return (
    <Segment placeholder>
      <Header icon>
        <Icon name="user secret" />
        Create Account Password
      </Header>
      <Segment.Inline>
        <Card>
          <Card.Content>
            <Form onSubmit={handleSubmit(onSubmit)} error>
              <input type="hidden" name="email" aria-invalid={errors.email !== undefined} ref={register} />
              <input type="hidden" name="token" aria-invalid={errors.token !== undefined} ref={register} />

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
              <Button primary content="Set Password" disabled={!isDirty} loading={isSubmitting} />
              {submitErrors && <ErrorMessage error={submitErrors!} />}
            </Form>
          </Card.Content>
        </Card>
      </Segment.Inline>
    </Segment>
  );
};

export default CreatePasswordForm;
