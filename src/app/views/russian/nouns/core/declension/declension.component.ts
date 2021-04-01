import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Category, Ending } from '../../nouns.component';
import { Const } from 'src/app/services/utils/const';
import { NounEnding } from 'src/app/models/reference/russian/noun-ending.model';
import { RussianReferenceService } from 'src/app/services/russian-reference.service';
import { DeclensionRule } from 'src/app/models/reference/russian/declension-rule.model';
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
  specificIds: Array<SpecificId>;
  rule: string;
  locations: Array<Location>;
  applied: boolean;
}
export interface SpecificId {
  id: number;
  number: string;
}
export interface Location {
  number: string;
  case: string;
}
export interface ExceptionIds {
  specificIds: Array<SpecificId>;
  ruleId: number;
  numbers: Array<string>;
}

@Component({
  selector: 'app-declension',
  templateUrl: './declension.component.html'
})
export class DeclensionComponent implements OnInit {

  @Input()
  public category: Category;
  @Output()
  public exceptionEmitter: EventEmitter<Array<ExceptionIds>> = new EventEmitter<Array<ExceptionIds>>();

  public title: string;
  public unselect: string;

  public rows: Array<string>;
  public cols: Array<ColData>;
  public data: Array<RowData>;

  public exceptions: Array<Exception>;
  public appliedExceptions: Array<Exception>;

  constructor(
    public translate: TranslateService,
    private russianReferenceService: RussianReferenceService
  ) { }

  ngOnInit(): void {
    this.exceptions = [];
    this.rows = [Const.N, Const.A, Const.G, Const.D, Const.L, Const.I];
    this.cols = [
      { field: Const.c, header: '' }
    ];

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
                if (!this.exceptions.map((exception) => exception.rule).includes(rule.rule)) {
                  this.exceptions.push(
                    {
                      ruleId: 0,
                      specificIds: [{
                        id: rule.id,
                        number: ending.number
                      }],
                      rule: rule.rule,
                      locations: [{
                        number: ending.number,
                        case: russianCase
                      }],
                      applied: rule.applied
                    }
                  )
                } else {
                  const exceptionsFound = this.exceptions
                    .find((exception) =>
                      exception.rule === rule.rule
                    );
                  if (!exceptionsFound.specificIds.some((specificId) => specificId.id === rule.id)) {
                    exceptionsFound.specificIds.push({
                      id: rule.id,
                      number: ending.number
                    });
                  }
                  exceptionsFound.locations.push({
                    number: ending.number,
                    case: russianCase
                  });
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
          this.resetExceptions();
        }
      });
  }

  public isInit(exceptions: Array<Exception>): boolean {
    const exceptionsApplied = exceptions.filter((e) => e.applied);
    return exceptionsApplied.length === 0 || (exceptionsApplied.length === 1 && exceptionsApplied[0].ruleId === 6);
  }

  public resetExceptions(): void {
    this.exceptions.forEach((exception) => exception.applied = exception.ruleId === 6);
    this.setException();
    this.appliedExceptions = this.exceptions.filter((exception) => exception.applied);
    this.exceptionEmitter.emit(this.appliedExceptions.map((e) => {
      return {
        specificIds: e.specificIds,
        ruleId: e.ruleId,
        numbers: e.locations.map((l) => l.number)
      };
    }));
  }

  private setException(): void {
    const animateRule = this.exceptions.find((exception) => exception.ruleId === 7);
    const inAnimateRule = this.exceptions.find((exception) => exception.ruleId === 6);
    let accusativeHasBeenChanged: boolean = false;
    this.category.endings.forEach((ending) => {
      if (ending.nounEndings.length > 0) {
        ending.nounEndings.forEach((nounEnding) => {

          if (nounEnding.specificEndingRules.length > 0) {
            let isTwelveDone: boolean = false;
            nounEnding.specificEndingRules.forEach((specificEndingRule) => {

              if (nounEnding.russianCase !== Const.A || !accusativeHasBeenChanged || !isTwelveDone) {
                specificEndingRule.applied = this.exceptions.find((exception) =>
                  exception.rule === specificEndingRule.rule
                ).applied;
              }

              const twelve = this.exceptions.find((e) => e.ruleId === 12);
              if (nounEnding.russianCase === Const.G && ending.number === Const.P
                && !!twelve && twelve.applied && specificEndingRule.rule === twelve.rule) {
                nounEnding.specificEndingRules.filter((s) => s.id !== specificEndingRule.id)
                  .forEach((s) => s.applied = false);
                isTwelveDone = true;
              }

              if (!!animateRule && animateRule.applied && specificEndingRule.rule === animateRule.rule) {
                specificEndingRule.value = this.animateOrInanimate(Const.G, ending);
                specificEndingRule.applied = true;
                nounEnding.specificEndingRules.find((spec) => spec.rule === inAnimateRule.rule).applied = false;
                accusativeHasBeenChanged = true;
              }
              if (!!inAnimateRule && inAnimateRule.applied && specificEndingRule.rule === inAnimateRule.rule) {
                specificEndingRule.value = this.animateOrInanimate(Const.N, ending);
                specificEndingRule.applied = true;
                nounEnding.specificEndingRules.find((spec) => spec.rule === animateRule.rule).applied = false;
                accusativeHasBeenChanged = true;
              }
            });
          }
        });
      }
    });
    this.setData(this.rows, this.cols, this.category);
  }

  private animateOrInanimate(russianCase: string, ending: Ending): string {
    const genOrNom = ending.nounEndings.find((e) => e.russianCase === russianCase);
    genOrNom.specificEndingRules.forEach((a) => {
      const updatedRule = this.exceptions.find((e) => e.rule === a.rule);
      a.applied = !!updatedRule && updatedRule.applied;
    });
    const genOrNomSpecific = genOrNom.specificEndingRules.find((spec) => spec.applied);

    return !!genOrNomSpecific ? genOrNomSpecific.value : genOrNom.value;
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


  public applyException(id: number, value: boolean): void {
    this.findByRuleId(this.exceptions, id).applied = value;
    switch (id) {
      // if animate
      case 7: {
        this.findByRuleId(this.exceptions, 6).applied = !value;
        break;
      }
      // if мать and дочь
      case 9:
      // if подмасте́рье
      case 10: {
        if (!!this.findByRuleId(this.exceptions, 7)) {
          this.findByRuleId(this.exceptions, 7).applied = value;
        }
        if (!!this.findByRuleId(this.exceptions, 6)) {
          this.findByRuleId(this.exceptions, 6).applied = !value;
        }
        if (value) {
          for (let i = 1; i <= 12; i++) {
            if (!!this.findByRuleId(this.exceptions, i) && ![6, 7, id].includes(i)) {
              this.findByRuleId(this.exceptions, i).applied = false;
            }
          }
        }
        break;
      }
    }
    // if no specific rule and after a soft consonant, when stressed.
    const twelve = this.findByRuleId(this.exceptions, 12);
    if (!!twelve) {
      twelve.applied = this.findByRuleId(this.exceptions, 4).applied
        && this.findByRuleId(this.exceptions, 11).applied;
    }
    this.setException();
    this.appliedExceptions = this.exceptions.filter((exception) => exception.applied);
    this.exceptionEmitter.emit(this.appliedExceptions.map((e) => {
      return {
        specificIds: e.specificIds,
        ruleId: e.ruleId,
        numbers: e.locations.map((l) => l.number)
      };
    }));
  }

  public isCheckBoxDisabled(ruleId: number): boolean {
    return this.isRuleApplied(ruleId, 9) || this.isRuleApplied(ruleId, 10);
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
    return (declensionValue != '' || !!this.category.root) ? declensionValue : '/';
  }

  public number(exceptions: Array<Exception>): number {
    return exceptions.filter((e) => ![6, 7].includes(e.ruleId)).length;
  }

  public isAnimatePresent(exceptions: Array<Exception>): boolean {
    return exceptions.some((e) => e.ruleId === 7);
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
