import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SpecificRulePost } from 'src/app/models/noun/post/specific-rule-post.model';
import { Utils } from '../utils/utils.service';

export class NounSpecParam {
  constructor(
    public noun_id: number
  ) { }
}

const API_Noun_Specific_Rule_URL = 'http://localhost:8080/api/v1/noun/specific_rule';

@Injectable({
  providedIn: 'root'
})
export class NounSpecificRuleApi {

  constructor(
    private http: HttpClient,
    private utils: Utils
  ) { }

  public createSpecificRules(specificRules: Array<SpecificRulePost>): Observable<void> {
    return this.http.post<void>(API_Noun_Specific_Rule_URL, specificRules);
  }

  public deleteSpecificRuleByNounAndSpecId(param: NounSpecParam): Observable<void> {
    return this.http.delete<void>(API_Noun_Specific_Rule_URL, {
      observe: 'body',
      params: this.utils.asHttpParam(param)
    });
  }

}
