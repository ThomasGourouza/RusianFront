import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TreeNode } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { Const } from 'src/app/services/utils/const';
export interface NounCategoryIds {
  id: number;
  name: string;
  singular: number;
  plural: number;
}

@Injectable({
  providedIn: 'root'
})
export class SideMenuNounsService {

  // menu de gauche
  private _menu$ = new BehaviorSubject<Array<TreeNode>>([]);

  // selection souscrite par Noun component
  private _selection$ = new BehaviorSubject<NounCategoryIds>(null);

  constructor(
    public translate: TranslateService,
  ) { }

  public get menu$(): Observable<Array<TreeNode>> {
    return this._menu$.asObservable();
  }

  public get selection$(): Observable<NounCategoryIds> {
    return this._selection$.asObservable();
  }

  public setSelection(selection: NounCategoryIds): void {
    this._selection$.next(selection);
  }

  private nounCategory(i: number, n: string, s: number, p: number): NounCategoryIds {
    return {
      id: i,
      name: n,
      singular: s,
      plural: p
    };
  }
  public setMenu(category: string, gender: string, type: string, isNounExpanded: boolean): void {
    this._menu$.next(
      [
        {
          label: this.translate.instant('nouns.side.intro'),
          icon: "pi pi-paperclip",
          selectable: true,
          data: this.nounCategory(0, Const.intro, 0, 0)

        },
        {
          label: this.translate.instant('nouns.side.declension'),
          expandedIcon: "pi pi-folder-open",
          collapsedIcon: "pi pi-folder",
          selectable: false,
          expanded: !!category && !!gender && !!type,
          children: [
            {
              label: this.translate.instant('nouns.side.first'),
              expandedIcon: "pi pi-folder-open",
              collapsedIcon: "pi pi-folder",
              selectable: false,
              expanded: category === Const.first,
              children: [
                {
                  label: this.translate.instant('nouns.side.masculine'),
                  expandedIcon: "pi pi-folder-open",
                  collapsedIcon: "pi pi-folder",
                  selectable: false,
                  expanded: category === Const.first && gender === Const.m,
                  children: [
                    {
                      label: this.translate.instant('nouns.side.first-type'),
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(1, 'declension', 1, 4)
                    },
                    {
                      label: this.translate.instant('nouns.side.second-type'),
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(2, 'declension', 2, 5)
                    },
                    {
                      label: this.translate.instant('nouns.side.third-type'),
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(3, 'declension', 3, 6)
                    }
                  ]
                },
                {
                  label: this.translate.instant('nouns.side.feminine'),
                  expandedIcon: "pi pi-folder-open",
                  collapsedIcon: "pi pi-folder",
                  selectable: false,
                  expanded: category === Const.first && gender === Const.f,
                  children: [
                    {
                      label: this.translate.instant('nouns.side.first-type'),
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(4, 'declension', 7, 10)
                    },
                    {
                      label: this.translate.instant('nouns.side.second-type'),
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(5, 'declension', 8, 11)
                    },
                    {
                      label: this.translate.instant('nouns.side.third-type'),
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(6, 'declension', 9, 12)
                    }
                  ]
                }
              ]
            },
            {
              label: this.translate.instant('nouns.side.second'),
              expandedIcon: "pi pi-folder-open",
              collapsedIcon: "pi pi-folder",
              selectable: false,
              expanded: category === Const.second,
              children: [
                {
                  label: this.translate.instant('nouns.side.masculine'),
                  expandedIcon: "pi pi-folder-open",
                  collapsedIcon: "pi pi-folder",
                  selectable: false,
                  expanded: category === Const.second && gender === Const.m,
                  children: [
                    {
                      label: this.translate.instant('nouns.side.first-type'),
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(7, 'declension', 13, 16)
                    },
                    {
                      label: this.translate.instant('nouns.side.second-type'),
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(8, 'declension', 14, 17)
                    },
                    {
                      label: this.translate.instant('nouns.side.third-type'),
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(9, 'declension', 15, 18)
                    }
                  ]
                },
                {
                  label: this.translate.instant('nouns.side.neuter'),
                  expandedIcon: "pi pi-folder-open",
                  collapsedIcon: "pi pi-folder",
                  selectable: false,
                  expanded: category === Const.second && gender === Const.n,
                  children: [
                    {
                      label: this.translate.instant('nouns.side.first-type'),
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(10, 'declension', 19, 21)
                    },
                    {
                      label: this.translate.instant('nouns.side.second-type'),
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(11, 'declension', 20, 22)
                    }
                  ]
                }
              ]
            },
            {
              label: this.translate.instant('nouns.side.third'),
              expandedIcon: "pi pi-folder-open",
              collapsedIcon: "pi pi-folder",
              selectable: false,
              expanded: category === Const.third,
              children: [
                {
                  label: this.translate.instant('nouns.side.masculine'),
                  expandedIcon: "pi pi-folder-open",
                  collapsedIcon: "pi pi-folder",
                  selectable: false,
                  expanded: category === Const.third && gender === Const.m,
                  children: [
                    {
                      label: this.translate.instant('nouns.side.first-type'),
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(12, 'declension', 23, 24)
                    }
                  ]
                },
                {
                  label: this.translate.instant('nouns.side.feminine'),
                  expandedIcon: "pi pi-folder-open",
                  collapsedIcon: "pi pi-folder",
                  selectable: false,
                  expanded: category === Const.third && gender === Const.f,
                  children: [
                    {
                      label: this.translate.instant('nouns.side.first-type'),
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(13, 'declension', 25, 26)
                    }
                  ]
                },
                {
                  label: this.translate.instant('nouns.side.neuter'),
                  expandedIcon: "pi pi-folder-open",
                  collapsedIcon: "pi pi-folder",
                  selectable: false,
                  expanded: category === Const.third && gender === Const.n,
                  children: [
                    {
                      label: this.translate.instant('nouns.side.first-type'),
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(14, 'declension', 27, 29)
                    },
                    {
                      label: this.translate.instant('nouns.side.second-type'),
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(15, 'declension', 28, 30)
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          label: 'Nouns',
          expandedIcon: "pi pi-folder-open",
          collapsedIcon: "pi pi-folder",
          selectable: false,
          expanded: isNounExpanded,
          children: [
            {
              label: this.translate.instant('nouns.side.consult'),
              icon: 'pi pi-fw pi-eye',
              selectable: true,
              data: this.nounCategory(0, Const.consult, 0, 0)
            },
            {
              label: this.translate.instant('nouns.side.add'),
              icon: 'pi pi-fw pi-plus',
              selectable: true,
              data: this.nounCategory(0, Const.add, 0, 0)
            },
            {
              label: this.translate.instant('nouns.side.link'),
              icon: 'pi pi-fw pi-link',
              selectable: true,
              data: this.nounCategory(0, Const.link, 0, 0)
            }
          ]
        }
      ]
    );
  }
}
