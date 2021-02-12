import { NounEndingModel } from "./noun-ending.model";

export class NounCategoryModel {
  constructor(
    public id: number,
    public russianDeclensionName: string,
    public russianGender: string,
    public russianGrammaticalNumber: string,
    public russianDeclCatType: string,
    public russianNounEndings: Array<NounEndingModel>
  ) { }
}
