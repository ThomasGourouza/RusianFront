import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { ActionMenu } from '../adjectives.component';
export interface Action {
  label: string;
  icon: string;
  isOpen: boolean;
}
const A = 'adjective';

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent implements OnInit {

  @Input()
  public actionMenu: ActionMenu;
  @Output()
  public openAdjDeclension: EventEmitter<boolean> = new EventEmitter();

  public langue: string;
  public adjective: string;

  public items: Array<MenuItem>;

  private action: Action;

  constructor(
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.action = this.actionOpen(!this.activatedRoute.snapshot.params[A]);
    this.refresh(this.action);
  }

  public actionOpen(value: boolean): Action {
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

  public refresh(action: Action): void {
    this.langue = this.translate.currentLang;
    this.adjective = this.actionMenu.rowData.adjective;
    this.items = [{
      label: this.adjective,
      items: [
        {
          label: action.label,
          icon: action.icon,
          command: () => {
            this.action = action.isOpen ? this.actionOpen(true) : this.actionOpen(false);
            this.openAdjDeclension.emit(this.action.isOpen);
            this.refresh(this.action);
          }
        },
        {
          label: this.translate.instant('adjectives.adjectives.delete'),
          icon: 'pi pi-fw pi-trash',
          command: () => {
            console.log('delete');
          }
        },
        {
          label: this.translate.instant('adjectives.adjectives.update'),
          icon: 'pi pi-fw pi-refresh',
          command: () => {
            console.log('update');
          }
        }
      ]
    }];
  }

  public actualise(): boolean {
    if (this.langue !== this.translate.currentLang
      || this.adjective !== this.actionMenu.rowData.adjective) {
      this.action = this.actionOpen(!this.action.isOpen);
      this.refresh(this.action);
    }
    return true;
  }

}
