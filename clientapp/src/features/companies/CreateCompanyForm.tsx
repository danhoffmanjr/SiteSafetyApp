import { AxiosResponse } from "axios";
import React, { useContext, useState } from "react";
import { Button, Form, Header, Segment } from "semantic-ui-react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { RootStoreContext } from "../../app/stores/rootStore";
import { ICompany } from "../../app/models/company";

const CreateCompanyForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { createCompany } = rootStore.companyStore;
  const { closeModal } = rootStore.modalStore;

  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();

  const validationSchema = yup.object().shape({
    name: yup.string().required("Company Name is a required field"),
  });

  const { handleSubmit, register, errors, formState } = useForm<Partial<ICompany>>({
    resolver: yupResolver(validationSchema),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (value: Partial<ICompany>) => {
    setIsSubmitting(true);
    createCompany(value.name!)
      .then(() => {
        closeModal();
      })
      .catch((error) => {
        console.log("Create Company Error:", error.statusText); // remove
        setSubmitErrors(error);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const { isDirty } = formState;

  return (
    <Segment>
      <Header as="h3">Create Company</Header>
      <Form onSubmit={handleSubmit(onSubmit)} error>
        <Form.Group widths="equal">
          <Form.Field className={errors.name !== undefined ? "error field" : "field"}>
            <label>Company Name</label>
            <input type="text" name="name" placeholder="Company Name" aria-invalid={errors.name !== undefined} ref={register} />
            {errors.name && (
              <div className="ui pointing above prompt label" id="form-input-name-error-message" role="alert" aria-atomic="true">
                {errors.name.message}
              </div>
            )}
          </Form.Field>
        </Form.Group>
        <Button color="green" content="Create" disabled={!isDirty} loading={isSubmitting} />
        {submitErrors && <ErrorMessage error={submitErrors!} />}
      </Form>
    </Segment>
  );
};

export default CreateCompanyForm;
