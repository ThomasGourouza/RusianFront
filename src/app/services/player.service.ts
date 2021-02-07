import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlayerApi } from './api/player.api';
import { subscribedContainerMixin } from '../subscribed-container.mixin';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Player } from '../models/get/player.model';
import { PlayerPost } from '../models/post/player-post.model';
export class Params {
  constructor(
    public login: string,
    public password: string
  ) { }
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService extends subscribedContainerMixin() {

  private _playerSubject$ = new BehaviorSubject({});

  constructor(
    private playerApi: PlayerApi,
    private authService: AuthService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    super();
  }

  public get playerSubject$() {
    return this._playerSubject$.asObservable();
  }

  public fetchPlayer(params: Params) {
    this.playerApi.getPlayerByLoginAndPassword(
      params
    ).pipe(
      takeUntil(
        this.destroyed$
      )
    ).subscribe((players: Array<Player>) => {
      this._playerSubject$.next(players[0]);
      this.authService.isAuth = true;
      this.toastr.success(
        this.translate.instant('toastr.success.message.auth'),
        this.translate.instant('toastr.success.title')
      );
    }, (error: HttpErrorResponse) => {
      this.toastr.error(
        this.translate.instant(
          error.status === 404 ? 'toastr.error.message.auth' : 'toastr.error.message.basic'
        ),
        this.translate.instant('toastr.error.title')
      );
    });
  }

  public logout() {
    this._playerSubject$.next({});
  }

  public registerPlayer(newPlayer: PlayerPost) {
    this.playerApi.createPlayer(newPlayer).pipe(
      takeUntil(this.destroyed$)
    ).subscribe((player: Player) => {
      this._playerSubject$.next(player);
      this.authService.isAuth = true;
      this.toastr.success(
        this.translate.instant('toastr.success.message.register'),
        this.translate.instant('toastr.success.title')
      );
    }, (error: HttpErrorResponse) => {
      console.log(error);
      this.toastr.error(
        this.translate.instant(
          error.status < 500 ? 'toastr.error.message.register' : 'toastr.error.message.basic'
        ),
        this.translate.instant('toastr.error.title')
      );
    });
  }

}
