import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  public menu: MenuItem[];
  public items: MenuItem[];
  public activeItem: MenuItem;

  public langue: string;

  constructor(
    public translate: TranslateService,
    private router: Router
  ) {
    translate.addLangs(['en', 'fr', 'es']);
    translate.setDefaultLang('fr');
    translate.use('fr');
    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr|es/) ? browserLang : 'fr');

    this.langue = this.translate.currentLang;

  }

  public ngOnInit(): void {
    this.translate.get('home.name').subscribe((res: string) => {
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
      { label: adjective, icon: 'pi pi-fw pi-folder', routerLink: '/russian' },
      { label: noun, icon: 'pi pi-fw pi-folder', routerLink: '/russian' },
      { label: training, icon: 'pi pi-fw pi-pencil', routerLink: '/russian' },
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

  public actualise(): boolean {
    if (this.langue !== this.translate.currentLang) {
      this.langue = this.translate.currentLang;
      this.refresh();
    }
    return true;
  }

  public activeMenu(menu: Array<MenuItem>): MenuItem {
    let activeMenu: MenuItem;
    if (menu) {
      activeMenu = menu.find((item) => item.routerLink === this.router.url);
    }
    return menu && activeMenu ? activeMenu : null;
  }

}
