import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TreeNode } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
export interface Menu {
  intro: string;
  declension: string;
  first: string;
  second: string;
  third: string;
  fourth: string;
  adjectives: string;
  consult: string;
  add: string;
  declensionExpanded: boolean;
  adjectiveExpanded: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SideMenuService {

  private _menu$ = new BehaviorSubject<Array<TreeNode>>([]);

  constructor(
    public translate: TranslateService,
  ) { }

  public get menu$(): Observable<Array<TreeNode>> {
    return this._menu$.asObservable();
  }

  public setMenu(isDeclensionExpanded: boolean, isAdjectiveExpanded: boolean): void {
    const menu: Menu = {
      intro: this.translate.instant('adjectives.side.intro'),
      declension: this.translate.instant('adjectives.side.declension'),
      first: this.translate.instant('adjectives.side.first'),
      second: this.translate.instant('adjectives.side.second'),
      third: this.translate.instant('adjectives.side.third'),
      fourth: this.translate.instant('adjectives.side.fourth'), 
      adjectives: this.translate.instant('adjectives.side.adjectives'),
      consult: this.translate.instant('adjectives.side.consult'),
      add: this.translate.instant('adjectives.side.add'),
      declensionExpanded: isDeclensionExpanded,
      adjectiveExpanded: isAdjectiveExpanded,
    }
    this._menu$.next(
      [
        {
          label: menu.intro,
          icon: "pi pi-paperclip",
          selectable: true,
          data: 0
        },
        {
          label: menu.declension,
          expandedIcon: "pi pi-folder-open",
          collapsedIcon: "pi pi-folder",
          selectable: false,
          expanded: menu.declensionExpanded,
          children: [
            {
              label: menu.first,
              icon: 'pi pi-fw pi-file',
              selectable: true,
              data: 1
            },
            {
              label: menu.second,
              icon: 'pi pi-fw pi-file',
              selectable: true,
              data: 2
            },
            {
              label: menu.third,
              icon: 'pi pi-fw pi-file',
              selectable: true,
              data: 3
            },
            {
              label: menu.fourth,
              icon: 'pi pi-fw pi-file',
              selectable: true,
              data: 4
            }
          ]
        },
        {
          label: menu.adjectives,
          expandedIcon: "pi pi-folder-open",
          collapsedIcon: "pi pi-folder",
          selectable: false,
          expanded: menu.adjectiveExpanded,
          children: [{
            label: menu.consult,
            icon: 'pi pi-fw pi-eye',
            selectable: true,
            data: 5
          },
          {
            label: menu.add,
            icon: 'pi pi-fw pi-plus',
            selectable: true,
            data: 6
          }
          ]
        }
      ]
    );
  }
}
