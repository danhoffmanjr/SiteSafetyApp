import { observable, action } from "mobx";
import { RootStore } from "./rootStore";

export default class ModalStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable.shallow modal = {
    open: false,
    header: null,
    body: null,
    id: null,
    target: null
  };

  @observable.shallow confirm = {
    open: false,
    isDeleting: false,
    header: null,
    body: null,
    footer: null,
    id: null,
    target: null
  };

  @action openModal = (header: any, body: any, id: any, target: any) => {
    this.modal.open = true;
    this.modal.header = header;
    this.modal.body = body;
    this.modal.id = id;
    this.modal.target = target;
  };

  @action closeModal = () => {
    this.modal.open = false;
    this.modal.header = null;
    this.modal.body = null;
    this.modal.id = null;
    this.modal.target = null;
  };

  @action openConfirm = (header: any, body: any, footer: any, id: any, target: any) => {
    this.confirm.open = true;
    this.confirm.isDeleting = true;
    this.confirm.header = header;
    this.confirm.body = body;
    this.confirm.footer = footer;
    this.confirm.id = id;
    this.confirm.target = target;
  };

  @action closeConfirm = () => {
    this.confirm.open = false;
    this.confirm.isDeleting = false;
    this.confirm.header = null;
    this.confirm.body = null;
    this.confirm.footer = null;
    this.confirm.id = null;
    this.confirm.target = null;
  };
}