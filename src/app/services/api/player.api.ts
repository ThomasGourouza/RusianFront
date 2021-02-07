import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../../models/player.model';
import { Params } from '../player.service';

const API_PLAYER_URL = 'http://localhost:8080/api/v1/player';

@Injectable({
  providedIn: 'root'
})
export class PlayerApi {

  constructor(private http: HttpClient) { }

  private asHttpParam(object: any): HttpParams {
    let httpParams = new HttpParams();
    for(const param in object) {
      httpParams = httpParams.set(param, object[param]);
    }
    return httpParams;
  }

  public register(player: Player): Observable<any> {
    return this.http.post(API_PLAYER_URL, player);
  }

  public getPlayerByLoginAndPassword(params: Params): Observable<any> {
    return this.http.get<Array<any>>(API_PLAYER_URL , {
      observe: 'body',
      params: this.asHttpParam(params)
    });
  }
}
