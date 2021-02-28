import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TreeNode } from 'primeng/api';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { takeUntil } from 'rxjs/operators';
import { SideMenuNounsService } from 'src/app/services/side-menu-nouns.service';

@Component({
  selector: 'app-side-nouns',
  templateUrl: './side-nouns.component.html',
  styleUrls: ['./side-nouns.component.scss']
})
export class SideNounsComponent extends subscribedContainerMixin() implements OnInit {

  public sideMenu: Array<TreeNode>;

  constructor(
    private sideMenuService: SideMenuNounsService,
    public translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.sideMenuService.menu$.pipe(
      takeUntil(
        this.destroyed$
      )
    ).subscribe((menu: Array<TreeNode>) =>
      this.sideMenu = menu
    );
  }

  // mise à jour de la selection dans le service
  select(event: any) {
    this.sideMenuService.setSelection(event.node.data);
  }
}
