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
      { value: `Yes`, label: `Yes` },
      { value: `No`, label: `No` }
  ];
}