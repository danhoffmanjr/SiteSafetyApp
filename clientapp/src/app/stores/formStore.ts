import { observable } from "mobx";
import { ISelectOptions } from "../models/reactSelectOptions";
import { RootStore } from "./rootStore";

export default class FormStore {
    rootStore: RootStore;
  
    constructor(rootStore: RootStore) {
      this.rootStore = rootStore;
    }

  @observable fieldTypeOptions: ISelectOptions[] = [
    { value: `Checkbox`, label: `Checkbox` },
    { value: `Dropdown`, label: `Dropdown` },
    { value: `Text`, label: `Text` },
    { value: `Textarea`, label: `Textarea` }
  ];

  @observable isRequiredOptions: ISelectOptions[] = [
      { value: 1, label: `Yes` },
      { value: 0, label: `No` }
  ];

  @observable typeOptions: {value: string, text: string}[] = [
    { value: "Dropdown", text: "Dropdown" },
    { value: "Text", text: "Text" },
    { value: "Textarea", text: "Textarea" },
    { value: "Checkbox", text: "Checkbox" },
  ];

//   @observable isRequiredOptions: {value: number, text: string}[] = [
//     { value: 1, text: `Yes` },
//     { value: 0, text: `No` }
// ];
}