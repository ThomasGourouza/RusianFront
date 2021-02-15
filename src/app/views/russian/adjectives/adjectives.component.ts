import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Adjective } from 'src/app/models/adjective/get/adjective.model';
import { AdjectiveCategory } from 'src/app/models/reference/russian/adjective-category.model';
import { AdjectiveEnding } from 'src/app/models/reference/russian/adjective-ending.model';
import { AdjectiveService } from 'src/app/services/adjective.service';
import { RussianReferenceService } from 'src/app/services/russian-reference.service';
import { RowData } from './adjective-list/adjective-list.component';
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
export interface ActionMenu {
  show: boolean;
  rowData: RowData;
}
const ADJ = 'adjectives';
const NF = 'not-found'
const N = 'Nominative';
const G = 'Genitive';
const NG = 'N/G';
const M = 'Masculine';
const C = 'category';
const A = 'adjective';
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
// url: /adjectives
export class AdjectivesComponent implements OnInit {

  public masculineNominative: MN;
  public _adjectiveCategories: Array<AdjectiveCategory>;
  public adjectiveCategory: AdjectiveCategory;

  public page: PAGE;
  public actionMenu: ActionMenu;

  public translation: string;

  public openAdjDeclension: boolean;

  constructor(
    private adjectiveService: AdjectiveService,
    private russianReferenceService: RussianReferenceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.openAdjDeclension = false;
    this.actionMenuInit();
    this.page = {
      show: false,
      type: 0
    };
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

    const adjective = this.activatedRoute.snapshot.params[A];
    if (adjective) {
      this.adjectiveService.fetchAdjectiveByTranslation(adjective);
      this.adjectiveService.adjective$.subscribe(
        (adj: Adjective) => {
          if (adj.id) {
            const root = adj.root;
            this.adjectiveCategory = new AdjectiveCategory(
              adj.category.id,
              adj.category.value,
              this.mapEndings(root, adj.category.endings)
            );
            this.page.show = true;
            this.page.type = 5;
            this.actionMenu = {
              show: true,
              rowData: {
                adjective: adj.nominativeMasculineForm,
                translation: adj.translation,
                declension: adj.category.id,
                id: adj.id
              }
            };
            this.openAdjDeclension = true;
          } else {
            this.router.navigate(['/adjectives/not-found/' + adjective]);
          }
        }
      );
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

  public goTo(translation: string): void {
    if (translation) {
      this.router.navigate(['/adjectives/not-found/' + translation]);
    }
  }

  private actionMenuInit(): void {
    this.actionMenu = {
      show: false,
      rowData: null
    };
  }

  // side menu emitter
  public onOpenPage(p: PAGE): void {
    this.page = p;
    // if not consultation
    if (this.page.type !== 5) {
      this.actionMenuInit();
      this.openAdjDeclension = false;
    }
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

  // action menu emitter
  public onOpenActionMenu(actionMenu: ActionMenu): void {
    this.actionMenu = actionMenu;
    if (this.actionMenu.rowData != null) {
      this.adjectiveService.adjectiveList$.subscribe(
        (adjectives) => {
          const adjective = adjectives
            .find((adj) => adj.id === actionMenu.rowData.id);
          const root = adjective.root;
          this.adjectiveCategory = new AdjectiveCategory(
            adjective.category.id,
            adjective.category.value,
            this.mapEndings(root, adjective.category.endings)
          );
        }
      );
    }
  }

  public onOpenAdjDeclension(openAdjDeclension: boolean): void {
    this.openAdjDeclension = openAdjDeclension;
    if (!this.openAdjDeclension) {
      this.actionMenuInit();
      this.router.navigate(['/adjectives/consult']);
    } else {
      this.router.navigate(['/adjectives/consult/' + this.actionMenu.rowData.translation]);
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

  private mapEndings(root: string, endings: Array<AdjectiveEnding>): Array<AdjectiveEnding> {
    return endings.map((ending) =>
      new AdjectiveEnding(
        ending.russianCase,
        ending.russianGender,
        (ending.value != NG) ? root + ending.value : this.nomOrGen(root, ending.russianGender, endings)
      )
    );
  }

  private nomOrGen(root: string, gender: string, endings: Array<AdjectiveEnding>): string {
    const filteredEndings = endings.filter((ending) =>
      ending.russianGender === gender
    );
    const nom = filteredEndings.find((filteredEnding) => filteredEnding.russianCase === N).value;
    const gen = filteredEndings.find((filteredEnding) => filteredEnding.russianCase === G).value;

    return root + nom + ' / ' + root + gen;
  }

}
