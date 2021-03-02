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
  public setMenu(isDeclensionExpanded: boolean, isAdjectiveExpanded: boolean): void {
    this._menu$.next(
      [
        {
          label: this.translate.instant('adjectives.side.intro'),
          icon: "pi pi-paperclip",
          selectable: true,
          data: this.nounCategory(0, Const.intro, 0, 0)

        },
        {
          label: this.translate.instant('adjectives.side.declension'),
          expandedIcon: "pi pi-folder-open",
          collapsedIcon: "pi pi-folder",
          selectable: false,
          expanded: isDeclensionExpanded,
          children: [
            {
              label: 'First',
              expandedIcon: "pi pi-folder-open",
              collapsedIcon: "pi pi-folder",
              selectable: false,
              expanded: false,
              children: [
                {
                  label: 'Masculine',
                  expandedIcon: "pi pi-folder-open",
                  collapsedIcon: "pi pi-folder",
                  selectable: false,
                  expanded: false,
                  children: [
                    {
                      label: 'First type',
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(1, 'declension', 1, 4)
                    },
                    {
                      label: 'Second type',
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(2, 'declension', 2, 5)
                    },
                    {
                      label: 'Third type',
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(3, 'declension', 3, 6)
                    }
                  ]
                },
                {
                  label: 'Feminine',
                  expandedIcon: "pi pi-folder-open",
                  collapsedIcon: "pi pi-folder",
                  selectable: false,
                  expanded: false,
                  children: [
                    {
                      label: 'First type',
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(4, 'declension', 7, 10)
                    },
                    {
                      label: 'Second type',
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(5, 'declension', 8, 11)
                    },
                    {
                      label: 'Third type',
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(6, 'declension', 9, 12)
                    }
                  ]
                }
              ]
            },
            {
              label: 'Second',
              expandedIcon: "pi pi-folder-open",
              collapsedIcon: "pi pi-folder",
              selectable: false,
              expanded: false,
              children: [
                {
                  label: 'Masculine',
                  expandedIcon: "pi pi-folder-open",
                  collapsedIcon: "pi pi-folder",
                  selectable: false,
                  expanded: false,
                  children: [
                    {
                      label: 'First type',
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(7, 'declension', 13, 16)
                    },
                    {
                      label: 'Second type',
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(8, 'declension', 14, 17)
                    },
                    {
                      label: 'Third type',
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(9, 'declension', 15, 18)
                    }
                  ]
                },
                {
                  label: 'Neuter',
                  expandedIcon: "pi pi-folder-open",
                  collapsedIcon: "pi pi-folder",
                  selectable: false,
                  expanded: false,
                  children: [
                    {
                      label: 'First type',
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(10, 'declension', 19, 21)
                    },
                    {
                      label: 'Second type',
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(11, 'declension', 20, 22)
                    }
                  ]
                }
              ]
            },
            {
              label: 'Third',
              expandedIcon: "pi pi-folder-open",
              collapsedIcon: "pi pi-folder",
              selectable: false,
              expanded: false,
              children: [
                {
                  label: 'Masculine',
                  expandedIcon: "pi pi-folder-open",
                  collapsedIcon: "pi pi-folder",
                  selectable: false,
                  expanded: false,
                  children: [
                    {
                      label: 'First type',
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(12, 'declension', 23, 24)
                    }
                  ]
                },
                {
                  label: 'Feminine',
                  expandedIcon: "pi pi-folder-open",
                  collapsedIcon: "pi pi-folder",
                  selectable: false,
                  expanded: false,
                  children: [
                    {
                      label: 'First type',
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(13, 'declension', 25, 26)
                    }
                  ]
                },
                {
                  label: 'Neuter',
                  expandedIcon: "pi pi-folder-open",
                  collapsedIcon: "pi pi-folder",
                  selectable: false,
                  expanded: false,
                  children: [
                    {
                      label: 'First type',
                      icon: 'pi pi-fw pi-file',
                      selectable: true,
                      data: this.nounCategory(14, 'declension', 27, 29)
                    },
                    {
                      label: 'Second type',
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
          expanded: isAdjectiveExpanded,
          children: [
            {
              label: this.translate.instant('adjectives.side.consult'),
              icon: 'pi pi-fw pi-eye',
              selectable: true,
              data: this.nounCategory(0, Const.consult, 0, 0)
            },
            {
              label: this.translate.instant('adjectives.side.add'),
              icon: 'pi pi-fw pi-plus',
              selectable: true,
              data: this.nounCategory(0, Const.add, 0, 0)
            }
          ]
        }
      ]
    );
  }
}
