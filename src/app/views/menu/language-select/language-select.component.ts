import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MegaMenuItem } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Player } from 'src/app/models/player/get/player.model';
import { PlayerService } from 'src/app/services/player.service';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.scss']
})
export class LanguageFormComponent extends subscribedContainerMixin() implements OnInit {

  public _player: Player;
  public items: MegaMenuItem[];
  public langue: string;

  constructor(
    public translate: TranslateService,
    private playerService: PlayerService,
    private authService: AuthService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.langue = this.translate.currentLang;
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
      this.router.navigate(['/welcome']);
      this.playerService.logout();
    } else {
      this.router.navigate(['/authentification']);
    }
  }

  public refresh(): void {
    const titleLogInOut = this.isAuth() ? this.translate.instant('navbar.menu.logout') : this.translate.instant('navbar.menu.login');
    this.items = [
      {
        id: 'player',
        label: this._player.login,
        icon: 'pi pi-fw pi-user',
        items: [
          [
            {
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
        label: this.translate.instant('navbar.language.language'),
        icon: 'pi pi-fw pi-comment',
        items: [
          [
            {
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
          icon: this.translate.currentLang === lang ? 'pi pi-fw pi-check-circle' : 'pi pi-fw pi-circle-off',
          disabled: this.translate.currentLang === lang,
          command: () => this.translate.use(lang)
        }
      );
    });
    if (this.isAuth()) {
      this.items[0].items[0][0].items.unshift(
        {
          label: this.translate.instant('navbar.menu.account'),
          icon: 'pi pi-fw pi-id-card',
          command: () => this.router.navigate(['/account'])
        }
      );
    }
  }

  public actualise(): boolean {
    if (this.langue !== this.translate.currentLang) {
      this.langue = this.translate.currentLang;
      this.refresh();
    }
    return true;
  }

}
