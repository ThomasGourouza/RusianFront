import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Player } from 'src/app/models/player/get/player.model';
import { PlayerService } from 'src/app/services/player.service';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html'
})
export class LanguageFormComponent extends subscribedContainerMixin() implements OnInit {

  public _player: Player;
  public items: Array<MegaMenuItem>;

  constructor(
    public translate: TranslateService,
    private playerService: PlayerService,
    private authService: AuthService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.playerService.player$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((player: Player) => {
      this._player = player;
      setTimeout(() => {
        this.translate.get('home.name').subscribe(() => {
          this.refresh();
        });
      }, 10);
    });

    // update la langue à chaque changement
    this.translate.onLangChange.subscribe(() => {
      this.refresh();
    });
  }

  public isLanguage(language: string): boolean {
    return this.translate.currentLang === language
  }

  public isAuth(): boolean {
    return this.authService.isAuth;
  }

  public onSignInOut(): void {
    if (this.isAuth()) {
      this.authService.isAuth = false;
      this.router.navigateByUrl('/welcome');
      this.playerService.logout();
    } else {
      this.router.navigateByUrl('/authentification');
    }
  }

  public refresh(): void {
    const titleLogInOut = this.isAuth() ? this.translate.instant('navbar.menu.logout') : this.translate.instant('navbar.menu.login');
    this.items = [
      {
        id: 'player',
        icon: 'pi pi-fw pi-user',
        items: [
          [
            {
              label: this._player.login,
              items: [
                {
                  label: titleLogInOut,
                  icon: 'pi pi-fw pi-power-off',
                  command: () => this.onSignInOut()
                }
              ]
            }
          ]
        ]
      },
      {
        id: 'language',
        icon: 'pi pi-fw pi-globe',
        items: [
          [
            {
              label: this.translate.instant('navbar.language.language'),
              items: []
            }
          ]
        ]
      }
    ];
    this.translate.getLangs().forEach((lang) => {
      this.items.find((item) => item.id === 'language').items[0][0].items.push(
        {
          id: lang,
          label: this.translate.instant('navbar.language.' + lang),
          icon: this.translate.currentLang === lang ? 'pi pi-fw pi-circle-on' : 'pi pi-fw pi-circle-off',
          disabled: this.translate.currentLang === lang,
          command: () => this.translate.use(lang)
        }
      );
    });
    if (this.isAuth()) {
      const basicMenu: Array<MenuItem> = this.items.find((item) => item.id === 'player').items[0][0].items;
      const userMenu: Array<MenuItem> = [
        {
          label: this.translate.instant('navbar.menu.account'),
          icon: 'pi pi-fw pi-id-card',
          command: () => this.router.navigateByUrl('/account')
        },
        {
          label: this.translate.instant('navbar.menu.history'),
          icon: 'pi pi-fw pi-save',
          command: () => this.router.navigateByUrl('/account')
        },
        {
          label: this.translate.instant('navbar.menu.stat'),
          icon: 'pi pi-fw pi-chart-line',
          command: () => this.router.navigateByUrl('/account')
        },
        {
          separator: true
        }
      ];
      this.items.find((item) => item.id === 'player').items[0][0].items = userMenu.concat(basicMenu);
    }
  }

}
