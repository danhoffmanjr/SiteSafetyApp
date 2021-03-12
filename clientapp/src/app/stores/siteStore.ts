import { ISite } from "../models/site";
import { RootStore } from "./rootStore";
import { observable, action, computed, runInAction } from "mobx";
import agent from "../api/agent";
import { ISelectOptions } from "../models/reactSelectOptions";
import { ISiteFormValues } from "../models/siteFormValues";
import { toast } from "react-toastify";
import { IUserSiteFormValues } from "../models/userSiteFormValues";

export default class SiteStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable loadingSites = false;
  @observable loadingSite = false;
  @observable isSubmitting = false;
  @observable showForm = false;
  @observable site: ISite | null = null;
  @observable sitesRegistry = new Map<number, ISite>();

  @computed get sitesOrderedAscending() {
    return Array.from(this.sitesRegistry.values()).sort(this.compareSite);
  }

  @computed get siteSelectOptions(): ISelectOptions[] {
    let options: ISelectOptions[] = [];
    this.sitesRegistry.forEach((site) => {
      options.push({ value: `${site.id}`, label: `${site.name}` });
    });
    return options.sort(this.compareOptions);
  }

  compareSite(site1: ISite, site2: ISite) {
    if (site1.name < site2.name) {
      return -1;
    }
    if (site1.name > site2.name) {
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

  @action getSite = (id: number) => {
    if (this.sitesRegistry.size < 1) {
      this.loadSites();
      if (this.sitesRegistry.size > 0) {
        this.getSite(id);
      }
    }
    return this.sitesRegistry.get(id);
  };

  @action toggleForm = () => {
    runInAction(() => {
      this.showForm = !this.showForm;
    });
  };

  @action loadSites = async () => {
    this.loadingSites = true;
    try {
      const sites = await agent.Sites.list();
      runInAction(() => {
        sites.forEach((site) => {
          this.sitesRegistry.set(site.id, site);
        });
        this.loadingSites = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingSites = false;
      });
      console.log("Get Sites Error:", error); //remove
      throw error;
    }
  };

  @action loadSitesNoLoader = async () => {
    try {
      const sites = await agent.Sites.list();
      runInAction(() => {
        sites.forEach((site) => {
          this.sitesRegistry.set(site.id, site);
        });
      });
    } catch (error) {
      throw error;
    }
  };

  @action loadSiteById = async (siteId: string) => {
    this.loadingSite = true;
    try {
      const site = await agent.Sites.get(siteId);
      runInAction(() => {
        this.site = site;
        this.loadingSite = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loadingSite = false;
      });
      console.log("Get Site by Id Error:", error); //remove
      throw error;
    }
  };

  @action loadSiteByIdNoLoader = async (siteId: string) => {
    try {
      const site = await agent.Sites.get(siteId);
      runInAction(() => {
        this.site = site;
      });
    } catch (error) {
      throw error;
    }
  };

  @action createSite = async (site: ISiteFormValues) => {
    this.isSubmitting = true;
    try {
      const newSite = await agent.Sites.create(site);
      runInAction(() => {
        this.sitesRegistry.set(newSite.id, newSite);
        this.isSubmitting = false;
        toast.success(`${newSite.name} successfully created!`);
        this.toggleForm();
      });
    } catch (error) {
      runInAction(() => {
        this.isSubmitting = false;
      });
      console.log("Create Site Error:", error); //remove
      throw error;
    }
  };

  @action updateSite = async (site: Partial<ISiteFormValues>) => {
    this.isSubmitting = true;
    try {
      if ((site.id !== null || site.id !== undefined) && typeof site.id === "string") {
        site.id = parseInt(site.id!.toString());
      }
      await agent.Sites.update(site);
      runInAction(() => {
        this.site = { ...this.site!, ...site };
        this.isSubmitting = false;
        toast.success(`${site.name} successfully updated!`);
      });
    } catch (error) {
      runInAction(() => {
        this.isSubmitting = false;
      });
      console.log("Update Site Error:", error); //remove
      throw error;
    }
  };

  @action deleteSite = async (id: string) => {
    this.isSubmitting = true;
    try {
      const siteId = parseInt(id);
      await agent.Sites.delete(id);
      runInAction(() => {
        this.sitesRegistry.delete(siteId);
        this.isSubmitting = false;
      });
      toast.success(`Site successfully deleted.`);
    } catch (error) {
      console.log("Delete Site Error:", error); //remove
      this.isSubmitting = false;
      throw error;
    }
  };

  @action assignUserToSite = async (values: IUserSiteFormValues) => {
    this.isSubmitting = true;
    try {
      const siteAssigned: ISite = await agent.Sites.assign(values);
      runInAction(() => {
        this.loadSitesNoLoader();
        this.loadSiteByIdNoLoader(values.siteId!.toString());
        this.isSubmitting = false;
        toast.success(`Site successfully assigned!`);
      });
    } catch (error) {
      runInAction(() => {
        this.isSubmitting = false;
      });
      console.log("Assign Site Error:", error); //remove
      throw error;
    }
  };

  @action unassignUserFromSite = async (values: IUserSiteFormValues) => {
    this.isSubmitting = true;
    try {
      await agent.Sites.unassign(values);
      runInAction(() => {
        this.loadSitesNoLoader();
        this.loadSiteByIdNoLoader(values.siteId!.toString());
        this.isSubmitting = false;
        toast.success(`User successfully removed from site.`);
      });
    } catch (error) {
      runInAction(() => {
        this.isSubmitting = false;
      });
      console.log("Unassign User Error:", error); //remove
      throw error;
    }
  };

  @action getSelectOptionsForSites = (sites: ISite[]): ISelectOptions[] => {
    let options: ISelectOptions[] = [];
    sites.forEach((site) => {
      options.push({ value: `${site.id}`, label: `${site.name}` });
    });
    return options.sort(this.compareOptions);
  };
}
