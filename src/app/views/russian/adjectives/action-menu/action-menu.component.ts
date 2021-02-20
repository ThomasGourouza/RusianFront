import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
import { ActionMenuService } from 'src/app/services/action-menu.service';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
// 'open', 'delete' or 'update'
export interface Action {
  name: string;
  value: boolean;
}

@Component({
  selector: 'app-action-menu',
  templateUrl: './action-menu.component.html',
  styleUrls: ['./action-menu.component.scss']
})
export class ActionMenuComponent extends subscribedContainerMixin() implements OnInit {

  public actionMenu: Array<MenuItem>;

  constructor(
    private actionMenuService: ActionMenuService,
    public translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.actionMenuService.menu$.pipe(
      takeUntil(
        this.destroyed$
      )
    ).subscribe((menu: Array<MenuItem>) =>
      this.actionMenu = menu
    );

  }

  public getTranslated(word: string): string {
    return this.translate.instant('adjectives.action.' + word);
  }

}
