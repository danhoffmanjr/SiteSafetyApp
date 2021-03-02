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

  @observable reportTypesRegistry = new Map<number, IReportType>();
  @observable loadingReportTypes = false;
  @observable isSubmitting = false;
  @observable showForm = false;

  //TODO: add radio button option
  @observable fieldTypes: IFieldType = {
    Text: { name: "Text", label: "Text", requiresPlaceholder: true, requiresOptions: false },
    Dropdown: { name: "Dropdown", label: "Dropdown", requiresPlaceholder: true, requiresOptions: true },
    Checkbox: { name: "Checkbox", label: "Checkbox", requiresPlaceholder: true, requiresOptions: false },
    Textarea: { name: "Textarea", label: "Textarea", requiresPlaceholder: true, requiresOptions: false },
    ImageCropperLoader: { name: "ImageCropperLoader", label: "Image Cropper Loader", requiresPlaceholder: false, requiresOptions: false },
    ImagesLoader: { name: "ImagesLoader", label: "Images Loader", requiresPlaceholder: false, requiresOptions: false },
  };

  @computed get fieldTypeOptions(): ISelectOptions[] {
    let options: ISelectOptions[] = [];
    Object.keys(this.fieldTypes).map((type) => {
      options.push({ value: `${this.fieldTypes[type].name}`, label: `${this.fieldTypes[type].label}` });
    });
    return options.sort(this.compareOptions);
  }

  @observable isRequiredOptions: ISelectOptions[] = [
    { value: 1, label: `Yes` },
    { value: 0, label: `No` },
  ];

  @computed get typesOrderedByTitleAscending(): IReportType[] {
    return Array.from(this.reportTypesRegistry.values()).sort(this.compareFormTitle);
  }

  @computed get reportTypeSelectOptions(): ISelectOptions[] {
    let options: ISelectOptions[] = [];
    this.reportTypesRegistry.forEach((type) => {
      options.push({ value: `${type.id}`, label: `${type.title}` });
    });
    return options.sort(this.compareOptions);
  }

  compareOptions(options1: ISelectOptions, options2: ISelectOptions) {
    if (options1.label < options2.label) {
      return -1;
    }
    if (options1.label > options2.label) {
      return 1;
    }
    return 0;
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

  @action toggleForm = () => {
    runInAction(() => {
      this.showForm = !this.showForm;
    });
  };

  @action getReportType = (id: number): IReportType | undefined => {
    return this.reportTypesRegistry.get(id);
  };

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
      toast.error(`Problem loading report types. Error: ${error.statusText}`, { autoClose: 10000 });
    }
  };

  @action createReportType = async (values: IReportTypeFormValues) => {
    this.isSubmitting = true;
    try {
      await agent.ReportTypes.create(values);
      runInAction(() => {
        this.loadReportTypes();
        this.isSubmitting = false;
        this.toggleForm();
        toast.success(`${values.title} report type created successfully.`);
      });
    } catch (error) {
      runInAction(() => {
        this.isSubmitting = false;
      });
      toast.error(`Problem creating report type. Error: ${error.statusText}`, { autoClose: 10000 });
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
      toast.error(`Problem deleting report type. Error: ${error.statusText}`, { autoClose: 10000 });
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
