import { AxiosResponse } from "axios";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Divider, Form, Header, Loader, Segment } from "semantic-ui-react";
import Select from "react-select";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { IReportFormValues } from "../../app/models/reportFormValues";
import { RootStoreContext } from "../../app/stores/rootStore";
import { ISelectOptions } from "../../app/models/reactSelectOptions";
import { toJS } from "mobx";
import ReportFieldsRenderer from "./ReportFieldsRenderer";
import { IReportField } from "../../app/models/reportField";
import { IReportPostValues } from "../../app/models/reportPostValues";
import { IImage } from "../../app/models/image";

interface IProps {
  report: IReportFormValues;
}

const CreateReportForm = ({ report }: IProps) => {
  const rootStore = useContext(RootStoreContext);
  const { isSubmitting, createReport } = rootStore.reportStore;
  const { loadCompanies, companySelectOptions, loadingCompanies, getCompany } = rootStore.companyStore;
  const { siteSelectOptions, loadSites, loadingSites, getSite } = rootStore.siteStore;
  const { reportTypeSelectOptions, loadReportTypes, loadingReportTypes, getReportType } = rootStore.reportTypeStore;

  useEffect(() => {
    register({ name: "companyName" });
    register({ name: "siteName" });
  }, []);

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

  const [reportFields, setReportFields] = useState<IReportField[]>(report.reportFields);

  const { handleSubmit, register, errors, formState, control, setValue } = useForm<IReportFormValues>({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: report,
  });

  const { isDirty } = formState;

  const handleReportTypeChange = (option: ISelectOptions) => {
    let reportType = getReportType(parseInt(option.value.toString()));
    let fields: IReportField[] | undefined = toJS(reportType?.fields)?.map((field) =>
      Object.assign(field, {
        value: "",
      })
    );
    setReportFields(fields!);
  };

  const onSubmit = (data: any) => {
    let updateValues = reportFields.map((field) => {
      field.value = data.reportFields[field.name];
      return field;
    });
    let company = getCompany(parseInt(data.companyId));
    let site = getSite(parseInt(data.siteId));
    let reportType = getReportType(parseInt(data.reportTypeId));
    let images: IImage[] = data.reportFields.images ?? [];
    let values: IReportPostValues = {
      ...data,
      companyName: company?.name,
      siteName: site?.name,
      siteId: parseInt(data.siteId),
      reportTypeId: parseInt(data.reportTypeId),
      reportType: reportType?.title,
      reportFields: JSON.stringify(updateValues),
    };

    createReport(values, images.length > 0 ? images : undefined).catch((error) => {
      setSubmitErrors(error);
    });
  };

  return (
    <Segment>
      {(loadingCompanies || loadingSites || loadingReportTypes) && <Loader content="Loading options..." active />}
      <Header as="h3" content={report.id === "" ? "Create Report" : `${report.title}`} />
      <Form onSubmit={handleSubmit(onSubmit)} error>
        <Form.Group widths="equal">
          <Form.Field className={errors.companyId !== undefined ? "error field" : "field"}>
            <label>Company</label>
            <Controller
              control={control}
              name="companyId"
              rules={{ required: "Company is Required*" }}
              defaultValue={{ value: `${report.companyId}`, label: `${report.companyName}` }}
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
                  defaultInputValue={report.companyName}
                  isDisabled={report.companyName.length > 0}
                />
              )}
            />
            {errors.companyId && (
              <div className="ui pointing above prompt label" id="form-select-companyId-error-message" role="alert" aria-atomic="true">
                {errors.companyId.message}
              </div>
            )}
          </Form.Field>
          <Form.Field className={errors.siteId !== undefined ? "error field" : "field"}>
            <label>Site</label>
            <Controller
              name="siteId"
              defaultValue={{ value: `${report.siteId}`, label: `${report.siteName}` }}
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
                  defaultInputValue={report.siteName}
                  isDisabled={report.siteName.length > 0}
                />
              )}
            />
            {errors.siteId && (
              <div className="ui pointing above prompt label" id="form-select-siteId-error-message" role="alert" aria-atomic="true">
                {errors.siteId.message}
              </div>
            )}
          </Form.Field>
          <Form.Field className={errors.reportTypeId !== undefined ? "error field" : "field"}>
            <label>Report Type</label>
            <Controller
              control={control}
              name="reportTypeId"
              rules={{ required: "Report Type is Required*" }}
              defaultValue={{ value: `${report.reportTypeId}`, label: `${report.reportType}` }}
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
                  defaultInputValue={report.reportType}
                />
              )}
            />
            {errors.reportTypeId && (
              <div className="ui pointing above prompt label" id="form-select-reportTypeId-error-message" role="alert" aria-atomic="true">
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
        <ReportFieldsRenderer reportTypeFields={reportFields} control={control} register={register} errors={errors} setValue={setValue} />
        <Divider horizontal />
        <Button color="green" content={report.id === "" ? "Create" : "Update"} disabled={!isDirty} loading={isSubmitting} style={{ marginTop: 15 }} />
        {submitErrors && <ErrorMessage error={submitErrors!} />}
      </Form>
    </Segment>
  );
};

export default observer(CreateReportForm);
