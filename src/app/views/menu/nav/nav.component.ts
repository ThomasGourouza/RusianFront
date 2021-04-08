import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html'
})
export class NavComponent implements OnInit {

  public menu: MenuItem[];
  public items: MenuItem[];
  public activeItem: MenuItem;

  constructor(
    public translate: TranslateService,
    private router: Router
  ) { }

  public ngOnInit(): void {
    // update la langue à chaque changement
    this.translate.onLangChange.subscribe(() => {
      this.refresh();
    });
  }

  public refresh(): void {

    const home = this.translate.instant('navbar.menu.home');
    const adjective = this.translate.instant('navbar.menu.adjective');
    const noun = this.translate.instant('navbar.menu.noun');
    const training = this.translate.instant('navbar.menu.training');
    const github = this.translate.instant('navbar.menu.github');
    const edit = this.translate.instant('navbar.menu.edit');

    const file = this.translate.instant('navbar.side.file');
    const neww = this.translate.instant('navbar.side.new');
    const project = this.translate.instant('navbar.side.project');
    const other = this.translate.instant('navbar.side.other');
    const open = this.translate.instant('navbar.side.open');
    const quit = this.translate.instant('navbar.side.quit');
    const deletee = this.translate.instant('navbar.side.delete');
    const refresh = this.translate.instant('navbar.side.refresh');

    this.menu = [
      { label: home, icon: 'pi pi-fw pi-home', routerLink: '/welcome' },
      { label: adjective, icon: 'pi pi-fw pi-book', routerLink: '/adjectives' },
      { label: noun, icon: 'pi pi-fw pi-book', routerLink: '/nouns' },
      { label: training, icon: 'pi pi-fw pi-pencil', routerLink: '/training' },
      { label: github, icon: 'pi pi-fw pi-github', routerLink: '/github' },
    ];
    this.activeItem = this.menu[0];

    this.items = [
      {
        label: file,
        items: [{
          label: neww,
          icon: 'pi pi-fw pi-plus',
          items: [
            { label: project },
            { label: other },
          ]
        },
        { label: open },
        { label: quit }
        ]
      },
      {
        label: edit,
        icon: 'pi pi-fw pi-pencil',
        items: [
          { label: deletee, icon: 'pi pi-fw pi-trash' },
          { label: refresh, icon: 'pi pi-fw pi-refresh' }
        ]
      }
    ];

  }

  public activeMenu(menu: Array<MenuItem>): MenuItem {
    let activeMenu: MenuItem;
    if (menu) {
      activeMenu = menu.find((item) =>
        this.router.url.split('/').includes(item.routerLink.split('/')[1]))
    }
    return menu && activeMenu ? activeMenu : null;
  }

  public redirectToWelcome(): void {
    this.router.navigateByUrl('/welcome');
  }

}
