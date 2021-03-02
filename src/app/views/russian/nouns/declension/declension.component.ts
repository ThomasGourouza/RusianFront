import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Category } from '../nouns.component';
import { Const } from 'src/app/services/utils/const';
import { NounEnding } from 'src/app/models/reference/russian/noun-ending.model';
export interface RowData {
  case: string;
  singular: string;
  plural: string;
}
export interface ColData {
  field: string;
  header: string;
}
export interface Rule {
  id: number;
  rule: string;
  applied: boolean;
}

@Component({
  selector: 'app-declension',
  templateUrl: './declension.component.html',
  styleUrls: ['./declension.component.scss']
})
export class DeclensionComponent implements OnInit {

  @Input()
  public category: Category;

  public title: string;

  public rows: Array<string>;
  public cols: Array<ColData>;
  public data: Array<RowData>;

  public appliedRules: Array<Rule>;
  public rules: Array<Rule>;

  constructor(
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.getLabels(this.category);
    // update la langue à chaque changement
    this.translate.onLangChange.subscribe(() => {
      this.getLabels(this.category);
    });

    this.rows = [Const.N, Const.A, Const.G, Const.D, Const.L, Const.I];
    this.cols = [
      { field: Const.c, header: '' },
      { field: Const.s, header: Const.S },
      { field: Const.p, header: Const.P }
    ];
    this.setData(this.rows, this.cols, this.category);
    this.resetRules();
  }

  // appel API
  private initRules(): Array<Rule> {
    return [
      {
        id: 1,
        rule: 'After a sibilant (ж, ч, ш, щ) or a velar (г, к, or х) consonant.',
        applied: false
      },
      {
        id: 2,
        rule: 'After a sibilant (ж, ч, ш, щ) and when unstressed.',
        applied: false
      },
      {
        id: 3,
        rule: 'After a sibilant (ж, ч, ш, щ).',
        applied: false
      },
      {
        id: 4,
        rule: 'After a soft consonant and when stressed.',
        applied: false
      },
      {
        id: 5,
        rule: 'After a consonant.',
        applied: false
      },
      {
        id: 6,
        rule: 'Inanimate.',
        applied: true
      },
      {
        id: 7,
        rule: 'Animate.',
        applied: false
      },
      {
        id: 8,
        rule: 'For the nouns ending in ие/иё in the nominative singular and when unstressed.',
        applied: false
      },
      {
        id: 9,
        rule: 'For the nouns мать and дочь.',
        applied: false
      },
      {
        id: 10,
        rule: 'For the noun подмасте́рье.',
        applied: false
      },
      {
        id: 11,
        rule: 'Exception without any specific rule.',
        applied: false
      }
    ];
  }

  private setData(rows: Array<string>, cols: Array<ColData>, category: Category): void {
    this.data = [
      { case: Const.N, singular: "", plural: "" },
      { case: Const.A, singular: "", plural: "" },
      { case: Const.G, singular: "", plural: "" },
      { case: Const.D, singular: "", plural: "" },
      { case: Const.L, singular: "", plural: "" },
      { case: Const.I, singular: "", plural: "" }
    ];
    rows.forEach((row) => {
      cols.forEach((col) => {
        if (col.field != Const.c) {
          this.data
            .find((rowData) => rowData.case === row)
          [col.field] = this.findDeclensionByCaseAndNumber(category, row, col.header);
        }
      });
    });
  }

  public applyRule(id: number, value: boolean): void {
    this.rules.find((rule) => rule.id === id).applied = value;
    if (id === 6) {
      this.rules.find((rule) => rule.id === 7).applied = !value;
    }
    if (id === 7) {
      this.rules.find((rule) => rule.id === 6).applied = !value;
    }
    this.setRules();
    this.appliedRules = this.rules.filter((rule) => rule.applied);
  }

  public resetRules(): void {
    this.rules = this.initRules();
    this.setRules();
    this.appliedRules = this.rules.filter((rule) => rule.applied);
  }

  private setRules(): void {
    this.category.endings.forEach((ending) => {
      if (ending.nounEndings.length > 0) {
        ending.nounEndings.forEach((nounEnding) => {
          if (nounEnding.specificEndingRules.length > 0) {
            nounEnding.specificEndingRules.forEach((specificEndingRule) => {
              specificEndingRule.applied = this.rules.find((rule) =>
                rule.rule === specificEndingRule.rule
              ).applied;
            });
          }
        });
      }
    });
    this.setData(this.rows, this.cols, this.category);
  }

  private getLabels(category: Category): void {
    let cat: string;
    let gender: string;
    let type: string;
    switch (category.declension) {
      case 'First declension': {
        cat = this.translate.instant('nouns.declension.first');
        break;
      }
      case 'Second declension': {
        cat = this.translate.instant('nouns.declension.second');
        break;
      }
      case 'Third declension': {
        cat = this.translate.instant('nouns.declension.third');
        break;
      }
      default: {
        break;
      }
    }
    switch (category.gender) {
      case 'Masculine': {
        gender = this.translate.instant('nouns.gender.masculine');
        break;
      }
      case 'Feminine': {
        gender = this.translate.instant('nouns.gender.feminine');
        break;
      }
      case 'Neutral': {
        gender = this.translate.instant('nouns.gender.neuter');
        break;
      }
      default: {
        break;
      }
    }
    switch (category.type) {
      case 'First type': {
        type = this.translate.instant('nouns.type.first');
        break;
      }
      case 'Second type': {
        type = this.translate.instant('nouns.type.second');
        break;
      }
      case 'Third type': {
        type = this.translate.instant('nouns.type.third');
        break;
      }
      default: {
        break;
      }
    }
    this.title = cat + ' - ' + gender + ' - ' + type;
  }

  private findDeclensionByCaseAndNumber(category: Category, russianCase: string, number: string): string {
    let declensionValue: string;
    const nounEnding: NounEnding = category.endings
      .find((cat) => cat.number === number)
      .nounEndings.find((ending) => ending.russianCase === russianCase);
    declensionValue = nounEnding.value;
    if (nounEnding.specificEndingRules.length > 0) {
      const appliedRule = nounEnding.specificEndingRules.find((rule) => rule.applied);
      if (!!appliedRule) {
        declensionValue = appliedRule.value;
      }
    }
    return (declensionValue != '') ? declensionValue : '/';
  }

  public printCase(russianCase: string): string {
    switch (russianCase) {
      case Const.N: {
        return this.translate.instant('reference.case.nominative');
      }
      case Const.A: {
        return this.translate.instant('reference.case.accusative');
      }
      case Const.G: {
        return this.translate.instant('reference.case.genitive');
      }
      case Const.D: {
        return this.translate.instant('reference.case.dative');
      }
      case Const.L: {
        return this.translate.instant('reference.case.locative');
      }
      case Const.I: {
        return this.translate.instant('reference.case.instrumental');
      }
      default: {
        return russianCase;
      }
    }
  }

  public printNumber(russianNumber: string): string {
    switch (russianNumber) {
      case Const.S: {
        return this.translate.instant('nouns.number.singular');
      }
      case Const.P: {
        return this.translate.instant('nouns.number.plural');
      }
      default: {
        return '';
      }
    }
  }

}
