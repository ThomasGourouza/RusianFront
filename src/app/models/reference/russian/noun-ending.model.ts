import { SpecificEndingRuleModel } from "./specific-ending-rule.model";

export class NounEndingModel {
    constructor(
        public russianCase: string,
        public value: string,
        public specificEndingRules: Array<SpecificEndingRuleModel>
    ) { }
}
