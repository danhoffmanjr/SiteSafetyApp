import { action, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import agent from "../api/agent";
import { IImageUpdateFormValues } from "../models/imageUpdateFormValues";
import { IImageUploadFormValues } from "../models/imageUploadFormValues";
import { IReportImage } from "../models/reportImage";
import { RootStore } from "./rootStore";

export default class ImageStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable imageRegistry = new Map<string, Blob>();
  @observable image: IReportImage | null = null;
  @observable uploading = false;
  @observable isSubmitting = false;
  @observable loading = false;

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
      toast.success(`Image added successfully.`);
      console.log(result);
    } catch (error) {
      console.log(error);
      runInAction(() => (this.uploading = false));
      toast.error(`Problem uploading image. Error: ${error.statusText}`, { autoClose: 5000 });
    }
  };

  @action uploadImages = async (data: IImageUploadFormValues) => {
    this.uploading = true;
    try {
      await agent.ReportImages.uploadBatch(data);
      runInAction(() => (this.uploading = false));
      toast.success(`Images added successfully.`);
    } catch (error) {
      console.log(error);
      runInAction(() => (this.uploading = false));
      toast.error(`Problem uploading images. Error: ${error.statusText}`, { autoClose: 5000 });
    }
  };

  @action loadImageById = async (id: string) => {
    this.loading = true;
    try {
      const image = await agent.ReportImages.get(id);
      runInAction(() => {
        this.image = image;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.log("Load Image by Id Error:", error); //remove
      toast.error(`Problem loading image. Error: ${error.statusText}`, { autoClose: 10000 });
      throw error;
    }
  };

  @action updateImage = async (values: IImageUpdateFormValues) => {
    this.isSubmitting = true;
    values.id = parseInt(values.id.toString());
    try {
      await agent.ReportImages.update(values);
      runInAction(() => (this.isSubmitting = false));
      toast.success(`Image updated successfully.`);
    } catch (error) {
      console.log(error);
      runInAction(() => (this.isSubmitting = false));
      toast.error(`Problem updating image. Error: ${error.statusText}`, { autoClose: 5000 });
    }
  };

  @action deleteImage = async (id: string, name: string) => {
    this.isSubmitting = true;
    try {
      await agent.ReportImages.delete(id);
      runInAction(() => {
        this.imageRegistry.delete(name);
        this.isSubmitting = false;
      });
      toast.success(`Image deleted successfully.`);
    } catch (error) {
      console.log("Delete Image Error:", error); //remove
      this.isSubmitting = false;
      throw error;
    }
  };
}
