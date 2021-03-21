import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { Const } from 'src/app/services/utils/const';
import { ActivatedRoute, Router } from '@angular/router';
import { NounCategoryIds, SideMenuNounsService } from 'src/app/services/side-menu-nouns.service';
import { TranslateService } from '@ngx-translate/core';
import { NounCategory } from 'src/app/models/reference/russian/noun-category.model';
import { ActionMenuService } from 'src/app/services/action-menu.service';
import { NounService } from 'src/app/services/noun.service';
import { RussianReferenceService } from 'src/app/services/russian-reference.service';
import { Table } from 'primeng/table';
import { NounEnding } from 'src/app/models/reference/russian/noun-ending.model';
import { Noun } from 'src/app/models/noun/get/noun.model';
import { NounListService, RowData } from 'src/app/services/noun-list.service';

export interface Category {
  id: number;
  idSingularPlural?: number;
  root?: string;
  declension: string;
  gender: string;
  type: string;
  endings: Array<Ending>;
}
export interface Ending {
  number: string;
  nounEndings: Array<NounEnding>;
}

@Component({
  selector: 'app-nouns',
  templateUrl: './nouns.component.html',
  styleUrls: ['./nouns.component.scss']
})
/**
 * urls:
 * /nouns
 * /nouns/:category/:gender/:type
 * /nouns/consult/:noun
 * /nouns/add/:noun
 */
export class NounsComponent extends subscribedContainerMixin() implements OnInit {

  public _nounCategories: Array<NounCategory>;

  public category: Category;
  public declensionIds: Array<number>;

  public selectedRow: RowData;
  public page: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    private sideMenuService: SideMenuNounsService,
    private actionMenuService: ActionMenuService,
    private nounService: NounService,
    private russianReferenceService: RussianReferenceService,
    private nounListService: NounListService
  ) {
    super();
  }

  ngOnInit(): void {
    this.declensionIds = [];
    for (let i = 1; i <= 15; i++) {
      this.declensionIds.push(i);
    }
    this.initMenus();
    this.resetServices();

    // update la langue à chaque changement
    this.translate.onLangChange.subscribe(() => {
      this.initMenus();
    });

    // récupération des références
    this.russianReferenceService.nounCategoriesInanimate$
      .subscribe((nounCategories: Array<NounCategory>) => {
        this._nounCategories = nounCategories;
        // setter de this.page au chargement de la page
        this.setPage(this.router.url);
      });

    // emetter du service sideMenu (gauche)
    this.sideMenuService.selection$.pipe(
      takeUntil(
        this.destroyed$
      )
    ).subscribe((selection: NounCategoryIds) => {
      if (!!selection) {
        switch (selection.name) {
          case 'declension': {
            this.category = this.mapCategory(selection);
            this.redirect(this.mapCategoryToUrl(this.category));
            break;
          }
          case 'intro': {
            this.resetServices();
            this.redirect('/' + Const.nouns);
            break;
          }
          case Const.consult:
          case Const.add: {
            this.resetServices();
            this.redirect('/' + Const.nouns + '/' + selection.name);
            break;
          }
        }
      }
    });

    // emetter de noun list (milieu)
    this.nounListService.rowData$.pipe(
      takeUntil(
        this.destroyed$
      )
    ).subscribe((selectedRow: RowData) => {
      this.selectedRow = selectedRow;
      if (selectedRow) {
        // mise à jour du menu de droite
        this.actionMenuService.setMenu(selectedRow.translation, true, Const.check, false);
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
            if (translation) {
              this.actionMenuService.setMenu(translation, false, Const.check, false);
              this.redirect('/nouns/consult/' + translation);
            }
            break;
          }
          case Const.close: {
            // déselection de la row
            this.closeDisplayNounAndGoTo('/nouns/consult');
            break;
          }
          case Const.delete: {
            const nounId = this.selectedRow?.id;
            if (nounId) {
              this.nounService.deleteNounById(nounId);
              this.resetServices();
              this.closeDisplayNounAndGoTo('/nouns/consult');
            }
            break;
          }
          case Const.create: {
            const noun = this.activatedRoute.snapshot.params[Const.noun];
            if (noun) {
              this.resetServices();
              this.closeDisplayNounAndGoTo('/nouns/add/' + noun);
            }
            break;
          }
        }
      }
    });
  }

  private mapCategory(selection: NounCategoryIds): Category {
    const categories = this._nounCategories.filter(
      (c) => c.id === selection.singular || c.id === selection.plural
    );
    if (categories.length === 2) {
      const category: Category = {
        id: 0,
        declension: '',
        gender: '',
        type: '',
        endings: []
      }
      category.id = selection.id;
      category.declension = categories[0].russianDeclensionName;
      category.gender = categories[0].russianGender;
      category.type = categories[0].russianDeclCatType;
      const singularEndings = categories.find((cat) => cat.russianGrammaticalNumber === Const.S).russianNounEndings;
      const pluralEndings = categories.find((cat) => cat.russianGrammaticalNumber === Const.P).russianNounEndings;
      category.endings = [
        {
          number: Const.S,
          nounEndings: singularEndings
        },
        {
          number: Const.P,
          nounEndings: pluralEndings
        }
      ]
      return category;
    } else {
      return null;
    }
  }

  private mapCategoryToUrl(category: Category): string {
    let cat: string;
    let gender: string;
    let type: string;
    switch (category.declension) {
      case Const.FIRST: {
        cat = Const.first;
        break;
      }
      case Const.SECOND: {
        cat = Const.second;
        break;
      }
      case Const.THIRD: {
        cat = Const.third;
        break;
      }
      default: {
        break;
      }
    }
    switch (category.gender) {
      case Const.M: {
        gender = Const.m;
        break;
      }
      case Const.F: {
        gender = Const.f;
        break;
      }
      case Const.NT: {
        gender = Const.n;
        break;
      }
      default: {
        break;
      }
    }
    switch (category.type) {
      case Const.FT: {
        type = Const.one;
        break;
      }
      case Const.ST: {
        type = Const.two;
        break;
      }
      case Const.TT: {
        type = Const.three;
        break;
      }
      default: {
        break;
      }
    }
    return '/nouns/' + cat + '/' + gender + '/' + type;
  }

  private selectionFromUrl(category: string, gender: string, type: string): NounCategoryIds {
    const selection: NounCategoryIds = {
      id: 0,
      name: 'declension',
      singular: 0,
      plural: 0
    };
    switch (category) {
      case Const.first: {
        switch (gender) {
          case Const.m: {
            switch (type) {
              case Const.one: {
                selection.id = 1;
                selection.singular = 1;
                selection.plural = 4;
                break;
              }
              case Const.two: {
                selection.id = 2;
                selection.singular = 2;
                selection.plural = 5;
                break;
              }
              case Const.three: {
                selection.id = 3;
                selection.singular = 3;
                selection.plural = 6;
                break;
              }
              default: {
                this.router.navigateByUrl('/' + Const.NF);
                break;
              }
            }
            break;
          }
          case Const.f: {
            switch (type) {
              case Const.one: {
                selection.id = 4;
                selection.singular = 7;
                selection.plural = 10;
                break;
              }
              case Const.two: {
                selection.id = 5;
                selection.singular = 8;
                selection.plural = 11;
                break;
              }
              case Const.three: {
                selection.id = 6;
                selection.singular = 9;
                selection.plural = 12;
                break;
              }
              default: {
                this.router.navigateByUrl('/' + Const.NF);
                break;
              }
            }
            break;
          }
          default: {
            this.router.navigateByUrl('/' + Const.NF);
            break;
          }
        }
        break;
      }
      case Const.second: {
        switch (gender) {
          case Const.m: {
            switch (type) {
              case Const.one: {
                selection.id = 7;
                selection.singular = 13;
                selection.plural = 16;
                break;
              }
              case Const.two: {
                selection.id = 8;
                selection.singular = 14;
                selection.plural = 17;
                break;
              }
              case Const.three: {
                selection.id = 9;
                selection.singular = 15;
                selection.plural = 18;
                break;
              }
              default: {
                this.router.navigateByUrl('/' + Const.NF);
                break;
              }
            }
            break;
          }
          case Const.n: {
            switch (type) {
              case Const.one: {
                selection.id = 10;
                selection.singular = 19;
                selection.plural = 21;
                break;
              }
              case Const.two: {
                selection.id = 11;
                selection.singular = 20;
                selection.plural = 22;
                break;
              }
              default: {
                this.router.navigateByUrl('/' + Const.NF);
                break;
              }
            }
            break;
          }
          default: {
            this.router.navigateByUrl('/' + Const.NF);
            break;
          }
        }
        break;
      }
      case Const.third: {
        switch (gender) {
          case Const.m: {
            if (type === Const.one) {
              selection.id = 12;
              selection.singular = 23;
              selection.plural = 24;
            } else {
              this.router.navigateByUrl('/' + Const.NF);
            }
            break;
          }
          case Const.f: {
            if (type === Const.one) {
              selection.id = 13;
              selection.singular = 25;
              selection.plural = 26;
            } else {
              this.router.navigateByUrl('/' + Const.NF);
            }
            break;
          }
          case Const.n: {
            switch (type) {
              case Const.one: {
                selection.id = 14;
                selection.singular = 27;
                selection.plural = 29;
                break;
              }
              case Const.two: {
                selection.id = 15;
                selection.singular = 28;
                selection.plural = 30;
                break;
              }
              default: {
                this.router.navigateByUrl('/' + Const.NF);
                break;
              }
            }
            break;
          }
          default: {
            this.router.navigateByUrl('/' + Const.NF);
            break;
          }
        }
        break;
      }
      default: {
        this.router.navigateByUrl('/' + Const.NF);
        break;
      }
    }
    return selection;
  }

  private initMenus(): void {
    const category: string = this.activatedRoute.snapshot.params[Const.category];
    const gender: string = this.activatedRoute.snapshot.params[Const.gender];
    const type: string = this.activatedRoute.snapshot.params[Const.type];
    const noun: string = this.activatedRoute.snapshot.params[Const.noun];
    const nounExpanded = !!noun || [Const.consult, Const.add].includes(category);

    // mise à jour du menu de gauche
    this.sideMenuService.setMenu(category, gender, type, nounExpanded);
    // mise à jour du menu de droite
    this.actionMenuService.setMenu(noun, !noun, this.page, false);
  }

  // redirection en modifiant la valeur de this.page
  private redirect(url: string): void {
    this.setPage(url);
    this.router.navigateByUrl(url);
  }

  private resetServices(): void {
    this.actionMenuService.resetAction();
    this.nounListService.setRowdata(null);
    this.sideMenuService.setSelection(null);
  }

  clear(table: Table) {
    table.clear();
  }

  private closeDisplayNounAndGoTo(url: string): void {
    // déselection de la row
    this.nounListService.setRowdata(null);
    // mise à jour du menu
    this.actionMenuService.setMenu('', true, Const.check, false);
    this.redirect(url);
  }

  public displayActionMenu(): boolean {
    return (this.page === Const.consult && !!this.selectedRow)
      || this.page === Const.check
      || this.page === Const.NF;
  }

  public getNounCategory(id: number): NounCategory {
    return this._nounCategories.find((category) => category.id === id);
  }

  private setPage(url: string): void {
    this.selectedRow = null;
    const urlArray = url.split('/');
    // url = /nouns
    if (urlArray.length === 2 && urlArray[1] === Const.nouns) {
      this.page = 'intro';
    }
    // url = /nouns/:category
    if (urlArray.length === 3) {
      if ([Const.first, Const.second, Const.third, Const.fourth, Const.consult, Const.add].includes(urlArray[2])) {
        this.page = urlArray[2];
      } else {
        // si la valeur de :category n'existe pas
        this.router.navigateByUrl('/' + Const.NF);
        this.page = Const.NF;
      }
    }
    // url = nouns/consult/:noun
    // url = nouns/add/:noun
    if (urlArray.length === 4) {
      const category = urlArray[2];
      const noun = urlArray[3];
      this.nounService.clearNoun();
      this.nounService.fetchNounByTranslation(noun);
      this.nounService.noun$.subscribe((n: Noun) => {
        switch (category) {
          case Const.consult: {
            if (!!n.id) {
              this.caseConsultNoun(noun, n);
            } else {
              this.resetServices();
              this.actionMenuService.setMenu(noun, false, Const.create, false);
              this.page = Const.NF;
            }
            break;
          }
          case Const.add: {
            if (n.id) {
              this.router.navigateByUrl('/nouns/consult/' + n.translation);
              this.caseConsultNoun(noun, n);
            } else {
              this.resetServices();
              this.page = Const.add;
            }
            break;
          }
        }
      });
    }
    // url = nouns/:category/:gender/:type
    if (urlArray.length === 5) {
      if ([Const.first, Const.second, Const.third].includes(urlArray[2])
        && [Const.m, Const.f, Const.n].includes(urlArray[3])
        && [Const.one, Const.two, Const.three].includes(urlArray[4])) {
        const selection = this.selectionFromUrl(urlArray[2], urlArray[3], urlArray[4]);
        this.category = this.mapCategory(selection);
        this.page = 'declension';
      } else {
        // si les valeurs de l'url sont incorrectes
        this.router.navigateByUrl('/' + Const.NF);
        this.page = Const.NF;
      }
    }
  }

  private caseConsultNoun(noun: string, n: Noun): void {
    this.actionMenuService.setMenu(noun, false, Const.check, false);
    this.page = Const.check;
    this.category = {
      id: n.russianNounCategory.id,
      idSingularPlural: n.singularPluralCoupleNounId,
      root: n.root,
      declension: n.russianNounCategory.russianDeclensionName,
      gender: n.russianNounCategory.russianGender,
      type: n.russianNounCategory.russianDeclCatType,
      endings: [{
        number: n.russianNounCategory.russianGrammaticalNumber,
        nounEndings: n.russianNounCategory.russianNounEndings
      }]
    };
    this.selectedRow = {
      noun: n.nominativeForm,
      translation: n.translation,
      declension: n.russianNounCategory.id,
      id: n.id,
      animate: n.isAnimate,
      singularPluralId: n.singularPluralCoupleNounId
    }
  }

}
