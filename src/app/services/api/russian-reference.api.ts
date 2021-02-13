import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdjectiveCategory } from 'src/app/models/reference/russian/adjective-category.model';
import { DeclensionName } from 'src/app/models/reference/russian/declension-name.model';
import { DeclensionType } from 'src/app/models/reference/russian/declension-type.model';
import { GrammaticalNumber } from 'src/app/models/reference/russian/grammatical-number.model';
import { InterrogativeWord } from 'src/app/models/reference/russian/interrogative-word.model';
import { NounCategory } from 'src/app/models/reference/russian/noun-category.model';
import { RussianCase } from 'src/app/models/reference/russian/russian-case.model';
import { RussianGender } from 'src/app/models/reference/russian/russian-gender.model';
import { RussianRole } from 'src/app/models/reference/russian/russian-role.model';
import { AnimateNounParam } from '../russian-reference.service';
import { Utils } from '../utils/utils.service';

const API_BASE_URL = 'http://localhost:8080/api/v1/reference/russian/';
const DECLENSIONNAME = 'declension/name';
const DECLENSIONTYPE = 'declension/type';
const INTERROGATIVEWORD = 'interrogative_word';
const GRAMMATICALNUMBER = 'grammatical_number';
const GENDER = 'gender';
const CASE = 'case';
const ROLE = 'role';
const NOUNCATEGORY = 'category/noun_category';
const ADJECTIVECATEGORY = 'category/adjective_category';

@Injectable({
  providedIn: 'root'
})
export class RussianReferenceApi {

  constructor(
    private http: HttpClient,
    private utils: Utils
  ) { }

  public getDeclensionName(): Observable<Array<DeclensionName>> {
    return this.http.get<Array<DeclensionName>>(API_BASE_URL + DECLENSIONNAME);
  }
  public getDeclensionType(): Observable<Array<DeclensionType>> {
    return this.http.get<Array<DeclensionType>>(API_BASE_URL + DECLENSIONTYPE);
  }
  public getInterrogativeWord(): Observable<Array<InterrogativeWord>> {
    return this.http.get<Array<InterrogativeWord>>(API_BASE_URL + INTERROGATIVEWORD);
  }
  public getGrammaticalNumber(): Observable<Array<GrammaticalNumber>> {
    return this.http.get<Array<GrammaticalNumber>>(API_BASE_URL + GRAMMATICALNUMBER);
  }
  public getRussianGender(): Observable<Array<RussianGender>> {
    return this.http.get<Array<RussianGender>>(API_BASE_URL + GENDER);
  }
  public getRussianCase(): Observable<Array<RussianCase>> {
    return this.http.get<Array<RussianCase>>(API_BASE_URL + CASE);
  }
  public getRussianRole(): Observable<Array<RussianRole>> {
    return this.http.get<Array<RussianRole>>(API_BASE_URL + ROLE);
  }
  public getNounCategory(param: AnimateNounParam): Observable<Array<NounCategory>> {
    return this.http.get<Array<NounCategory>>(API_BASE_URL + NOUNCATEGORY, {
      observe: 'body',
      params: this.utils.asHttpParam(param)
    });
  }
  public getAdjectiveCategory(): Observable<Array<AdjectiveCategory>> {
    return this.http.get<Array<AdjectiveCategory>>(API_BASE_URL + ADJECTIVECATEGORY);
  }

}
