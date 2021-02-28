import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlayerApi } from './api/player.api';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Player } from '../models/player/get/player.model';
import { PlayerPost } from '../models/player/post/player-post.model';
export class SignInParams {
  constructor(
    public login: string,
    public password: string
  ) { }
}

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private _player$ = new BehaviorSubject({});

  constructor(
    private playerApi: PlayerApi,
    private authService: AuthService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }

  public get player$() {
    return this._player$.asObservable();
  }

  public fetchPlayer(params: SignInParams) {
    this.playerApi.getPlayerByLoginAndPassword(
      params
    ).toPromise()
      .then((players: Array<Player>) => {
        this._player$.next(players[0]);
        this.authService.isAuth = true;
        this.toastr.success(
          this.translate.instant('toastr.success.message.auth'),
          this.translate.instant('toastr.success.title')
        );
      })
      .catch((error: HttpErrorResponse) => {
        this.toastr.error(
          this.translate.instant(
            error.status === 404 ? 'toastr.error.message.auth' : 'toastr.error.message.basic'
          ),
          this.translate.instant('toastr.error.title')
        );
      });
  }

  public logout() {
    this._player$.next({});
  }

  public registerPlayer(newPlayer: PlayerPost) {
    this.playerApi.createPlayer(newPlayer)
      .toPromise()
      .then((player: Player) => {
        this._player$.next(player);
        this.authService.isAuth = true;
        this.toastr.success(
          this.translate.instant('toastr.success.message.register'),
          this.translate.instant('toastr.success.title')
        );
      })
      .catch((error: HttpErrorResponse) => {
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
