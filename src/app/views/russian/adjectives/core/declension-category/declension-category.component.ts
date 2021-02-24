import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AdjectiveCategory } from 'src/app/models/reference/russian/adjective-category.model';
export interface RowData {
  case: string;
  masculine: string;
  feminine: string;
  neuter: string;
  plural: string;
}
export interface ColData {
  field: string;
  header: string;
}
const N = 'Nominative';
const A = 'Accusative';
const G = 'Genitive';
const D = 'Dative';
const L = 'Locative';
const I = 'Instrumental';
const M = 'Masculine';
const F = 'Feminine';
const NT = 'Neutral';
const P = 'Plural';
const c = 'case';
const m = 'masculine';
const f = 'feminine';
const n = 'neuter';
const p = 'plural';

@Component({
  selector: 'app-declension-category',
  templateUrl: './declension-category.component.html',
  styleUrls: ['./declension-category.component.scss']
})
// url: adjectives/:category or adjectives/consult/:adjective
export class DeclensionCategoryComponent implements OnInit {

  @Input()
  public adjectiveCategory: AdjectiveCategory;

  public title: string;
  public rows: Array<string>;
  public cols: Array<ColData>;
  public data: Array<RowData>;

  constructor(
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    switch (this.adjectiveCategory.id) {
      case 1: {
        this.title = 'first';
        break;
      }
      case 2: {
        this.title = 'second';
        break;
      }
      case 3: {
        this.title = 'third';
        break;
      }
      case 4: {
        this.title = 'fourth';
        break;
      }
    }
    this.rows = [N, A, G, D, L, I];
    this.cols = [
      { field: c, header: '' },
      { field: m, header: M },
      { field: f, header: F },
      { field: n, header: NT },
      { field: p, header: P }
    ];
    this.data = [
      { case: N, masculine: "", feminine: "", neuter: "", plural: "" },
      { case: A, masculine: "", feminine: "", neuter: "", plural: "" },
      { case: G, masculine: "", feminine: "", neuter: "", plural: "" },
      { case: D, masculine: "", feminine: "", neuter: "", plural: "" },
      { case: L, masculine: "", feminine: "", neuter: "", plural: "" },
      { case: I, masculine: "", feminine: "", neuter: "", plural: "" }
    ];
    this.rows.forEach((row) => {
      this.cols.forEach((col) => {
        if (col.field != c) {
          this.data
            .find((rowData) => rowData.case === row)
            [col.field] = this.findDeclensionByCaseAndGender(row, col.header);
        }
      });
    });
  }

  private findDeclensionByCaseAndGender(russianCase: string, russianGender: string): string {
    return this.adjectiveCategory?.endings
      .find((ending) => ending.russianCase === russianCase && ending.russianGender === russianGender)
      .value;
  }

  public printCase(russianCase: string): string {
    switch (russianCase) {
      case N: {
        return this.translate.instant('reference.case.nominative');
      }
      case A: {
        return this.translate.instant('reference.case.accusative');
      }
      case G: {
        return this.translate.instant('reference.case.genitive');
      }
      case D: {
        return this.translate.instant('reference.case.dative');
      }
      case L: {
        return this.translate.instant('reference.case.locative');
      }
      case I: {
        return this.translate.instant('reference.case.instrumental');
      }
      default: {
        return russianCase;
      }
    }
  }

  public printGender(russianGender: string): string {
    switch (russianGender) {
      case M: {
        return this.translate.instant('reference.gender.masculine');
      }
      case F: {
        return this.translate.instant('reference.gender.feminine');
      }
      case NT: {
        return this.translate.instant('reference.gender.neuter');
      }
      case P: {
        return this.translate.instant('reference.gender.plural');
      }
      default: {
        return '';
      }
    }
  }

}
