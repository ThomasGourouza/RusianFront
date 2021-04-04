import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TreeNode } from 'primeng/api';
import { SideMenuAdjectivesService } from 'src/app/services/side-menu-adjectives.service';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-side-adjectives',
  templateUrl: './side-adjectives.component.html'
})
export class SideAdjectivesComponent extends subscribedContainerMixin() implements OnInit {

  public sideMenu: Array<TreeNode>;

  constructor(
    private sideMenuService: SideMenuAdjectivesService,
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
