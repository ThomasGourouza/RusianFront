import { NounCategory } from '../../reference/russian/noun-category.model';

export class Noun {
    constructor(
        public id: number,
        public isAnimate: false,
        public root: string,
        public nominativeForm: string,
        public translation: string,
        public singularPluralCoupleNounId: number,
        public russianNounCategory: NounCategory
    ) { }
}
