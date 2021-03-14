import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Noun } from 'src/app/models/noun/get/noun.model';
import { NounPost } from 'src/app/models/noun/post/noun-post.model';
import { NounTranslationParam } from '../noun.service';
import { Utils } from '../utils/utils.service';

const API_Noun_URL = 'http://localhost:8080/api/v1/noun';

@Injectable({
  providedIn: 'root'
})
export class NounApi {

  constructor(
    private http: HttpClient,
    private utils: Utils
  ) { }

  public createNoun(noun: NounPost): Observable<Noun> {
    return this.http.post<Noun>(API_Noun_URL, noun);
  }

  public getNouns(): Observable<Array<Noun>> {
    return this.http.get<Array<Noun>>(API_Noun_URL);
  }

  public getNounById(id: number): Observable<Noun> {
    return this.http.get<Noun>(API_Noun_URL + '/' + id);
  }

  public getNounByTranslation(param: NounTranslationParam): Observable<Array<Noun>> {
    return this.http.get<Array<Noun>>(API_Noun_URL, {
      observe: 'body',
      params: this.utils.asHttpParam(param)
    });
  }

  public updateNoun(id: number, noun: NounPost): Observable<Noun> {
    return this.http.put<Noun>(API_Noun_URL + '/' + id, noun);
  }

  public deleteNounById(id: number): Observable<void> {
    return this.http.delete<void>(API_Noun_URL + '/' + id);
  }
}
