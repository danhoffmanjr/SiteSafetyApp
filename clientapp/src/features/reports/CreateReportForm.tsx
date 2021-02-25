import { AxiosResponse } from "axios";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Form, Header, Loader, Segment } from "semantic-ui-react";
import Select from "react-select";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { IReportFormValues } from "../../app/models/reportFormValues";
import { RootStoreContext } from "../../app/stores/rootStore";
import { ISelectOptions } from "../../app/models/reactSelectOptions";
import { toJS } from "mobx";
import { IReportTypeField } from "../../app/models/reportTypeField";
import ReportFieldsRenderer from "./ReportFieldsRenderer";

const CreateReportForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { isSubmitting } = rootStore.reportStore;
  const { loadCompanies, companySelectOptions, loadingCompanies } = rootStore.companyStore;
  const { siteSelectOptions, loadSites, loadingSites } = rootStore.siteStore;
  const { reportTypeSelectOptions, loadReportTypes, loadingReportTypes, getReportType } = rootStore.reportTypeStore;

  useEffect(() => {
    if (companySelectOptions.length < 1) {
      loadCompanies();
    }
  }, [companySelectOptions, loadCompanies]);

  useEffect(() => {
    if (siteSelectOptions.length < 1) {
      loadSites();
    }
  }, [siteSelectOptions, loadSites]);

  useEffect(() => {
    if (reportTypeSelectOptions.length < 1) {
      loadReportTypes();
    }
  }, [reportTypeSelectOptions, loadReportTypes]);

  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();

  const { handleSubmit, register, watch, errors, formState, control, setValue } = useForm<IReportFormValues>({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: {
      id: "",
      title: "",
      companyId: "",
      companyName: "",
      siteId: "",
      siteName: "",
      reportTypeId: "",
      reportType: "",
      reportFields: [],
      images: [],
    },
  });

  const { isDirty } = formState;

  const [reportTypeFields, setReportTypeFields] = useState<IReportTypeField[]>([]);

  const handleReportTypeChange = (option: ISelectOptions) => {
    let reportType = getReportType(parseInt(option.value.toString()));
    console.log("Selected Type fields: ", toJS(reportType.fields));
    setReportTypeFields(toJS(reportType.fields));
  };

  const onSubmit = (data: IReportFormValues) => {
    console.log(data); // remove
  };

  return (
    <Segment>
      {(loadingCompanies || loadingSites || loadingReportTypes) && <Loader content="Loading options..." active />}
      <Header as="h3">Create Report</Header>
      <Form onSubmit={handleSubmit(onSubmit)} error>
        <Form.Group widths="equal">
          <Form.Field className={errors.companyId !== undefined ? "error field" : "field"}>
            <label>Company</label>
            <Controller
              control={control}
              name="companyId"
              rules={{ required: "Company is Required*" }}
              defaultValue={null}
              render={({ onChange, name, value }) => (
                <Select
                  options={companySelectOptions}
                  onChange={(value) => {
                    onChange(value);
                    setValue(name, parseInt(value.value));
                  }}
                  value={value?.value}
                  name={name}
                  isClearable={false}
                />
              )}
            />
            {errors.companyId && (
              <div className="ui pointing above prompt label" id="form-select-company-error-message" role="alert" aria-atomic="true">
                {errors.companyId.message}
              </div>
            )}
          </Form.Field>
          <Form.Field className={errors.siteId !== undefined ? "error field" : "field"}>
            <label>Site</label>
            <Controller
              name="siteId"
              defaultValue={null}
              control={control}
              rules={{ required: "Site is Required*" }}
              render={({ onChange, name, value }) => (
                <Select
                  options={siteSelectOptions}
                  onChange={(value) => {
                    onChange(value);
                    setValue(name, value.value);
                  }}
                  value={value?.value}
                  name={name}
                  isClearable={false}
                />
              )}
            />
            {errors.siteId && (
              <div className="ui pointing above prompt label" id="form-select-site-error-message" role="alert" aria-atomic="true">
                {errors.siteId.message}
              </div>
            )}
          </Form.Field>
          <Form.Field className={errors.siteId !== undefined ? "error field" : "field"}>
            <label>Report Type</label>
            <Controller
              control={control}
              name="reportTypeId"
              rules={{ required: "Report Type is Required*" }}
              defaultValue={null}
              render={({ onChange, name, value }) => (
                <Select
                  options={reportTypeSelectOptions}
                  onChange={(value) => {
                    onChange(value);
                    setValue(name, value.value);
                    handleReportTypeChange(value);
                  }}
                  value={value?.value}
                  name={name}
                  isClearable={false}
                />
              )}
            />
            {errors.reportTypeId && (
              <div className="ui pointing above prompt label" id="form-select-report-type-error-message" role="alert" aria-atomic="true">
                {errors.reportTypeId.message}
              </div>
            )}
          </Form.Field>
        </Form.Group>
        <Form.Field className={errors.title !== undefined ? "error field" : "field"}>
          <label>Report Title</label>
          <input
            type="text"
            name="title"
            placeholder="Report Title"
            aria-invalid={errors.title !== undefined}
            ref={register({
              required: "Report Title is Required*",
            })}
          />
          {errors.title && (
            <div className="ui pointing above prompt label" id="form-input-title-error-message" role="alert" aria-atomic="true">
              {errors.title.message}
            </div>
          )}
        </Form.Field>
        <ReportFieldsRenderer reportFields={reportTypeFields} />
        <Button color="green" content="Create" disabled={!isDirty} loading={isSubmitting} style={{ marginTop: 15 }} />
        {submitErrors && <ErrorMessage error={submitErrors!} />}
      </Form>
    </Segment>
  );
};

export default observer(CreateReportForm);
