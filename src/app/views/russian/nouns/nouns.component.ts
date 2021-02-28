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

export interface Category {
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
 * /nouns/update/:noun
 */
export class NounsComponent extends subscribedContainerMixin() implements OnInit {

  public _nounCategoriesInanimate: Array<NounCategory>;
  public _nounCategoriesAnimate: Array<NounCategory>;
  public nounCategory: NounCategory;

  public category: Category;

  // public selectedRow: RowData;
  public page: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    private sideMenuService: SideMenuNounsService,
    private actionMenuService: ActionMenuService,
    private nounService: NounService,
    private russianReferenceService: RussianReferenceService,
    // private nounListService: NounListService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initMenus();
    this.resetServices();

    // update la langue à chaque changement
    this.translate.onLangChange.subscribe(() => {
      this.initMenus();
    });

    // récupération des références
    this.russianReferenceService.nounCategoriesInanimate$
      .subscribe((nounCategories: Array<NounCategory>) => {
        this._nounCategoriesInanimate = nounCategories;
        // setter de this.page au chargement de la page
        this.setPage(this.router.url);
      });
    this.russianReferenceService.nounCategoriesAnimate$
      .subscribe((nounCategories: Array<NounCategory>) => {
        this._nounCategoriesAnimate = nounCategories;
      });


    // emetter du service sideMenu (gauche)
    this.sideMenuService.selection$.pipe(
      takeUntil(
        this.destroyed$
      )
    ).subscribe((selection: NounCategoryIds) => {
      if (selection) {
        if (selection.name === 'declension') {
          this.category = this.mapCategory(selection);
          this.redirect(this.mapCategoryToUrl(this.category));
        } else {
          switch (selection.name) {
            case 'intro': {
              //   this.resetServices();
              //   this.redirect('/' + Const.nouns);
              break;
            }
            case 'consult': {
              //   this.redirect('/' + Const.nouns + '/' + selection);
              //   nouns/:category/:gender/:type
              break;
            }
            case 'add': {
              //   this.redirect('/' + Const.nouns + '/' + selection);
              //   nouns/:category/:gender/:type
              break;
            }
          }

        }
      }
    });

    // emetter de noun list (milieu)
    // this.nounListService.rowData$.pipe(
    //   takeUntil(
    //     this.destroyed$
    //   )
    // ).subscribe((selectedRow: RowData) => {
    //   this.selectedRow = selectedRow;
    //   if (selectedRow) {
    //     // mise à jour du menu de droite
    //     this.actionMenuService.setMenu(selectedRow.translation, true, Const.check);
    //   }
    // });

    // emetter du service actionMenu (droite)
    this.actionMenuService.action$.pipe(
      takeUntil(
        this.destroyed$
      )
    ).subscribe((action: string) => {
      if (action) {
        console.log(action);
        // mise à jour du menu de droite
        switch (action) {
          case Const.open: {
            // const translation = this.selectedRow?.translation;
            // if (translation) {
            //   this.actionMenuService.setMenu(translation, false, Const.check);
            //   this.redirect('/nouns/consult/' + translation);
            // }
            break;
          }
          case Const.close: {
            // déselection de la row
            // this.closeDisplayNounAndGoTo('/nouns/consult');
            break;
          }
          case Const.delete: {
            // const nounId = this.selectedRow?.id;
            // if (nounId) {
            //   this.nounService.deleteNounById(nounId);
            //   this.resetServices();
            //   this.closeDisplayNounAndGoTo('/nouns/consult');
            // }
            break;
          }
          case Const.update: {
            // const noun = this.selectedRow?.translation;
            // if (noun) {
            //   this.resetServices();
            //   this.closeDisplayNounAndGoTo('/nouns/update/' + noun);
            // }
            break;
          }
          case Const.create: {
            // const noun = this.activatedRoute.snapshot.params[Const.noun];
            // if (noun) {
            //   this.resetServices();
            //   this.closeDisplayNounAndGoTo('/nouns/add/' + noun);
            // }
            break;
          }
        }
      }
    });
  }

  private mapCategory(selection: NounCategoryIds): Category {
    const categories = this._nounCategoriesInanimate.filter(
      (c) => c.id === selection.singular || c.id === selection.plural
    );
    if (categories.length === 2) {
      const category: Category = {
        declension: '',
        gender: '',
        type: '',
        endings: []
      }
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
      case 'First declension': {
        cat = 'first-declension';
        break;
      }
      case 'Second declension': {
        cat = 'second-declension';
        break;
      }
      case 'Third declension': {
        cat = 'third-declension';
        break;
      }
      default: {
        break;
      }
    }
    switch (category.gender) {
      case 'Masculine': {
        gender = 'masculine';
        break;
      }
      case 'Feminine': {
        gender = 'feminine';
        break;
      }
      case 'Neutral': {
        gender = 'neuter';
        break;
      }
      default: {
        break;
      }
    }
    switch (category.type) {
      case 'First type': {
        type = '1';
        break;
      }
      case 'Second type': {
        type = '2';
        break;
      }
      case 'Third type': {
        type = '3';
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
      name: 'declension',
      singular: 0,
      plural: 0
    };
    switch (category) {
      case 'first-declension': {
        switch (gender) {
          case 'masculine': {
            switch (type) {
              case '1': {
                selection.singular = 1;
                selection.plural = 4;
                break;
              }
              case '2': {
                selection.singular = 2;
                selection.plural = 5;
                break;
              }
              case '3': {
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
          case 'feminine': {
            switch (type) {
              case '1': {
                selection.singular = 7;
                selection.plural = 10;
                break;
              }
              case '2': {
                selection.singular = 8;
                selection.plural = 11;
                break;
              }
              case '3': {
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
      case 'second-declension': {
        switch (gender) {
          case 'masculine': {
            switch (type) {
              case '1': {
                selection.singular = 13;
                selection.plural = 16;
                break;
              }
              case '2': {
                selection.singular = 14;
                selection.plural = 17;
                break;
              }
              case '3': {
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
          case 'neuter': {
            switch (type) {
              case '1': {
                selection.singular = 19;
                selection.plural = 21;
                break;
              }
              case '2': {
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
      case 'third-declension': {
        switch (gender) {
          case 'masculine': {
            if (type === '1') {
              selection.singular = 23;
              selection.plural = 24;
            } else {
              this.router.navigateByUrl('/' + Const.NF);
            }
            break;
          }
          case 'feminine': {
            if (type === '1') {
              selection.singular = 25;
              selection.plural = 26;
            } else {
              this.router.navigateByUrl('/' + Const.NF);
            }
            break;
          }
          case 'neuter': {
            switch (type) {
              case '1': {
                selection.singular = 27;
                selection.plural = 29;
                break;
              }
              case '2': {
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
    const category = this.activatedRoute.snapshot.params[Const.category];
    const noun = this.activatedRoute.snapshot.params[Const.noun];
    const declensionExpanded = category && ![Const.consult, Const.add].includes(category);
    const nounExpanded = noun || [Const.consult, Const.add].includes(category);

    // mise à jour du menu de gauche
    this.sideMenuService.setMenu(declensionExpanded, nounExpanded);
    // mise à jour du menu de droite
    // this.actionMenuService.setMenu(noun, !noun, this.page);
  }

  // redirection en modifiant la valeur de this.page
  private redirect(url: string): void {
    // this.setPage(url);
    this.router.navigateByUrl(url);
  }

  private resetServices(): void {
    // this.actionMenuService.resetAction();
    // this.nounListService.setRowdata(null);
    this.sideMenuService.setSelection(null);
  }

  clear(table: Table) {
    table.clear();
  }

  private closeDisplayNounAndGoTo(url: string): void {
    // déselection de la row
    // this.nounListService.setRowdata(null);
    // mise à jour du menu
    this.actionMenuService.setMenu('', true, Const.check);
    this.redirect(url);
  }


  public displayActionMenu(): boolean {
    // return (this.page === Const.consult && !!this.selectedRow)
    //   || this.page === Const.check
    //   || this.page === Const.update
    //   || this.page === Const.NF;
    return true;
  }

  public getNounCategory(id: number): NounCategory {
    return this._nounCategoriesInanimate.find((category) => category.id === id);
  }

  private mapEndings(root: string, endings: Array<NounEnding>): Array<NounEnding> {
    // return endings.map((ending) =>
    //   new NounEnding(
    //     ending.russianCase,
    //     ending.russianGender,
    //     (ending.value != Const.NG) ? root + ending.value : this.nomOrGen(root, ending.russianGender, endings)
    //   )
    // );
    return endings;
  }

  // private nomOrGen(root: string, gender: string, endings: Array<NounEnding>): string {
  //   const filteredEndings = endings.filter((ending) =>
  //     ending.russianGender === gender
  //   );
  //   const nom = filteredEndings.find((filteredEnding) => filteredEnding.russianCase === Const.N).value;
  //   const gen = filteredEndings.find((filteredEnding) => filteredEnding.russianCase === Const.G).value;

  //   return root + nom + ' / ' + root + gen;
  // }

  private setPage(url: string): void {
    // this.selectedRow = null;
    const urlArray = url.split('/');
    // console.log(urlArray);
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
    // url = nouns/update/:noun
    if (urlArray.length === 4) {
      const category = urlArray[2];
      const noun = urlArray[3];
      this.nounService.clearNoun();
      this.nounService.fetchNounByTranslation(noun);
      this.nounService.noun$.subscribe(
        (n: Noun) => {
          switch (category) {
            case Const.consult: {
              if (n.id) {
                this.caseConsultNoun(noun, n);
              } else {
                this.resetServices();
                this.actionMenuService.setMenu(noun, false, Const.create);
                this.page = Const.NF;
              }
              break;
            }
            case Const.update: {
              if (n.id) {
                this.resetServices();
                this.actionMenuService.setMenu(noun, false, Const.update);
                this.page = Const.update;
              } else {
                this.resetServices();
                this.actionMenuService.setMenu(noun, false, Const.create);
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
        && ['masculine', 'feminine', 'neuter'].includes(urlArray[3])
        && ['1', '2', '3'].includes(urlArray[4])) {
        const selection = this.selectionFromUrl(urlArray[2], urlArray[3], urlArray[4]);
        this.category = this.mapCategory(selection);
        this.page = 'declension';
      } else {
        // si les valeurs de l'url sont incorrectes
        this.router.navigateByUrl('/' + Const.NF);
        // this.page = Const.NF;
      }
    }
  }

  private caseConsultNoun(noun: string, n: Noun): void {
    this.actionMenuService.setMenu(noun, false, Const.check);
    this.page = Const.check;
    const root = n.root;
    // this.nounCategory = new NounCategory(
    //   n.category.id,
    //   n.category.value,
    //   this.mapEndings(root, n.category.endings)
    // );
    // this.selectedRow = {
    //   noun: n.nominativeMasculineForm,
    //   translation: n.translation,
    //   declension: n.category.id,
    //   id: n.id
    // }
  }

}
