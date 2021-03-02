import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Category } from '../nouns.component';
import { Const } from 'src/app/services/utils/const';
export interface RowData {
  case: string;
  singular: string;
  plural: string;
}
export interface ColData {
  field: string;
  header: string;
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

  constructor(
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    console.log(this.category);

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
    this.data = [
      { case: Const.N, singular: "", plural: "" },
      { case: Const.A, singular: "", plural: "" },
      { case: Const.G, singular: "", plural: "" },
      { case: Const.D, singular: "", plural: "" },
      { case: Const.L, singular: "", plural: "" },
      { case: Const.I, singular: "", plural: "" }
    ];
    this.rows.forEach((row) => {
      this.cols.forEach((col) => {
        if (col.field != Const.c) {
          this.data
            .find((rowData) => rowData.case === row)
          [col.field] = this.findDeclensionByCaseAndNumber(row, col.header);
        }
      });
    });
  }

  public click(): void {
    this.category.endings.forEach((ending) => {
      ending.nounEndings.filter((nounEnding) =>
        nounEnding.russianCase === 'Accusative' 
        && nounEnding.specificEndingRules.length > 0
      ).forEach((e) => {
        console.log(e.specificEndingRules.find((r) => r.applied).value);
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
    this.title = cat + ' - ' + gender + ' - ' + type;
  }

  private findDeclensionByCaseAndNumber(russianCase: string, number: string): string {
    return this.category?.endings
      ?.find((cat) => cat.number === number)
      .nounEndings.find((ending) => ending.russianCase === russianCase)
      .value;
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
