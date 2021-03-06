import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Category } from '../../nouns.component';
import { Const } from 'src/app/services/utils/const';
import { NounEnding } from 'src/app/models/reference/russian/noun-ending.model';
import { RussianReferenceService } from 'src/app/services/russian-reference.service';
import { DeclensionRule } from 'src/app/models/reference/russian/declension-rule.model';
import { NounService } from 'src/app/services/noun.service';
import { Noun } from 'src/app/models/noun/get/noun.model';
import { Router } from '@angular/router';
export interface RowData {
  case: string;
  singular: string;
  plural: string;
}
export interface ColData {
  field: string;
  header: string;
}
export interface Exception {
  ruleId: number;
  rule: string;
  locations: Array<Location>;
  applied: boolean;
}
export interface Location {
  number: string;
  case: string;
}

@Component({
  selector: 'app-declension-noun',
  templateUrl: './declension-noun.component.html'
})
export class DeclensionNounComponent implements OnInit {

  @Input()
  public category: Category;

  public title: string;
  public unselect: string;

  public rows: Array<string>;
  public cols: Array<ColData>;
  public data: Array<RowData>;

  public exceptions: Array<Exception>;
  public appliedExceptions: Array<Exception>;

  constructor(
    private router: Router,
    public translate: TranslateService,
    private russianReferenceService: RussianReferenceService,
    private nounService: NounService
  ) { }

  ngOnInit(): void {
    this.exceptions = [];
    this.rows = [Const.N, Const.A, Const.G, Const.D, Const.L, Const.I];
    this.cols = [
      { field: Const.c, header: '' }
    ];

    if (!!this.category.idSingularPlural) {
      this.nounService.fetchNounPluralById(this.category.idSingularPlural);
      this.nounService.nounPlural$.subscribe((nPlural: Noun) => {
        if (!!nPlural.id
          && !this.category.endings.some((item) =>
            item.number === nPlural.russianNounCategory.russianGrammaticalNumber
          )) {
          this.category.rootPlural = nPlural.root;
          this.category.endings.push({
            number: nPlural.russianNounCategory.russianGrammaticalNumber,
            nounEndings: nPlural.russianNounCategory.russianNounEndings
          });
        }
        this.init();
      });
    } else {
      this.init();
    }
  }

  private init(): void {
    this.category.endings
      .forEach((ending) => {
        if (ending.number === Const.S && !this.cols.some((c) => c.header === ending.number)) {
          this.cols.push({ field: Const.s, header: Const.S });
        }
        if (ending.number === Const.P && !this.cols.some((c) => c.header === ending.number)) {
          this.cols.push({ field: Const.p, header: Const.P });
        }
        ending.nounEndings
          .filter((nounEnding) => nounEnding.specificEndingRules.length > 0)
          .forEach((nounEnding) => {
            const russianCase = nounEnding.russianCase;
            nounEnding.specificEndingRules
              .forEach((rule) => {
                if (!this.exceptions.some((exception) => exception.rule === rule.rule)) {
                  this.exceptions.push(
                    {
                      ruleId: 0,
                      rule: rule.rule,
                      locations: [{
                        number: ending.number,
                        case: russianCase
                      }],
                      applied: rule.applied
                    }
                  )
                } else {
                  const locations = this.exceptions.find((exception) =>
                    exception.rule === rule.rule
                  ).locations;
                  if (!locations.some((l) => l.number === ending.number && l.case === russianCase)) {
                    locations.push({
                      number: ending.number,
                      case: russianCase
                    });
                  }
                }
              }
              );
          }
          );
      });

    this.getLabels(this.category);
    // update la langue à chaque changement
    this.translate.onLangChange.subscribe(() => {
      this.getLabels(this.category);
    });

    this.setData(this.rows, this.cols, this.category);
    this.russianReferenceService.declensionRules$
      .subscribe((declensionRules: Array<DeclensionRule>) => {
        if (declensionRules.length > 0) {
          declensionRules.forEach((declensionRule) => {
            this.exceptions.forEach((exception) => {
              if (declensionRule.value === exception.rule) {
                exception.ruleId = declensionRule.id;
              }
            });
          });
        }
      });
    this.appliedExceptions = this.exceptions.filter((exception) => exception.applied);
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
    this.unselect = this.translate.instant('nouns.unselect');
    this.title = cat + ' > ' + gender + ' > ' + type;
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
    return declensionValue;
  }

  public number(exceptions: Array<Exception>): number {
    return exceptions.filter((e) => ![6, 7].includes(e.ruleId)).length;
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

  public isAnimatePresent(exceptions: Array<Exception>): boolean {
    return exceptions.some((e) => e.ruleId === 7);
  }

  public isCheckBoxDisabled(ruleId: number): boolean {
    return (this.isRuleApplied(ruleId, 9) || this.isRuleApplied(ruleId, 10))
      || (this.router.url.split('/').length > 2 && this.router.url.split('/')[2] === Const.consult);
  }

  private isRuleApplied(ruleId: number, selectedCheckbox: number): boolean {
    return ruleId !== selectedCheckbox
      && !!this.findByRuleId(this.exceptions, selectedCheckbox)
      && this.findByRuleId(this.exceptions, selectedCheckbox).applied;
  }

  private findByRuleId(exceptions: Array<Exception>, ruleId: number): Exception {
    return exceptions.find((exception) => exception.ruleId === ruleId);
  }

  public isSpecificCase(rowData: RowData, col: ColData): boolean {
    const specificEndingsLocations: Array<Location> = [];
    this.exceptions
      .filter((e) => e.applied && e.ruleId !== 6)
      .map((e) => e.locations)
      .forEach((locations) => {
        locations.forEach((location) => {
          if (!specificEndingsLocations.some((l) =>
            l.case === location.case && l.number === location.number
          )) {
            specificEndingsLocations.push(location);
          }
        });
      });

    const endingsLocation: Location = {
      case: rowData.case,
      number: col.header
    }

    const inanimate = (endingsLocation.case === Const.A
      && specificEndingsLocations.some((l) => l.case === Const.N
        && l.number === endingsLocation.number)
      && this.exceptions.some((e) => e.ruleId === 6)
      && this.exceptions.find((e) => e.ruleId === 6).applied);

    return specificEndingsLocations.some((l) =>
      l.case === endingsLocation.case && l.number === endingsLocation.number
    ) || inanimate;
  }

}
