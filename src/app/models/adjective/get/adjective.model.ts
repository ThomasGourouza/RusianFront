import { AdjectiveCategory } from "../../reference/russian/adjective-category.model";

export class Adjective {
    constructor(
        public id: number,
        public root: string,
        public translation: string,
        public nominativeMasculineForm: string,
        public category: AdjectiveCategory
    ) { }
}
