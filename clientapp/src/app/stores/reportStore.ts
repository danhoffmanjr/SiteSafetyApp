import { action, computed, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IImage } from "../models/image";
import { IImageUploadFormValues } from "../models/imageUploadFormValues";
import { ISelectOptions } from "../models/reactSelectOptions";
import { IReport } from "../models/report";
import { IReportPostValues } from "../models/reportPostValues";
import { RootStore } from "./rootStore";

export default class ReportStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable reportsRegistry = new Map();
  @observable loadingReports = false;
  @observable loadingReport = false;
  @observable isSubmitting = false;
  @observable showForm = false;
  @observable report: IReport | null = null;

  @computed get reportsOrderedByTitleAscending(): IReport[] {
    return Array.from(this.reportsRegistry.values()).sort(this.compareReportTitle);
  }

  compareReportTitle(report1: IReport, report2: IReport) {
    if (report1.title < report2.title) {
      return -1;
    }
    if (report1.title > report2.title) {
      return 1;
    }
    return 0;
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

  @action setAllNullReportFieldsToEmpty = (report: IReport) => {
    report.reportFields.forEach((field) => {
      if (field.value === null) {
        return (field.value = "");
      }
    });
  };

  @action toggleForm = () => {
    runInAction(() => {
      this.showForm = !this.showForm;
    });
  };

  @action loadReports = async () => {
    this.loadingReports = true;
    try {
      const reports = await agent.Reports.list();
      reports.forEach((report) => this.setAllNullReportFieldsToEmpty(report));
      runInAction(() => {
        reports.forEach((report) => {
          this.reportsRegistry.set(report.id, report);
        });
        this.loadingReports = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingReports = false;
      });
      toast.error(`Problem loading reports. Error: ${error.statusText}`, { autoClose: 10000 });
      console.log("Load Reports Error:", error.statusText); //remove
    }
  };

  @action loadReportById = async (id: string) => {
    this.loadingReport = true;
    try {
      const report = await agent.Reports.get(id);
      this.setAllNullReportFieldsToEmpty(report);
      runInAction(() => {
        this.report = report;
        this.loadingReport = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingReport = false;
      });
      console.log("Load Report by Id Error:", error); //remove
      toast.error(`Problem loading report. Error: ${error.statusText}`, { autoClose: 10000 });
      throw error;
    }
  };

  @action createReport = async (values: IReportPostValues) => {
    this.isSubmitting = true;
    try {
      const newReportId = await agent.Reports.create(values);
      if (values.images) {
        const data: IImageUploadFormValues = {
          reportId: newReportId,
          images: values.images,
        };
        runInAction(() => {
          this.rootStore.imageStore.uploadImages(data);
        });
      }

      runInAction(() => {
        this.loadReports();
        this.isSubmitting = false;
        toast.success(`${values.title} report created successfully.`);
        this.toggleForm();
      });
    } catch (error) {
      runInAction(() => {
        this.isSubmitting = false;
      });
      toast.error(`Problem creating report. Error: ${error.statusText}`, { autoClose: 10000 });
      console.log("Create report Type Error:", error); //remove
      throw error;
    }
  };

  @action deleteReport = async (id: number) => {
    this.isSubmitting = true;
    try {
      await agent.Reports.delete(id.toString());
      runInAction(() => {
        this.reportsRegistry.delete(id);
        this.isSubmitting = false;
      });
      toast.success(`Report deleted successfully.`);
    } catch (error) {
      console.log("Delete Report Error:", error); //remove
      toast.error(`Problem deleting report. Error: ${error.statusText}`, { autoClose: 5000 });
      this.isSubmitting = false;
      throw error;
    }
  };

  @action createSelectOptionsFromString = (options: string): ISelectOptions[] => {
    let optionsArray = options.split(",");
    let selectOptions: { value: string; label: string }[] = [];
    optionsArray.map((option) => {
      selectOptions.push({ value: `${option}`, label: `${option}` });
    });
    return selectOptions.sort(this.compareOptions);
  };
}
