import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TreeNode } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { Const } from 'src/app/services/utils/const';

@Injectable({
  providedIn: 'root'
})
export class SideMenuTrainingService {

  // menu de gauche
  private _menu$ = new BehaviorSubject<Array<TreeNode>>([]);

  // selection souscrite par Noun component
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

  public setMenu(testExpanded: boolean): void {
    this._menu$.next(
      [
        {
          label: this.translate.instant('training.intro'),
          icon: "pi pi-paperclip",
          selectable: true,
          data: Const.intro
        },
        {
          label: this.translate.instant('training.preparation'),
          icon: "pi pi-check",
          selectable: true,
          data: Const.check
        },
        {
          label: this.translate.instant('training.tests'),
          expandedIcon: "pi pi-folder-open",
          collapsedIcon: "pi pi-folder",
          selectable: false,
          expanded: testExpanded,
          children: [
            {
              label: this.translate.instant('training.test-visual'),
              icon: "pi pi-eye",
              selectable: true,
              data: Const.visual
            },
            {
              label: this.translate.instant('training.test-written'),
              icon: "pi pi-pencil",
              selectable: true,
              data: Const.written
            }
          ]
        }
      ]
    );
  }
}
