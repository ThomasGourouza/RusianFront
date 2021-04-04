import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TreeNode } from 'primeng/api';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { takeUntil } from 'rxjs/operators';
import { SideMenuTrainingService } from 'src/app/services/side-menu-training.service';

@Component({
  selector: 'app-side-training',
  templateUrl: './side-training.component.html'
})
export class SideTrainingComponent extends subscribedContainerMixin() implements OnInit {

  public sideMenu: Array<TreeNode>;

  constructor(
    private sideMenuService: SideMenuTrainingService,
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
