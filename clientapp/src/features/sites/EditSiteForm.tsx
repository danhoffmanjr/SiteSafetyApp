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
import { ISite } from "../../app/models/site";

interface IProps {
  site: ISite;
  companyOptions: ISelectOptions[];
}

const EditSiteForm: React.FC<IProps> = ({ site, companyOptions }) => {
  const rootStore = useContext(RootStoreContext);
  const { updateSite, isSubmitting } = rootStore.siteStore;

  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();
  const [companyIdValue, setCompanyIdValue] = useState<number>(site.companyId);

  const validationSchema = yup.object().shape({
    companyId: yup.string().required("Company Id is a required field"),
    name: yup.string().required("Site Name is a required field"),
    address: yup.string().required("Address is a required field"),
  });

  const { handleSubmit, register, errors, formState, control, setValue } = useForm<Partial<ISiteFormValues>>({
    defaultValues: {
      id: site.id,
      name: site.name,
      address: site.address,
      companyId: site.companyId,
      notes: site.notes,
    },
    resolver: yupResolver(validationSchema),
  });

  const { isDirty } = formState;

  const onSubmit = (values: Partial<ISiteFormValues>) => {
    values = {
      ...values,
      companyId: companyIdValue!,
    };
    updateSite(values)
      .then(() => setSubmitErrors(undefined))
      .catch((error) => {
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
      <Form onSubmit={handleSubmit(onSubmit)} error>
        <Form.Group widths="equal">
          <Form.Field className={errors.companyId !== undefined ? "error field" : "field"}>
            <label>Company</label>
            <Controller
              name="companyId"
              control={control}
              defaultValue={companyOptions[1]}
              render={({ onChange, value }) => (
                <Select
                  options={companyOptions}
                  onChange={(value) => {
                    onChange(value);
                    handleCompanyChange(value);
                  }}
                  value={value}
                  defaultInputValue={site.companyName}
                  defaultValue={companyOptions[1]}
                  isClearable={true}
                  isDisabled={true}
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
        <input type="hidden" name="id" value={site.id} aria-invalid={errors.name !== undefined} ref={register} />
        <Button color="green" content="Update" disabled={!isDirty} loading={isSubmitting} />
        {submitErrors && <ErrorMessage error={submitErrors!} />}
      </Form>
    </Segment>
  );
};

export default observer(EditSiteForm);
