import { action, computed, observable, runInAction } from "mobx";
import agent from "../api/agent";
import { IReport } from "../models/report";
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
}
