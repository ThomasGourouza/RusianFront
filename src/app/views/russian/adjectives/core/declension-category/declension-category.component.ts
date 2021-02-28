import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AdjectiveCategory } from 'src/app/models/reference/russian/adjective-category.model';
import { Const } from 'src/app/services/utils/const';
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
    this.rows = [Const.N, Const.A, Const.G, Const.D, Const.L, Const.I];
    this.cols = [
      { field: Const.c, header: '' },
      { field: Const.m, header: Const.M },
      { field: Const.f, header: Const.F },
      { field: Const.n, header: Const.NT },
      { field: Const.p, header: Const.P }
    ];
    this.data = [
      { case: Const.N, masculine: "", feminine: "", neuter: "", plural: "" },
      { case: Const.A, masculine: "", feminine: "", neuter: "", plural: "" },
      { case: Const.G, masculine: "", feminine: "", neuter: "", plural: "" },
      { case: Const.D, masculine: "", feminine: "", neuter: "", plural: "" },
      { case: Const.L, masculine: "", feminine: "", neuter: "", plural: "" },
      { case: Const.I, masculine: "", feminine: "", neuter: "", plural: "" }
    ];
    this.rows.forEach((row) => {
      this.cols.forEach((col) => {
        if (col.field != Const.c) {
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

  public printGender(russianGender: string): string {
    switch (russianGender) {
      case Const.M: {
        return this.translate.instant('reference.gender.masculine');
      }
      case Const.F: {
        return this.translate.instant('reference.gender.feminine');
      }
      case Const.NT: {
        return this.translate.instant('reference.gender.neuter');
      }
      case Const.P: {
        return this.translate.instant('reference.gender.plural');
      }
      default: {
        return '';
      }
    }
  }

}
