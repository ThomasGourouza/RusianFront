import { SpecificEndingRule } from "./specific-ending-rule.model";

export class NounEnding {
    constructor(
        public russianCase: string,
        public value: string,
        public specificEndingRules: Array<SpecificEndingRule>
    ) { }
}
