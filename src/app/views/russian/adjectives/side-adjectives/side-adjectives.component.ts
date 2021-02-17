import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TreeNode } from 'primeng/api';
import { SideMenu } from '../adjectives.component';
import { SideMenuService } from 'src/app/services/side-menu.service';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-side-adjectives',
  templateUrl: './side-adjectives.component.html',
  styleUrls: ['./side-adjectives.component.scss']
})
export class SideAdjectivesComponent extends subscribedContainerMixin() implements OnInit {

  @Output()
  public sideMenuEmitter: EventEmitter<SideMenu> = new EventEmitter();

  public sideMenu: Array<TreeNode>;

  constructor(
    private sideMenuService: SideMenuService,
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

  select(event: any) {
    this.sideMenuEmitter.emit({
      show: (event.node.data != 0),
      type: event.node.data
    });
  }
}
