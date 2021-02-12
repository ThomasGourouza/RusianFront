import { AdjectiveEndingModel } from "./adjective-ending.model";

export class AdjectiveCategoryModel {
  constructor(
    public id: number,
    public value: string,
    public endings: Array<AdjectiveEndingModel>
  ) { }
}
