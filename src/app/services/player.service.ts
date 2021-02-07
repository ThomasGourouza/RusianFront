import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PlayerApi } from './api/player.api';
import { subscribedContainerMixin } from '../subscribed-container.mixin';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
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
    private toastr: ToastrService
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
      this.toastr.success('Bonjour Cavalier_Fou!', 'Bienvenue!');
    }, (error: HttpErrorResponse) => {
      console.log(error.status);
      this.toastr.error('le login ou mot de passe est incorrect!', 'Attention!');
    })
  }

  public logout() {
    this._playerSubject$.next({});
  }

}
