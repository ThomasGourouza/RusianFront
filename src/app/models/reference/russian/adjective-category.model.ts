import { AdjectiveEnding } from "./adjective-ending.model";

export class AdjectiveCategory {
  constructor(
    public id: number,
    public value: string,
    public endings: Array<AdjectiveEnding>
  ) { }
}
