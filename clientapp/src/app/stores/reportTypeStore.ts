import { action, observable } from "mobx";
import { IFieldType } from "../models/fieldType";
import { ISelectOptions } from "../models/reactSelectOptions";
import { RootStore } from "./rootStore";

export default class ReportTypeStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable fieldTypes: IFieldType = {
    Text: { name: "Text", label: "Text", requiresPlaceholder: true, requiresOptions: false },
    Dropdown: { name: "Dropdown", label: "Dropdown", requiresPlaceholder: true, requiresOptions: true },
    Checkbox: { name: "Checkbox", label: "Checkbox", requiresPlaceholder: true, requiresOptions: false },
    Textarea: { name: "Textarea", label: "Textarea", requiresPlaceholder: true, requiresOptions: false },
    ImageUploader: { name: "ImageUploader", label: "Image Uploader", requiresPlaceholder: false, requiresOptions: false },
  };

  @observable fieldTypeOptions: ISelectOptions[] = [
    { value: `Text`, label: `Text` },
    { value: `Dropdown`, label: `Dropdown` },
    { value: `Checkbox`, label: `Checkbox` },
    { value: `Textarea`, label: `Textarea` },
    { value: `ImageUploader`, label: `Image Uploader` },
  ];

  @observable isRequiredOptions: ISelectOptions[] = [
    { value: 1, label: `Yes` },
    { value: 0, label: `No` },
  ];

  @action createDropdownOptions = (options: string) => {
    let optionsArray = options.split(",");
    let dropdownOptions: { key: string; value: string; text: string }[] = [];
    optionsArray.map((option, index) => {
      dropdownOptions.push({ key: `${index}`, value: `${option}`, text: `${option}` });
    });
    return dropdownOptions;
  };
}
