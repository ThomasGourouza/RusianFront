import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ActionMenu } from '../adjectives.component';
export interface OpenAction {
  label: string;
  icon: string;
  isOpen: boolean;
}
// 'open', 'delete' or 'update'
export interface Action {
  name: string;
  value: boolean;
}
const A = 'adjective';
const o = 'open';
const d = 'delete';
const u = 'update';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent implements OnInit {

  @Input()
  public actionMenu: ActionMenu;
  @Output()
  public actionEmitter: EventEmitter<Action> = new EventEmitter();

  public langue: string;
  public adjective: string;

  public items: Array<MenuItem>;

  private openAction: OpenAction;

  constructor(
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.openAction = this.actionOpen(!this.activatedRoute.snapshot.params[A]);
    this.refresh(this.openAction);
  }

  public actionOpen(value: boolean): OpenAction {
    return value ?
      {
        label: this.translate.instant('adjectives.adjectives.open'),
        icon: 'pi pi-fw pi-arrow-right',
        isOpen: false
      } : {
        label: this.translate.instant('adjectives.adjectives.back'),
        icon: 'pi pi-fw pi-arrow-left',
        isOpen: true
      };
  }

  public refresh(openAction: OpenAction): void {
    this.langue = this.translate.currentLang;
    this.adjective = this.actionMenu.rowData.adjective;
    this.items = [{
      label: this.adjective,
      items: [
        {
          label: openAction.label,
          icon: openAction.icon,
          command: () => {
            this.openAction = openAction.isOpen ? this.actionOpen(true) : this.actionOpen(false);
            this.actionEmitter.emit({
              name: o,
              value: this.openAction.isOpen
            });
            this.refresh(this.openAction);
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
            this.actionEmitter.emit({
              name: u,
              value: true
            });
          }
        }
      ]
    }];
  }

  public getTranslated(answer: string): string {
    return this.translate.instant('adjectives.action.' + answer);
  }

  private confirm(): void {
    this.confirmationService.confirm({
      message: this.translate.instant('adjectives.action.message'),
      accept: () => {
        this.actionEmitter.emit({
          name: d,
          value: true
        });
      }
    });
  }

  public actualise(): boolean {
    if (this.langue !== this.translate.currentLang
      || this.adjective !== this.actionMenu.rowData.adjective) {
      this.openAction = this.actionOpen(!this.openAction.isOpen);
      this.refresh(this.openAction);
    }
    return true;
  }

}
