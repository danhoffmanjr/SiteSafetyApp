import { action, observable } from "mobx";
import { RootStore } from "./rootStore";

export default class ImageStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
      }

      @observable imageRegistry = new Map<string, Blob>();

      @action addImage = (name: string, image: Blob) => {
        this.imageRegistry.set(name, image);
      }

      @action removeImage = (key: string) => {
        this.imageRegistry.delete(key);
      }
}