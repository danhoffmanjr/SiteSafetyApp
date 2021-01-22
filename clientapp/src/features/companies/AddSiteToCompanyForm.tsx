import { AxiosResponse } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { RootStoreContext } from "../../app/stores/rootStore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { ISiteFormValues } from "../../app/models/siteFormValues";
import { Button, Form, Header, Loader, Segment } from "semantic-ui-react";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { ISelectOptions } from "../../app/models/reactSelectOptions";
import { observer } from "mobx-react-lite";
import { ICompany } from "../../app/models/company";

interface IProps {
  company: ICompany;
}

const AddSiteToCompanyForm: React.FC<IProps> = ({ company }) => {
  const rootStore = useContext(RootStoreContext);
  const { createSiteForCompany, isSubmitting } = rootStore.companyStore;
  const { closeModal } = rootStore.modalStore;

  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();
  const [companyIdValue, setCompanyIdValue] = useState<number>(company.id);

  const validationSchema = yup.object().shape({
    companyId: yup.string().required("Company Id is a required field"),
    name: yup.string().required("Site Name is a required field"),
    address: yup.string().required("Address is a required field"),
  });

  const { handleSubmit, register, errors, formState } = useForm<ISiteFormValues>({
    resolver: yupResolver(validationSchema),
  });

  const { isDirty } = formState;

  const onSubmit = (values: ISiteFormValues) => {
    values = {
      ...values,
      companyId: companyIdValue!,
    };
    createSiteForCompany(values)
      .then(() => {
        closeModal();
      })
      .catch((error) => {
        setSubmitErrors(error);
      });
  };

  return (
    <Segment>
      <Header as="h3">Add Site</Header>
      <Form onSubmit={handleSubmit(onSubmit)} error>
        <Form.Group widths="equal">
          <Form.Field className={errors.companyId !== undefined ? "error field" : "field"}>
            <label>Company</label>
            <input type="text" name="companyId" value={company.name} aria-invalid={errors.companyId !== undefined} ref={register} />
            {errors.companyId && (
              <div className="ui pointing above prompt label" id="form-input-companyId-error-message" role="alert" aria-atomic="true">
                {errors.companyId.message}
              </div>
            )}
          </Form.Field>
          <Form.Field className={errors.name !== undefined ? "error field" : "field"}>
            <label>Site Name</label>
            <input type="text" name="name" placeholder="Site Name" aria-invalid={errors.name !== undefined} ref={register} />
            {errors.name && (
              <div className="ui pointing above prompt label" id="form-input-name-error-message" role="alert" aria-atomic="true">
                {errors.name.message}
              </div>
            )}
          </Form.Field>
          <Form.Field className={errors.address !== undefined ? "error field" : "field"}>
            <label>Full Address</label>
            <input type="text" name="address" placeholder="Full Address" aria-invalid={errors.address !== undefined} ref={register} />
            {errors.address && (
              <div className="ui pointing above prompt label" id="form-input-address-error-message" role="alert" aria-atomic="true">
                {errors.address.message}
              </div>
            )}
          </Form.Field>
        </Form.Group>
        <Form.Field className={errors.notes !== undefined ? "error field" : "field"}>
          <label>Notes</label>
          <textarea rows={3} name="notes" placeholder="Add notes here..." aria-invalid={errors.notes !== undefined} ref={register} />
          {errors.notes && (
            <div className="ui pointing above prompt label" id="form-input-notes-error-message" role="alert" aria-atomic="true">
              {errors.notes.message}
            </div>
          )}
        </Form.Field>
        <Button color="green" content="Create" disabled={!isDirty} loading={isSubmitting} />
        {submitErrors && <ErrorMessage error={submitErrors!} />}
      </Form>
    </Segment>
  );
};

export default observer(AddSiteToCompanyForm);
