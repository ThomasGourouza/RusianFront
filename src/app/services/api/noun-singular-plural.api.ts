import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SingularPluralPost } from 'src/app/models/noun/post/singular-plural-post.model';
import { Utils } from '../utils/utils.service';

export class NounId {
  constructor(
    public noun_id: string
  ) { }
}

const API_Noun_Singular_Plural_URL = 'http://localhost:8080/api/v1/noun/singular_plural';

@Injectable({
  providedIn: 'root'
})
export class NounSingularPluralApi {

  constructor(
    private http: HttpClient,
    private utils: Utils
  ) { }

  public createCouple(singularPluralPost: SingularPluralPost): Observable<void> {
    return this.http.post<void>(API_Noun_Singular_Plural_URL, singularPluralPost);
  }

  public deleteCoupleByNounId(param: NounId): Observable<void> {
    return this.http.delete<void>(API_Noun_Singular_Plural_URL, {
      observe: 'body',
      params: this.utils.asHttpParam(param)
    });
  }

}
