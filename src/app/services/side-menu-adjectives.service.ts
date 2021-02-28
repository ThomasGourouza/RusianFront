import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TreeNode } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { Const } from 'src/app/services/utils/const';

@Injectable({
  providedIn: 'root'
})
export class SideMenuAdjectivesService {

  // menu de gauche
  private _menu$ = new BehaviorSubject<Array<TreeNode>>([]);

  // selection souscrite par Adj component
  private _selection$ = new BehaviorSubject<string>(null);

  constructor(
    public translate: TranslateService,
  ) { }

  public get menu$(): Observable<Array<TreeNode>> {
    return this._menu$.asObservable();
  }

  public get selection$(): Observable<string> {
    return this._selection$.asObservable();
  }

  public setSelection(selection: string): void {
    this._selection$.next(selection);
  }

  public setMenu(isDeclensionExpanded: boolean, isAdjectiveExpanded: boolean): void {
    this._menu$.next(
      [
        {
          label: this.translate.instant('adjectives.side.intro'),
          icon: "pi pi-paperclip",
          selectable: true,
          data: Const.intro,

        },
        {
          label: this.translate.instant('adjectives.side.declension'),
          expandedIcon: "pi pi-folder-open",
          collapsedIcon: "pi pi-folder",
          selectable: false,
          expanded: isDeclensionExpanded,
          children: [
            {
              label: this.translate.instant('adjectives.side.first'),
              icon: 'pi pi-fw pi-file',
              selectable: true,
              data: Const.first
            },
            {
              label: this.translate.instant('adjectives.side.second'),
              icon: 'pi pi-fw pi-file',
              selectable: true,
              data: Const.second
            },
            {
              label: this.translate.instant('adjectives.side.third'),
              icon: 'pi pi-fw pi-file',
              selectable: true,
              data: Const.third
            },
            {
              label: this.translate.instant('adjectives.side.fourth'),
              icon: 'pi pi-fw pi-file',
              selectable: true,
              data: Const.fourth
            }
          ]
        },
        {
          label: this.translate.instant('adjectives.side.adjectives'),
          expandedIcon: "pi pi-folder-open",
          collapsedIcon: "pi pi-folder",
          selectable: false,
          expanded: isAdjectiveExpanded,
          children: [{
            label: this.translate.instant('adjectives.side.consult'),
            icon: 'pi pi-fw pi-eye',
            selectable: true,
            data: Const.consult
          },
          {
            label: this.translate.instant('adjectives.side.add'),
            icon: 'pi pi-fw pi-plus',
            selectable: true,
            data: Const.add
          }
          ]
        }
      ]
    );
  }
}
