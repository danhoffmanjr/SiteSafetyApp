import { action, computed, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
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
  @observable isSubmitting = false;

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

  @action loadReports = async () => {
    this.loadingReports = true;
    try {
      const reports = await agent.Reports.list();
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
      console.log("Load Reports Error:", error.statusText); //remove
    }
  };

  @action createReport = async (values: IReportPostValues) => {
    this.isSubmitting = true;
    try {
      await agent.Reports.create(values);
      runInAction(() => {
        this.loadReports();
        this.isSubmitting = false;
        toast.success(`${values.title} report created successfully.`);
      });
    } catch (error) {
      runInAction(() => {
        this.isSubmitting = false;
      });
      console.log("Create report Type Error:", error); //remove
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

  compareOptions(options1: ISelectOptions, options2: ISelectOptions) {
    if (options1.label < options2.label) {
      return -1;
    }
    if (options1.label > options2.label) {
      return 1;
    }
    return 0;
  }
}
