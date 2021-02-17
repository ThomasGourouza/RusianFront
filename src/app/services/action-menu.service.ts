import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { BehaviorSubject, Observable } from 'rxjs';
export interface OpenLabel {
  label: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActionMenuService {

  private _menu$ = new BehaviorSubject<Array<MenuItem>>([]);

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

  // adjective = this.actionMenuRename.rowData.adjective
  // openAction = this.actionOpen(!this.isAdjectiveDetail);
  public setMenu(adjective: string, isClosed: boolean): void {

    const openAction = this.openLabel(isClosed);

    this._menu$.next(
    [{
      label: adjective,
      items: [
        {
          label: openAction.label,
          icon: openAction.icon,
          command: () => {

            this._action$.next(isClosed ? 'open' : 'close');


            // openAction = openAction.isOpen ? this.actionOpen(true) : this.actionOpen(false);
            // this.actionEmitter.emit({
            //   name: o,
            //   value: openAction.isOpen
            // });
            // this.refresh(openAction);
          }
        },
        {
          label: this.translate.instant('adjectives.adjectives.delete'),
          icon: 'pi pi-fw pi-trash',
          command: () => {
            this.confirm();
          }
        },
        {
          label: this.translate.instant('adjectives.adjectives.update'),
          icon: 'pi pi-fw pi-refresh',
          command: () => {

            this._action$.next('update');


            // this.actionEmitter.emit({
            //   name: u,
            //   value: true
            // });
          }
        }
      ]
    }
    ]
    );
  }

  private confirm(): void {
    this.confirmationService.confirm({
      message: this.translate.instant('adjectives.action.message'),
      accept: () => {

        this._action$.next('delete');
        

        // this.actionEmitter.emit({
        //   name: d,
        //   value: true
        // });
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
