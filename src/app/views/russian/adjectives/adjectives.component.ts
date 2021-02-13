import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdjectiveCategory } from 'src/app/models/reference/russian/adjective-category.model';
import { RussianReferenceService } from 'src/app/services/russian-reference.service';
export interface PAGE {
  show: boolean;
  type: number
}
export interface MN {
  first: string;
  second: string;
  third: string;
  fourth: string;
}
const ADJ = 'adjectives';
const NF = 'not-found'
const N = 'Nominative';
const M = 'Masculine';
const C = 'category';
const FIRST = 'first-declension';
const SECOND = 'second-declension';
const THIRD = 'third-declension';
const FOURTH = 'fourth-declension';
const CONSULT = 'consult';
const ADD = 'add';

@Component({
  selector: 'app-adjectives',
  templateUrl: './adjectives.component.html',
  styleUrls: ['./adjectives.component.scss']
})
export class AdjectivesComponent implements OnInit {

  public page: PAGE;
  public masculineNominative: MN;
  public _adjectiveCategories: Array<AdjectiveCategory>

  constructor(
    private russianReferenceService: RussianReferenceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.page = {
      show: false,
      type: 0
    }
    const category = this.activatedRoute.snapshot.params[C];
    if (category) {
      this.page.show = [FIRST, SECOND, THIRD, FOURTH, CONSULT, ADD].includes(category);
      switch (category) {
        case FIRST: {
          this.page.type = 1;
          break;
        }
        case SECOND: {
          this.page.type = 2;
          break;
        }
        case THIRD: {
          this.page.type = 3;
          break;
        }
        case FOURTH: {
          this.page.type = 4;
          break;
        }
        case CONSULT: {
          this.page.type = 5;
          break;
        }
        case ADD: {
          this.page.type = 6;
          break;
        }
        default: {
          this.router.navigate([NF]);
        }
      }
    }

    this.russianReferenceService.adjectiveCategories$
      .subscribe((adjectiveCategories: Array<AdjectiveCategory>) => {
        this._adjectiveCategories = adjectiveCategories;
        if (this._adjectiveCategories && this._adjectiveCategories.length > 0) {
          this.masculineNominative = {
            first: ' (-' + this.getMasculineNominative(this.getAdjectiveCategory(1)) + ')',
            second: ' (-' + this.getMasculineNominative(this.getAdjectiveCategory(2)) + ')',
            third: ' (-' + this.getMasculineNominative(this.getAdjectiveCategory(3)) + ')',
            fourth: ' (-н' + this.getMasculineNominative(this.getAdjectiveCategory(4)) + ')',
          }
        }
      });
  }

  public onOpenPage(p: PAGE): void {
    this.page = p;
    if (!this.page.show) {
      this.router.navigate([ADJ]);
    } else {
      switch (this.page.type) {
        case 1: {
          this.router.navigate([ADJ + '/' + FIRST]);
          break;
        }
        case 2: {
          this.router.navigate([ADJ + '/' + SECOND]);
          break;
        }
        case 3: {
          this.router.navigate([ADJ + '/' + THIRD]);
          break;
        }
        case 4: {
          this.router.navigate([ADJ + '/' + FOURTH]);
          break;
        }
        case 5: {
          this.router.navigate([ADJ + '/' + CONSULT]);
          break;
        }
        case 6: {
          this.router.navigate([ADJ + '/' + ADD]);
          break;
        }
      }
    }
  }

  public getAdjectiveCategory(id: number): AdjectiveCategory {
    return this._adjectiveCategories.find((category) => category.id === id);
  }

  public getMasculineNominative(category: AdjectiveCategory): string {
    return category.endings
      .find((ending) => ending.russianCase === N && ending.russianGender === M)
      .value;
  }

}
