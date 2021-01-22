import { RootStore } from "./rootStore";
import { observable, action, computed, runInAction } from "mobx";
import agent from "../api/agent";
import { ICompany } from "../models/company";
import { ISelectOptions } from "../models/reactSelectOptions";
import { toast } from "react-toastify";
import { ISiteFormValues } from "../models/siteFormValues";


export default class CompanyStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable showForm = false;
  @observable isSubmitting = false;
  @observable loadingCompanies = false;
  @observable company: ICompany | null = null;
  @observable companyRegistry = new Map<number, ICompany>();

  @computed get companiesOrderedAscending() {
    return Array.from(this.companyRegistry.values()).sort(this.compareCompany);
  }

  @computed get companySelectOptions(): ISelectOptions[] {
    let options: ISelectOptions[] = [];
     this.companyRegistry.forEach(company => {
      options.push({ value: `${company.id}`, label: `${company.name}` })
    });
    return options.sort(this.compareOptions);
  }

  compareCompany(company1: ICompany, company2: ICompany) {
    if (company1.name < company2.name) {
      return -1;
    }
    if (company1.name > company2.name) {
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
  
  getCompany = (id: number) => {
    return this.companyRegistry.get(id);
  };

  @action toggleForm = () => {
    runInAction(() => {
      this.showForm = !this.showForm;
    });
  };

  @action loadCompanies = async () => {
    this.loadingCompanies = true;
    try {
        const companies = await agent.Companies.list();
        runInAction(() => {
          companies.forEach((company) => {
            this.companyRegistry.set(company.id, company);
            this.loadingCompanies = false;
          });
        });
      } catch (error) {
        runInAction(() => {
          this.loadingCompanies = false;
        });
        console.log("Get Companies Error:", error);//remove
        throw error;
      }
  };

  @action createCompany = async (name: string) => {
    try {
        const company = await agent.Companies.create(name);
        runInAction(() => {
          this.companyRegistry.set(company.id, company);
        });
        toast.success(`${company.name} successfully created`);
      } catch (error) {
        console.log("Create Company Error:", error);//remove
        throw error;
      }
  };

  @action deleteCompany = async (id: string) => {
    try {
      const companyId = parseInt(id);
      await agent.Companies.delete(id);
        runInAction(() => {
          this.companyRegistry.delete(companyId);
        });
        toast.success(`Company successfully deleted`);
      } catch (error) {
        console.log("Delete Company Error:", error);//remove
        throw error;
      }
  };

  @action createSiteForCompany = async (site: ISiteFormValues) => {
    this.isSubmitting = true;
    console.log("Create Site for Company form values:", site);
    try {
        const newSite = await agent.Sites.create(site);
        if (newSite !== null) {
          const companies = await agent.Companies.list();
          runInAction(() => {
            this.loadingCompanies = true;
            companies.forEach((company) => {
              this.companyRegistry.set(company.id, company);
            });
            this.loadingCompanies = false;
            this.isSubmitting = false;
            toast.success(`${newSite.name} successfully created!`);
          });
        }
      } catch (error) {
        runInAction(() => {
          this.isSubmitting = false;
        });
        console.log("Create Site Error:", error);//remove
        throw error;
      }
  };

  @action deleteSiteFromCompany = async (id: string) => {
    this.isSubmitting = true;
    try {
      const siteId = parseInt(id);
      const result = await agent.Sites.delete(id);
      console.log("Delete Site from Company Result:", result);
      if (true) {
        const companies = await agent.Companies.list();
        runInAction(() => {
          this.loadingCompanies = true;
          companies.forEach((company) => {
            this.companyRegistry.set(company.id, company);
          });
          this.loadingCompanies = false;
          this.isSubmitting = false;
          toast.success(`Site successfully deleted.`);
        });
      }
      } catch (error) {
        console.log("Delete site from company error:", error);//remove
        this.isSubmitting = false;
        throw error;
      }
  };

  @action getSiteOptionsByCompanyId = (companyId: number): ISelectOptions[] => {
    let options: ISelectOptions[] = [];
    let company = this.companyRegistry.get(companyId);
     company?.sites.forEach(site => {
      options.push({ value: `${site.id}`, label: `${site.name}` })
    });
    return options.sort(this.compareOptions);
  }
}