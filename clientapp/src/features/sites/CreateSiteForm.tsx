import { AxiosResponse } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { RootStoreContext } from "../../app/stores/rootStore";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { ISiteFormValues } from "../../app/models/siteFormValues";
import { Button, Form, Header, Loader, Segment } from "semantic-ui-react";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { ISelectOptions } from "../../app/models/reactSelectOptions";
import Select from "react-select";
import { observer } from "mobx-react-lite";

const CreateSiteForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { createSite, isSubmitting } = rootStore.siteStore;
  const { loadCompanies, companySelectOptions, loadingCompanies } = rootStore.companyStore;

  useEffect(() => {
    if (companySelectOptions.length < 1) {
      loadCompanies();
    }
  }, [companySelectOptions, loadCompanies]);

  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();
  const [companyIdValue, setCompanyIdValue] = useState<number>();

  const validationSchema = yup.object().shape({
    companyId: yup.string().required("Company Id is a required field"),
    name: yup.string().required("Site Name is a required field"),
    address: yup.string().required("Address is a required field"),
  });

  const { handleSubmit, register, errors, formState, control, setValue } = useForm<ISiteFormValues>({
    resolver: yupResolver(validationSchema),
  });

  const { isDirty } = formState;

  const onSubmit = (values: ISiteFormValues) => {
    values = {
      ...values,
      companyId: companyIdValue!,
    };
    createSite(values).catch((error) => {
      setSubmitErrors(error);
    });
  };

  const handleCompanyChange = (option: ISelectOptions) => {
    if (option !== null) {
      setCompanyIdValue(parseInt(option.value));
    }
  };

  return (
    <Segment>
      {loadingCompanies && <Loader content="Loading options..." active />}
      <Header as="h3">Create Site</Header>
      <Form onSubmit={handleSubmit(onSubmit)} error>
        <Form.Group widths="equal">
          <Form.Field className={errors.companyId !== undefined ? "error field" : "field"}>
            <label>Company</label>
            <Controller
              name="companyId"
              defaultValue={null}
              control={control}
              render={({ onChange, value }) => (
                <Select
                  options={companySelectOptions}
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

export default observer(CreateSiteForm);
