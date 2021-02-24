import { action, computed, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IFieldType } from "../models/fieldType";
import { ISelectOptions } from "../models/reactSelectOptions";
import { IReportType } from "../models/reportType";
import { IReportTypeFormValues } from "../models/reportTypeFormValues";
import { RootStore } from "./rootStore";

export default class ReportTypeStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable reportTypesRegistry = new Map();
  @observable loadingReportTypes = false;
  @observable isSubmitting = false;

  @observable fieldTypes: IFieldType = {
    Text: { name: "Text", label: "Text", requiresPlaceholder: true, requiresOptions: false },
    Dropdown: { name: "Dropdown", label: "Dropdown", requiresPlaceholder: true, requiresOptions: true },
    Checkbox: { name: "Checkbox", label: "Checkbox", requiresPlaceholder: true, requiresOptions: false },
    Textarea: { name: "Textarea", label: "Textarea", requiresPlaceholder: true, requiresOptions: false },
    ImageUploader: { name: "ImageUploader", label: "Image Uploader", requiresPlaceholder: false, requiresOptions: false },
  };

  @observable fieldTypeOptions: ISelectOptions[] = [
    { value: `Text`, label: `Text` },
    { value: `Dropdown`, label: `Dropdown` },
    { value: `Checkbox`, label: `Checkbox` },
    { value: `Textarea`, label: `Textarea` },
    { value: `ImageUploader`, label: `Image Uploader` },
  ];

  @observable isRequiredOptions: ISelectOptions[] = [
    { value: 1, label: `Yes` },
    { value: 0, label: `No` },
  ];

  @computed get typesOrderedByTitleAscending(): IReportType[] {
    return Array.from(this.reportTypesRegistry.values()).sort(this.compareFormTitle);
  }

  compareFormTitle(form1: IReportType, form2: IReportType) {
    if (form1.title < form2.title) {
      return -1;
    }
    if (form1.title > form2.title) {
      return 1;
    }
    return 0;
  }

  @action loadReportTypes = async () => {
    this.loadingReportTypes = true;
    try {
      const types = await agent.ReportTypes.list();
      runInAction(() => {
        types.forEach((type) => {
          this.reportTypesRegistry.set(type.id, type);
        });
        this.loadingReportTypes = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingReportTypes = false;
      });
      console.log("Load Report Types Error:", error.statusText); //remove
    }
  };

  @action createReportType = async (values: IReportTypeFormValues) => {
    this.isSubmitting = true;
    try {
      await agent.ReportTypes.create(values);
      runInAction(() => {
        this.loadReportTypes();
        this.isSubmitting = false;
        toast.success(`${values.title} report type created successfully.`);
      });
    } catch (error) {
      runInAction(() => {
        this.isSubmitting = false;
      });
      console.log("Create report Type Error:", error); //remove
      throw error;
    }
  };

  @action deleteReportType = async (id: number) => {
    this.isSubmitting = true;
    try {
      await agent.ReportTypes.delete(id);
      runInAction(() => {
        this.reportTypesRegistry.delete(id);
        this.isSubmitting = false;
      });
      toast.success(`Report Type deleted successfully.`);
    } catch (error) {
      console.log("Delete Report Type Error:", error); //remove
      this.isSubmitting = false;
      throw error;
    }
  };

  @action createDropdownOptions = (options: string) => {
    let optionsArray = options.split(",");
    let dropdownOptions: { key: string; value: string; text: string }[] = [];
    optionsArray.map((option, index) => {
      dropdownOptions.push({ key: `${index}`, value: `${option}`, text: `${option}` });
    });
    return dropdownOptions;
  };
}
