import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlayerPost } from 'src/app/models/post/player-post.model';
import { Player } from '../../models/get/player.model';
import { SignInParams } from '../player.service';
import { Utils } from '../utils/utils.service';

const API_PLAYER_URL = 'http://localhost:8080/api/v1/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerApi {

  constructor(
    private http: HttpClient,
    private utils: Utils
  ) { }

  public createPlayer(player: PlayerPost): Observable<Player> {
    return this.http.post<Player>(API_PLAYER_URL, player);
  }

  public getPlayerByLoginAndPassword(params: SignInParams): Observable<Array<Player>> {
    return this.http.get<Array<Player>>(API_PLAYER_URL, {
      observe: 'body',
      params: this.utils.asHttpParam(params)
    });
  }
}
