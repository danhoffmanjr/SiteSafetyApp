import { configure } from 'mobx';
import { createContext } from 'react';
import CommonStore from './commonStore';
import CompanyStore from './companyStore';
import ModalStore from './modalStore';
import ReportStore from './reportStore';
import SiteStore from './siteStore';
import UserStore from './userStore';

configure({ enforceActions: 'always' });

export class RootStore {
    reportStore: ReportStore;
    userStore: UserStore;
    commonStore: CommonStore;
    modalStore: ModalStore;
    companyStore: CompanyStore;
    siteStore: SiteStore;

    constructor() {
        this.reportStore = new ReportStore(this);
        this.userStore = new UserStore(this);
        this.commonStore = new CommonStore(this);
        this.modalStore = new ModalStore(this);
        this.companyStore = new CompanyStore(this);
        this.siteStore = new SiteStore(this);
    }
}

export const RootStoreContext = createContext(new RootStore());