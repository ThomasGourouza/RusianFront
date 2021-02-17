import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Adjective } from 'src/app/models/adjective/get/adjective.model';
import { AdjectiveCategory } from 'src/app/models/reference/russian/adjective-category.model';
import { AdjectiveEnding } from 'src/app/models/reference/russian/adjective-ending.model';
import { AdjectiveService } from 'src/app/services/adjective.service';
import { RussianReferenceService } from 'src/app/services/russian-reference.service';
import { SideMenuService } from 'src/app/services/side-menu.service';
import { ActionMenuService } from 'src/app/services/action-menu.service';
import { Action } from './action-menu/action-menu.component';
import { RowData } from './core/adjective-list/adjective-list.component';
import { Const } from 'src/app/services/utils/const';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { takeUntil } from 'rxjs/operators';
export interface SideMenu {
  show: boolean;
  type: number
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
const o = 'open';
const d = 'delete';
const u = 'update';

@Component({
  selector: 'app-adjectives',
  templateUrl: './adjectives.component.html',
  styleUrls: ['./adjectives.component.scss']
})
/**
 * urls:
 * /adjectives
 * /adjectives/:category
 * /adjectives/consult/:adjective
 * /adjectives/not-found/:adjective
 */
export class AdjectivesComponent extends subscribedContainerMixin() implements OnInit {

  public _adjectiveCategories: Array<AdjectiveCategory>;
  public adjectiveCategory: AdjectiveCategory;

  public sideMenu: SideMenu;
  public actionMenu: ActionMenu;

  public translation: string;


  public selectedRow: RowData;

  constructor(
    private sideMenuService: SideMenuService,
    private actionMenuService: ActionMenuService,
    public translate: TranslateService,
    private adjectiveService: AdjectiveService,
    private russianReferenceService: RussianReferenceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit(): void {

    // this.isAdjectiveDetail = this.activatedRoute.snapshot.params[A];

    // update la langue à chaque changement
    this.translate.onLangChange.subscribe(() => {
      const declensionExpanded = this.activatedRoute.snapshot.params[Const.C]
        && ![Const.CSLT, Const.ADD].includes(this.activatedRoute.snapshot.params[Const.C]);
      const adjectiveExpanded = this.activatedRoute.snapshot.params[Const.A]
        || [Const.CSLT, Const.ADD].includes(this.activatedRoute.snapshot.params[Const.C]);

      // mise à jour du menu de gauche
      this.sideMenuService.setMenu(declensionExpanded, adjectiveExpanded);

      // mise à jour du menu de droite
      this.actionMenuService.setMenu(this.activatedRoute.snapshot.params[A], !this.activatedRoute.snapshot.params[A]);
    });

    // emetter du service actionMenu
    this.actionMenuService.action$.pipe(
      takeUntil(
        this.destroyed$
      )
    ).subscribe((action: string) => {
      if (action) {
        // mise à jour du menu de droite
        this.actionMenuService.setMenu(this.activatedRoute.snapshot.params[A], action !== 'open');
        console.log(this.selectedRow);
        switch (action) {
          case o: {
            this.sideMenu = {
              show: true,
              type: 6
            }
            // if (this.selectedRow) {
            //   this.router.navigate(['/adjectives/consult/' + this.selectedRow.translation]);
            // }
            break;
          }
          case 'close': {
            this.sideMenu = {
              show: true,
              type: 5
            }
            this.router.navigate(['/adjectives/consult']);
            break;
          }
          case d: {
            this.router.navigate(['/adjectives/consult']);
            // if (this.selectedRow) {
            //   this.adjectiveService.deleteAdjectiveById(this.selectedRow.id);
            // }
            this.menusInit();
            break;
          }
          case u: {
            console.log(u);
            break;
          }
        }
      }
    }
    );

    // récupération des références
    this.russianReferenceService.adjectiveCategories$
      .subscribe((adjectiveCategories: Array<AdjectiveCategory>) => {
        this._adjectiveCategories = adjectiveCategories;
      });


    this.menusInit();


    // À modifier
    const url = this.router.url;
    const urlArray = url.split('/');

    if (urlArray.length === 3) {
      switch (urlArray[2]) {
        case FIRST: {
          this.sideMenu = {
            show: true,
            type: 1
          }
          break;
        }
        case SECOND: {
          this.sideMenu = {
            show: true,
            type: 2
          }
          break;
        }
        case THIRD: {
          this.sideMenu = {
            show: true,
            type: 3
          }
          break;
        }
        case FOURTH: {
          this.sideMenu = {
            show: true,
            type: 4
          }
          break;
        }
        case CONSULT: {
          this.sideMenu = {
            show: true,
            type: 5
          }
          break;
        }
        case ADD: {
          this.sideMenu = {
            show: true,
            type: 8
          }
          break;
        }
        default: {
          this.router.navigate([NF]);
          break;
        }
      }
    }
    if (urlArray.length === 4) {
      const adjective = urlArray[3];
      console.log(adjective);
      if ([CONSULT, NF].includes(urlArray[2])) {
        this.adjectiveService.fetchAdjectiveByTranslation(adjective);
        this.adjectiveService.adjective$.subscribe(
          (adj: Adjective) => {
            if (adj.id) {
              this.router.navigate(['/adjectives/consult/' + adjective]);
              const root = adj.root;
              this.adjectiveCategory = new AdjectiveCategory(
                adj.category.id,
                adj.category.value,
                this.mapEndings(root, adj.category.endings)
              );
              this.sideMenu = {
                show: true,
                type: 6
              }
              this.actionMenu = {
                show: true,
                rowData: {
                  adjective: adj.nominativeMasculineForm,
                  translation: adj.translation,
                  declension: adj.category.id,
                  id: adj.id
                }
              };
            } else {
              this.router.navigate(['/adjectives/not-found/' + adjective]);
              this.sideMenu = {
                show: true,
                type: 7
              }
              this.actionMenu = {
                show: true,
                rowData: {
                  adjective: 'adj',
                  translation: 'translation',
                  declension: 1,
                  id: 1
                }
              };
            }
          }
        );
      }
    }

  }

  public goTo(translation: string): void {
    if (translation) {
      this.router.navigate(['/adjectives/consult/' + translation]);
    }
  }

  public areEndingsNotEmpty(): boolean {
    return this._adjectiveCategories && this._adjectiveCategories.length > 0;
  }

  private menusInit(): void {
    this.actionMenu = {
      show: false,
      rowData: null
    };
    this.sideMenu = {
      show: false,
      type: 0
    };
  }

  // side menu emitter
  public onSideMenuEmitter(p: SideMenu): void {
    this.sideMenu = p;
    // if not consultation
    // if (this.sideMenu.type !== 5) {
    //   this.menusInit();
    //   // this.openAdjDeclension = false;
    // }
    if (!this.sideMenu.show) {
      this.router.navigate([ADJ]);
    } else {
      switch (this.sideMenu.type) {
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
        case 8: {
          this.router.navigate([ADJ + '/' + ADD]);
          break;
        }
      }
    }
  }

  // open and close action menu emitter
  public onOpenActionMenu(actionMenu: ActionMenu): void {
    this.selectedRow = actionMenu.rowData;
    this.actionMenu = actionMenu;
    if (this.actionMenu.rowData != null) {
      this.adjectiveService.adjectiveList$.subscribe(
        (adjectives) => {
          const adjective = adjectives
            .find((adj) => adj.id === actionMenu.rowData.id);
          if (adjective) {
            const root = adjective.root;
            this.adjectiveCategory = new AdjectiveCategory(
              adjective.category.id,
              adjective.category.value,
              this.mapEndings(root, adjective.category.endings)
            );
          }
        }
      );
    }
  }

  // receive the action from the action menu -------------- delete -------------- 
  public onActionEmitter(action: Action): void {
    switch (action.name) {
      case o: {
        // this.openAdjDeclension = action.value;
        this.sideMenu = {
          show: true,
          type: action.value ? 6 : 5
        }
        // if (!this.openAdjDeclension) {
        if (this.sideMenu.type === 6) {
          this.router.navigate(['/adjectives/consult/' + this.actionMenu.rowData.translation]);
        } else {
          this.router.navigate(['/adjectives/consult']);
        }
        break;
      }
      case d: {
        if (action.value) {
          this.router.navigate(['/adjectives/consult']);
          // this.openAdjDeclension = false;
          this.adjectiveService.deleteAdjectiveById(this.actionMenu.rowData.id);
          this.menusInit();
        }
        break;
      }
      case u: {
        if (action.value) {
          console.log(u);
        }
        break;
      }
    }
  }

  public getAdjectiveCategory(id: number): AdjectiveCategory {
    return this._adjectiveCategories.find((category) => category.id === id);
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
