import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

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

    this.translate.get('home.name').subscribe((res: string) => {
      this.refresh();
    });
  }



  public ngOnInit(): void {

  }

  public refresh(): void {

    const home = this.translate.instant('navbar.menu.home');
    const calendar = this.translate.instant('navbar.menu.calendar');
    const edit = this.translate.instant('navbar.menu.edit');
    const documentation = this.translate.instant('navbar.menu.documentation');
    const settings = this.translate.instant('navbar.menu.settings');
    const language = this.translate.instant('navbar.menu.language');

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
      { label: calendar, icon: 'pi pi-fw pi-calendar' },
      { label: edit, icon: 'pi pi-fw pi-pencil', routerLink: '/user' },
      { label: documentation, icon: 'pi pi-fw pi-file', routerLink: '/russian' },
      { label: settings, icon: 'pi pi-fw pi-cog' },
      { label: language, icon: 'pi pi-fw pi-globe' }
    ];
    this.activeItem = this.menu[0];

    this.items = [
      {
        label: file,
        items: [{
          label: neww,
          icon: 'pi pi-fw pi-plus',
          items: [
            { label: project},
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

}
