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
import { Const } from 'src/app/services/utils/const';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { takeUntil } from 'rxjs/operators';
import { AdjectiveListService, RowData } from 'src/app/services/adjective-list.service';

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
  public translation: string;
  public selectedRow: RowData;
  public page: string;
  public action: string;

  constructor(
    private sideMenuService: SideMenuService,
    private actionMenuService: ActionMenuService,
    public translate: TranslateService,
    private adjectiveService: AdjectiveService,
    private russianReferenceService: RussianReferenceService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private adjectiveListService: AdjectiveListService
  ) {
    super();
  }

  ngOnInit(): void {
    // this.isAdjectiveDetail = this.activatedRoute.snapshot.params[Const.adjective];

    this.initMenus();

    // récupération des références
    this.russianReferenceService.adjectiveCategories$
      .subscribe((adjectiveCategories: Array<AdjectiveCategory>) => {
        this._adjectiveCategories = adjectiveCategories;
      });

    // setter de this.page au chargement de la page
    this.setPage(this.router.url);

    // update la langue à chaque changement
    this.translate.onLangChange.subscribe(() => {
      this.initMenus();
    });

    // emetter du service sideMenu (gauche)
    this.sideMenuService.selection$.pipe(
      takeUntil(
        this.destroyed$
      )
    ).subscribe((selection: string) => {
      if (selection) {
        if (selection === Const.intro) {
          this.redirect('/' + Const.adjectives);
        } else {
          this.redirect('/' + Const.adjectives + '/' + selection);
        }
      }
    });

    // emetter de adjective list
    this.adjectiveListService.rowData$.pipe(
      takeUntil(
        this.destroyed$
      )
    ).subscribe((selectedRow: RowData) => {
      this.selectedRow = selectedRow;
    });

    // emetter du service actionMenu (droite)
    this.actionMenuService.action$.pipe(
      takeUntil(
        this.destroyed$
      )
    ).subscribe((action: string) => {
      if (action) {
        this.action = action
        // mise à jour du menu de droite
        switch (action) {
          case Const.open: {
            const translation = this.selectedRow?.translation;
            this.actionMenuService.setMenu(translation, false);
            this.redirect('/adjectives/consult/' + translation);
            break;
          }
          case Const.close: {
            // déselection de la row
            this.adjectiveListService.setRowdata(null);
            // mise à jour du menu
            this.actionMenuService.setMenu('', true);
            this.redirect('/adjectives/consult');
            break;
          }
          case Const.delete: {
            this.redirect('/adjectives/consult');
            // this.menusInit();
            break;
          }
          case Const.update: {
            console.log(Const.update);
            this.redirect('/adjectives/consult');
            break;
          }
        }
      }
    });
  }

  private initMenus(): void {
    const category = this.activatedRoute.snapshot.params[Const.category];
    const adjective = this.activatedRoute.snapshot.params[Const.adjective];
    const declensionExpanded = category && ![Const.consult, Const.add].includes(category);
    const adjectiveExpanded = adjective || [Const.consult, Const.add].includes(category);

    // mise à jour du menu de gauche
    this.sideMenuService.setMenu(declensionExpanded, adjectiveExpanded);
    // mise à jour du menu de droite
    this.actionMenuService.setMenu(adjective, !adjective);
  }

  // redirection en modifiant la valeur de this.page
  private redirect(url: string): void {
    this.router.navigate([url]);
    this.setPage(url);
  }

  private resetServices(): void {
    this.actionMenuService.resetAction();
    this.adjectiveListService.setRowdata(null);
    this.sideMenuService.setSelection(null);
  }

  // rechercher un adjectif
  public searchAdjective(translation: string): void {
    if (/^[a-z]+$/.test(translation)) {
      this.resetServices();
      this.redirect('/adjectives/consult/' + translation);
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
        (ending.value != Const.NG) ? root + ending.value : this.nomOrGen(root, ending.russianGender, endings)
      )
    );
  }

  private nomOrGen(root: string, gender: string, endings: Array<AdjectiveEnding>): string {
    const filteredEndings = endings.filter((ending) =>
      ending.russianGender === gender
    );
    const nom = filteredEndings.find((filteredEnding) => filteredEnding.russianCase === Const.N).value;
    const gen = filteredEndings.find((filteredEnding) => filteredEnding.russianCase === Const.G).value;

    return root + nom + ' / ' + root + gen;
  }

  private setPage(url: string): void {
    const urlArray = url.split('/');
    // url = /adjectives
    if (urlArray.length === 2 && urlArray[1] === Const.adjectives) {
      this.page = 'intro';
    }
    // url = /adjectives/:category
    if (urlArray.length === 3) {
      if ([Const.first, Const.second, Const.third, Const.fourth, Const.consult, Const.add].includes(urlArray[2])) {
        this.page = urlArray[2];
      } else {
        // si la valeur de :category n'existe pas
        this.router.navigate([Const.NF]);
        this.page = Const.NF;
      }
    }
    // url = adjectives/consult/:adjective
    if (urlArray.length === 4) {
      const adjective = urlArray[3];
      this.adjectiveService.fetchAdjectiveByTranslation(adjective);
      this.adjectiveService.adjective$.subscribe(
        (adj: Adjective) => {
          if (adj.id) {
            this.page = 'check';
            const root = adj.root;
            this.adjectiveCategory = new AdjectiveCategory(
              adj.category.id,
              adj.category.value,
              this.mapEndings(root, adj.category.endings)
            );
            this.selectedRow = {
              adjective: adj.nominativeMasculineForm,
              translation: adj.translation,
              declension: adj.category.id,
              id: adj.id
            }
          } else {
            this.page = Const.NF;
          }
        }
      );
    }
  }

}
