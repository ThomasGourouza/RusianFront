import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlayerApi } from './api/player.api';
import { subscribedContainerMixin } from '../subscribed-container.mixin';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
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
    private authService: AuthService
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
    ).subscribe((players: Array<any>) => {
      this._playerSubject$.next(players[0]);
      this.authService.isAuth = true;
    }, (error: HttpErrorResponse) => {
      console.log(error.status);
      alert('le login ou mot de passe est incorrect!');
    })
  }

  public logout() {
    this._playerSubject$.next({});
  }

}
