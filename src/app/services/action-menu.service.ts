import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
import { Const } from './utils/const';
export interface OpenLabel {
  label: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActionMenuService {

  // menu de droite
  private _menu$ = new BehaviorSubject<Array<MenuItem>>([]);

  // action souscrite par Adj component
  private _action$ = new BehaviorSubject<string>(null);

  constructor(
    public translate: TranslateService,
    private confirmationService: ConfirmationService
  ) { }

  public get menu$(): Observable<Array<MenuItem>> {
    return this._menu$.asObservable();
  }

  public get action$(): Observable<string> {
    return this._action$.asObservable();
  }

  public resetAction(): void {
    this._action$.next(null);
  }

  public setMenu(translation: string, isClosed: boolean, adjectiveExist: boolean): void {
    const openAction = this.openLabel(isClosed);
    if (adjectiveExist) {
      this._menu$.next([
        {
          label: translation,
          items: [
            {
              label: openAction.label,
              icon: openAction.icon,
              command: () => {
                this._action$.next(isClosed ? Const.open : Const.close);
              }
            },
            {
              label: this.translate.instant('adjectives.adjectives.update'),
              icon: 'pi pi-fw pi-refresh',
              command: () => {
                this._action$.next(Const.update);
              }
            },
            {
              label: this.translate.instant('adjectives.adjectives.delete'),
              icon: 'pi pi-fw pi-trash',
              command: () => {
                this.confirmDelete();
              }
            }
          ]
        }
      ]);
    } else {
      this._menu$.next([
        {
          label: translation,
          items: [
            {
              label: openAction.label,
              icon: openAction.icon,
              command: () => {
                this._action$.next(isClosed ? Const.open : Const.close);
              }
            },
            {
              label: this.translate.instant('adjectives.adjectives.create'),
              icon: 'pi pi-fw pi-plus',
              command: () => {
                this._action$.next(Const.create);
              }
            }
          ]
        }
      ]);
    }
  }

  private confirmDelete(): void {
    this.confirmationService.confirm({
      message: this.translate.instant('adjectives.action.message'),
      accept: () => {
        this._action$.next(Const.delete);
      }
    });
  }

  public openLabel(isClosed: boolean): OpenLabel {
    return isClosed ?
      {
        label: this.translate.instant('adjectives.adjectives.open'),
        icon: 'pi pi-fw pi-arrow-right',
      } : {
        label: this.translate.instant('adjectives.adjectives.back'),
        icon: 'pi pi-fw pi-arrow-left'
      };
  }

}
