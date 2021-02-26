import { action, observable, runInAction } from "mobx";
import agent from "../api/agent";
import { IImageUploadFormValues } from "../models/imageUploadFormValues";
import { RootStore } from "./rootStore";

export default class ImageStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable imageRegistry = new Map<string, Blob>();
  @observable uploading = false;

  @action addImage = (name: string, image: Blob) => {
    this.imageRegistry.set(name, image);
  };

  @action removeImage = (key: string) => {
    this.imageRegistry.delete(key);
  };

  @action removeAllImages = () => {
    this.imageRegistry.clear();
  };

  @action uploadImage = async (filename: string, image: Blob) => {
    this.uploading = true;
    try {
      const result = await agent.ReportImages.upload(filename, image);
      runInAction(() => (this.uploading = false));
      console.log(result);
    } catch (error) {
      console.log(error);
      runInAction(() => (this.uploading = false));
    }
  };

  @action uploadImages = async (data: IImageUploadFormValues) => {
    this.uploading = true;
    try {
      await agent.ReportImages.uploadBatch(data);
      runInAction(() => (this.uploading = false));
    } catch (error) {
      console.log(error);
      runInAction(() => (this.uploading = false));
    }
  };
}
