import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AdjectiveCategory } from 'src/app/models/reference/russian/adjective-category.model';
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

@Component({
  selector: 'app-declension-category',
  templateUrl: './declension-category.component.html',
  styleUrls: ['./declension-category.component.scss']
})
export class DeclensionCategoryComponent implements OnInit {

  @Input()
  public adjectiveCategory: AdjectiveCategory;
  public russianCases: Array<string>;
  public russianGenders: Array<string>;

  constructor(
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.russianCases = [N, A, G, D, L, I];
    this.russianGenders = [M, F, NT, P];
  }

  public findDeclensionByCaseAndGender(russianCase: string, russianGender: string): string {
    return this.adjectiveCategory.endings
      .find((ending) => ending.russianCase === russianCase && ending.russianGender === russianGender)
      .value;
  }

  public printCase(russianCase: string): string {
    switch (russianCase) {
      case N : {
        return this.translate.instant('reference.case.nominative');
      }
      case A : {
        return this.translate.instant('reference.case.accusative');
      }
      case G : {
        return this.translate.instant('reference.case.genitive');
      }
      case D : {
        return this.translate.instant('reference.case.dative');
      }
      case L : {
        return this.translate.instant('reference.case.locative');
      }
      case I : {
        return this.translate.instant('reference.case.instrumental');
      }
    }
  }

  public printGender(russianGender: string): string {
    switch (russianGender) {
      case M : {
        return this.translate.instant('reference.gender.masculine');
      }
      case F : {
        return this.translate.instant('reference.gender.feminine');
      }
      case NT : {
        return this.translate.instant('reference.gender.neuter');
      }
      case P : {
        return this.translate.instant('reference.gender.plural');
      }
    }
  }

}
