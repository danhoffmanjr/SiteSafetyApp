import { AxiosResponse } from "axios";
import { observer } from "mobx-react-lite";
import React, { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Divider, Form, Header, Icon, Loader, Menu, Segment, Image } from "semantic-ui-react";
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
  const { setReportFieldsFromForm, isSubmitting, createReport } = rootStore.reportStore;
  const { loadCompanies, companySelectOptions, loadingCompanies, getCompany, getSiteOptionsByCompanyId } = rootStore.companyStore;
  const { getSite } = rootStore.siteStore;
  const { reportTypeSelectOptions, loadReportTypes, loadingReportTypes, getReportType } = rootStore.reportTypeStore;
  const { removeImage, removeAllImages, imageRegistry } = rootStore.imageStore;

  const [siteOptions, setSiteOptions] = useState<ISelectOptions[]>([]);
  const [submitErrors, setSubmitErrors] = useState<AxiosResponse>();
  const [reportFields, setReportFields] = useState<IReportField[]>(report.reportFields);
  const [images, setImages] = useState<Map<string, Blob>>();
  const [postImages, setPostImages] = useState<IImage[]>();
  const [requireImages, setRequireImages] = useState<boolean>(false);
  const [showAddImagesField, setShowAddImagesField] = useState<boolean>(false);
  const [showAddCroppedImageField, setShowAddCroppedImageField] = useState<boolean>(false);

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
    if (reportTypeSelectOptions.length < 1) {
      loadReportTypes();
    }
  }, [reportTypeSelectOptions, loadReportTypes]);

  useEffect(() => {
    setImages(imageRegistry);
  }, [imageRegistry]);

  useEffect(() => {
    if (images !== undefined && images.size > 0) {
      let imageEnumerator = images.entries();
      let imageArr: IImage[] = [];
      for (let i = 0; i < images.size; i++) {
        let data = imageEnumerator.next().value;
        let image: IImage = { filename: data[0], image: data[1] };
        imageArr.push(image);
      }
      setPostImages(imageArr);
      setValue("requireImages", true);
      console.log("useEffect ran for image change:"); //remove
    } else {
      setPostImages([]);
      setValue("requireImages", false);
    }
  }, [images?.size]);

  const handleCompanyChange = (value: ISelectOptions) => {
    if (value !== null) {
      let id = parseInt(value.value.toString());
      let options = getSiteOptionsByCompanyId(id);
      setSiteOptions(options);
      setValue("siteId", "");
    } else {
      setSiteOptions([]);
    }
  };

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

  const handleRemoveImage = (url: string, key: string) => {
    URL.revokeObjectURL(url);
    removeImage(key);
  };

  const onSubmit = (data: any) => {
    let company = getCompany(parseInt(data.companyId));
    let site = getSite(parseInt(data.siteId));
    let reportType = getReportType(parseInt(data.reportTypeId));
    let postFields = setReportFieldsFromForm(data.reportFields, reportFields);
    let values: IReportPostValues = {
      ...data,
      companyName: company?.name,
      siteName: site?.name,
      siteId: parseInt(data.siteId),
      reportTypeId: parseInt(data.reportTypeId),
      reportType: reportType?.title,
      reportFields: JSON.stringify(postFields),
      requireImages: requireImages,
    };

    createReport(values, postImages).catch((error) => {
      setSubmitErrors(error);
    });
  };

  return (
    <Segment>
      {(loadingCompanies || loadingReportTypes) && <Loader content="Loading options..." active />}
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
                    handleCompanyChange(value);
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
                  options={siteOptions}
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
          <input type="hidden" name="requireImages" ref={register({ required: requireImages })} defaultValue={images && images.size > 0 ? "that's a texas size 10-4 good buddy" : ""} />
        </Form.Field>
        {/* Extract to own component */}
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
          {images && images.size > 1 && (
            <Menu.Item onClick={removeAllImages} position="right">
              Remove All Images
            </Menu.Item>
          )}
        </Menu>
        {(showAddImagesField || showAddCroppedImageField) && (
          <Segment attached>
            {showAddImagesField && <AddImagesField />}
            {showAddCroppedImageField && <AddImageWithCropperField />}
          </Segment>
        )}
        <Segment attached="bottom">
          <div style={{ display: "flex", justifyContent: "flex-start", flexWrap: "wrap" }}>
            {images &&
              images.size > 0 &&
              Array.from(images).map((blob) => {
                let imageUrl = URL.createObjectURL(blob[1]);
                let imageKey = blob[0];
                return (
                  <Segment key={imageKey} style={{ padding: 0, margin: "0.5em 1em 0.5em 0 " }}>
                    <Image src={imageUrl} alt={imageKey} style={{ maxHeight: 100 }} />
                    <Button fluid compact size="mini" attached="bottom" onClick={() => handleRemoveImage(imageUrl, imageKey)}>
                      Remove
                    </Button>
                  </Segment>
                );
              })}
          </div>
        </Segment>
        <Button color="green" content={report.id === "" ? "Create" : "Update"} disabled={!isDirty} loading={isSubmitting} style={{ marginTop: 15 }} />
        {submitErrors && <ErrorMessage error={submitErrors!} />}
      </Form>
    </Segment>
  );
};

export default observer(CreateReportForm);
