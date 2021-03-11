import { AxiosResponse } from "axios";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Divider, Form, Header, Icon, Loader, Menu, Segment } from "semantic-ui-react";
import Select from "react-select";
import ErrorMessage from "../../app/common/form/ErrorMessage";
import { IReportFormValues } from "../../app/models/reportFormValues";
import { RootStoreContext } from "../../app/stores/rootStore";
import { ISelectOptions } from "../../app/models/reactSelectOptions";
import ReportFieldsRenderer from "./ReportFieldsRenderer";
import { IReportField } from "../../app/models/reportField";
import { IReportPostValues } from "../../app/models/reportPostValues";
import { IImage } from "../../app/models/image";
import { toast } from "react-toastify";
import AddImagesField from "../../app/common/form/AddImagesField";
import AddImageWithCropperField from "../../app/common/form/AddImageWithCropperField";

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
    register({ name: "requireImages" });
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
  const [requireImages, setRequireImages] = useState<boolean>(false);
  const [showAddImagesField, setShowAddImagesField] = useState<boolean>(false);
  const [showAddCroppedImageField, setShowAddCroppedImageField] = useState<boolean>(false);

  // useEffect(() => {
  //   reportFields.forEach((field) => {
  //     if (field.value === null) {
  //       return (field.value = "");
  //     }
  //   });
  // }, [reportFields]);

  const { handleSubmit, register, errors, formState, control, setValue } = useForm<IReportFormValues>({
    mode: "all",
    reValidateMode: "onChange",
    defaultValues: report,
  });

  const { isDirty } = formState;

  const handleReportTypeChange = (option: ISelectOptions) => {
    let reportType = getReportType(parseInt(option.value.toString()));
    if (reportType !== undefined) {
      setReportFields(reportType.fields);
      setRequireImages(reportType.requireImages);
    } else {
      toast.error("Report Type not found.");
    }
  };

  const handleToggleAddImagesField = () => {
    if (showAddCroppedImageField === true) {
      setShowAddCroppedImageField(false);
    }
    setShowAddImagesField(!showAddImagesField);
  };

  const handleToggleAddCroppedImageField = () => {
    if (showAddImagesField === true) {
      setShowAddImagesField(false);
    }
    setShowAddCroppedImageField(!showAddCroppedImageField);
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
        <Form.Field className={errors.requireImages !== undefined ? "error field" : "field"} style={{ marginBottom: 0 }}>
          {errors.requireImages && (
            <div className="ui pointing below prompt label" id="form-images-error-message" role="alert" aria-atomic="true">
              Report must have at least one image
            </div>
          )}
          <label>Report Images</label>
          <input type="hidden" name="requireImages" ref={register({ required: requireImages })} defaultValue={report.images && report.images.length > 0 ? "that's a texas size 10-4 good buddy" : ""} />
        </Form.Field>
        <Menu stackable attached="top" style={{ marginTop: 0 }} size="small">
          <Menu.Item>
            <Icon name="photo" /> Manage Images
          </Menu.Item>
          <Menu.Item onClick={handleToggleAddImagesField} active={showAddImagesField}>
            Add Images
          </Menu.Item>
          <Menu.Item onClick={handleToggleAddCroppedImageField} active={showAddCroppedImageField}>
            Add Cropped Image
          </Menu.Item>
        </Menu>
        <Segment attached>
          {showAddImagesField && <AddImagesField />}
          {showAddCroppedImageField && <AddImageWithCropperField />}
        </Segment>
        <Button color="green" content={report.id === "" ? "Create" : "Update"} disabled={!isDirty} loading={isSubmitting} style={{ marginTop: 15 }} />
        {submitErrors && <ErrorMessage error={submitErrors!} />}
      </Form>
    </Segment>
  );
};

export default observer(CreateReportForm);
