import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { Player } from 'src/app/models/get/player.model';
import { PlayerService } from 'src/app/services/player.service';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.scss']
})
export class LanguageFormComponent extends subscribedContainerMixin() implements OnInit {

  public _player: Player;

  constructor(
    public translate: TranslateService,
    private playerService: PlayerService,
    private authService: AuthService,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.playerService.playerSubject$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((player: Player) => {
      this._player = player;
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

  public titleLogInOut(): string {
    return this.isAuth() ? this.translate.instant('navbar.menu.logout') : this.translate.instant('navbar.menu.login');
  }

}
