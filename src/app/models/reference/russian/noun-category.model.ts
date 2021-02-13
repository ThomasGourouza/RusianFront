import { NounEnding } from "./noun-ending.model";

export class NounCategory {
  constructor(
    public id: number,
    public russianDeclensionName: string,
    public russianGender: string,
    public russianGrammaticalNumber: string,
    public russianDeclCatType: string,
    public russianNounEndings: Array<NounEnding>
  ) { }
}
