import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Adjective } from 'src/app/models/adjective/get/adjective.model';
import { AdjectiveCategory } from 'src/app/models/reference/russian/adjective-category.model';
import { AdjectiveEnding } from 'src/app/models/reference/russian/adjective-ending.model';
import { AdjectiveService } from 'src/app/services/adjective.service';
import { RussianReferenceService } from 'src/app/services/russian-reference.service';
import { SideMenuAdjectivesService } from 'src/app/services/side-menu-adjectives.service';
import { ActionMenuService } from 'src/app/services/action-menu.service';
import { Const } from 'src/app/services/utils/const';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { takeUntil } from 'rxjs/operators';
import { AdjectiveListService, RowData } from 'src/app/services/adjective-list.service';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-adjectives',
  templateUrl: './adjectives.component.html'
})
/**
 * urls:
 * /adjectives
 * /adjectives/:category
 * /adjectives/consult/:adjective
 * /adjectives/add/:adjective
 * /adjectives/update/:adjective
 */
export class AdjectivesComponent extends subscribedContainerMixin() implements OnInit {

  public _adjectiveCategories: Array<AdjectiveCategory>;
  public adjectiveCategory: AdjectiveCategory;
  public selectedRow: RowData;
  public page: string;

  constructor(
    private sideMenuService: SideMenuAdjectivesService,
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
    this.initMenus();
    this.resetServices();

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
      if (!!selection) {
        if (selection === Const.intro) {
          this.resetServices();
          this.redirect('/' + Const.adjectives);
        } else {
          this.redirect('/' + Const.adjectives + '/' + selection);
        }
      }
    });

    // emetter de adjective list (milieu)
    this.adjectiveListService.rowData$.pipe(
      takeUntil(
        this.destroyed$
      )
    ).subscribe((selectedRow: RowData) => {
      this.selectedRow = selectedRow;
      if (!!selectedRow) {
        // mise à jour du menu de droite
        this.actionMenuService.setMenu(selectedRow.translation, true, Const.check, true);
      }
    });

    // emetter du service actionMenu (droite)
    this.actionMenuService.action$.pipe(
      takeUntil(
        this.destroyed$
      )
    ).subscribe((action: string) => {
      if (action) {
        // mise à jour du menu de droite
        switch (action) {
          case Const.open: {
            const translation = this.selectedRow?.translation;
            if (!!translation) {
              this.actionMenuService.setMenu(translation, false, Const.check, true);
              this.redirect('/adjectives/consult/' + translation);
            }
            break;
          }
          case Const.close: {
            // déselection de la row
            this.closeDisplayAdjectiveAndGoTo('/adjectives/consult');
            break;
          }
          case Const.delete: {
            const adjectiveId = this.selectedRow?.id;
            if (!!adjectiveId) {
              this.adjectiveService.deleteAdjectiveById(adjectiveId);
              this.resetServices();
              this.closeDisplayAdjectiveAndGoTo('/adjectives/consult');
            }
            break;
          }
          case Const.update: {
            const adjective = this.selectedRow?.translation;
            if (!!adjective) {
              this.resetServices();
              this.closeDisplayAdjectiveAndGoTo('/adjectives/update/' + adjective);
            }
            break;
          }
          case Const.create: {
            const adjective = this.activatedRoute.snapshot.params[Const.adjective];
            if (!!adjective) {
              this.resetServices();
              this.closeDisplayAdjectiveAndGoTo('/adjectives/add/' + adjective);
            }
            break;
          }
        }
      }
    });
  }

  clear(table: Table) {
    table.clear();
  }

  private closeDisplayAdjectiveAndGoTo(url: string): void {
    // déselection de la row
    this.adjectiveListService.setRowdata(null);
    // mise à jour du menu
    this.actionMenuService.setMenu('', true, Const.check, true);
    this.redirect(url);
  }

  private initMenus(): void {
    const category = this.activatedRoute.snapshot.params[Const.category];
    const adjective = this.activatedRoute.snapshot.params[Const.adjective];
    const declensionExpanded = category && ![Const.consult, Const.add].includes(category);
    const adjectiveExpanded = adjective || [Const.consult, Const.add].includes(category);

    // mise à jour du menu de gauche
    this.sideMenuService.setMenu(declensionExpanded, adjectiveExpanded);
    // mise à jour du menu de droite
    this.actionMenuService.setMenu(adjective, !adjective, this.page, true);
  }

  // redirection en modifiant la valeur de this.page
  private redirect(url: string): void {
    this.setPage(url);
    this.router.navigateByUrl(url);
  }

  private resetServices(): void {
    this.actionMenuService.resetAction();
    this.adjectiveListService.setRowdata(null);
    this.sideMenuService.setSelection(null);
  }

  public displayActionMenu(): boolean {
    return (this.page === Const.consult && !!this.selectedRow)
      || this.page === Const.check
      || this.page === Const.update
      || this.page === Const.NF;
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
    this.selectedRow = null;
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
        this.router.navigateByUrl('/' + Const.NF);
        this.page = Const.NF;
      }
    }
    // url = adjectives/consult/:adjective
    // url = adjectives/add/:adjective
    // url = adjectives/update/:adjective
    if (urlArray.length === 4) {
      const category = urlArray[2];
      const adjective = urlArray[3];
      this.adjectiveService.clearAdjective();
      this.adjectiveService.fetchAdjectiveByTranslation(adjective);
      this.adjectiveService.adjective$.subscribe(
        (adj: Adjective) => {
          switch (category) {
            case Const.consult: {
              if (adj.id) {
                this.caseConsultAdjective(adjective, adj);
              } else {
                this.resetServices();
                this.actionMenuService.setMenu(adjective, false, Const.create, true);
                this.page = Const.NF;
              }
              break;
            }
            case Const.update: {
              if (adj.id) {
                this.resetServices();
                this.actionMenuService.setMenu(adjective, false, Const.update, true);
                this.page = Const.update;
              } else {
                this.resetServices();
                this.actionMenuService.setMenu(adjective, false, Const.create, true);
                this.page = Const.NF;
              }
              break;
            }
            case Const.add: {
              if (adj.id) {
                this.router.navigateByUrl('/adjectives/consult/' + adj.translation);
                this.caseConsultAdjective(adjective, adj);
              } else {
                this.resetServices();
                this.page = Const.add;
              }
              break;
            }
          }
        });
    }
  }

  private caseConsultAdjective(adjective: string, adj: Adjective): void {
    this.actionMenuService.setMenu(adjective, false, Const.check, true);
    this.page = Const.check;
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
  }

}
