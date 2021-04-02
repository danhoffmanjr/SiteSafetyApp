import { AxiosResponse } from "axios";
import React, { useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Segment, Form, Button } from "semantic-ui-react";
import Select from "react-select";

import ErrorMessage from "../../app/common/form/ErrorMessage";
import { ISelectOptions } from "../../app/models/reactSelectOptions";
import { IReport } from "../../app/models/report";
import { IReportField } from "../../app/models/reportField";
import { RootStoreContext } from "../../app/stores/rootStore";
import ReportFieldsRenderer from "./ReportFieldsRenderer";

interface IProps {
  report: Partial<IReport>;
}

const EditReportForm = ({ report }: IProps) => {
  console.log("Report", report);
  const rootStore = useContext(RootStoreContext);
  const { reportTypeSelectOptions, getReportType } = rootStore.reportTypeStore;
  const { isSubmitting } = rootStore.reportStore;

  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();
  const [reportFields, setReportFields] = useState<IReportField[]>(report.reportFields!);

  const { handleSubmit, register, errors, formState, control, setValue } = useForm<Partial<IReport>>({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: report,
  });

  const { isDirty } = formState;

  const handleReportTypeChange = (option: ISelectOptions) => {
    let reportType = getReportType(parseInt(option.value.toString()));
    if (reportType !== undefined) {
      setReportFields(reportType.fields);
    } else {
      toast.error("Report Type not found.");
    }
  };

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <Segment>
      <Form onSubmit={handleSubmit(onSubmit)} error>
        <Form.Group widths="equal">
          <Form.Field className={errors.companyId !== undefined ? "error field" : "field"}>
            <label>Company</label>
            <Controller
              control={control}
              name="companyId"
              rules={{ required: "Company is Required*" }}
              defaultValue={{ value: `${report.companyId}`, label: `${report.companyName}` }}
              render={({ onChange, name, value }) => <Select value={value?.value} name={name} isClearable={false} defaultInputValue={report.companyName} isDisabled={true} />}
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
              render={({ onChange, name, value }) => <Select value={value?.value} name={name} isClearable={false} defaultInputValue={report.siteName} isDisabled={true} />}
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
        <Button color="green" content="Update" disabled={!isDirty} loading={isSubmitting} style={{ marginTop: 15 }} />
        {submitErrors && <ErrorMessage error={submitErrors!} />}
      </Form>
    </Segment>
  );
};

export default EditReportForm;
