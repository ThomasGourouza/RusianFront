import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Adjective } from 'src/app/models/adjective/get/adjective.model';
import { AdjectivePost } from 'src/app/models/adjective/post/adjective-post.model';
import { AdjTranslationParam } from '../adjective.service';
import { Utils } from '../utils/utils.service';

const API_Adjective_URL = 'http://localhost:8080/api/v1/adjective';

@Injectable({
  providedIn: 'root'
})
export class AdjectiveApi {

  constructor(
    private http: HttpClient,
    private utils: Utils
  ) { }

  public createAdjective(adjective: AdjectivePost): Observable<Adjective> {
    return this.http.post<Adjective>(API_Adjective_URL, adjective);
  }

  public getAdjectives(): Observable<Array<Adjective>> {
    return this.http.get<Array<Adjective>>(API_Adjective_URL);
  }

  public getAdjectiveById(id: number): Observable<Adjective> {
    return this.http.get<Adjective>(API_Adjective_URL + '/' + id);
  }

  public getAdjectiveByTranslation(param: AdjTranslationParam): Observable<Array<Adjective>> {
    return this.http.get<Array<Adjective>>(API_Adjective_URL, {
      observe: 'body',
      params: this.utils.asHttpParam(param)
    });
  }

  public updateAdjective(id: number, adjective: AdjectivePost): Observable<Adjective> {
    return this.http.put<Adjective>(API_Adjective_URL + '/' + id, adjective);
  }

  public deleteAdjectiveById(id: number): Observable<void> {
    return this.http.delete<void>(API_Adjective_URL + '/' + id);
  }
}
