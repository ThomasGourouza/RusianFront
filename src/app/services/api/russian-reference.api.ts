import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdjectiveCategoryModel } from 'src/app/models/reference/russian/adjective-category.model';
import { DeclensionNameModel } from 'src/app/models/reference/russian/declension-name.model';
import { DeclensionTypeModel } from 'src/app/models/reference/russian/declension-type.model';
import { GrammaticalNumberModel } from 'src/app/models/reference/russian/grammatical-number.model';
import { InterrogativeWordModel } from 'src/app/models/reference/russian/interrogative-word.model';
import { NounCategoryModel } from 'src/app/models/reference/russian/noun-category.model';
import { RussianCaseModel } from 'src/app/models/reference/russian/russian-case.model';
import { RussianGenderModel } from 'src/app/models/reference/russian/russian-gender.model';
import { RussianRoleModel } from 'src/app/models/reference/russian/russian-role.model';
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

  public getDeclensionName(): Observable<Array<DeclensionNameModel>> {
    return this.http.get<Array<DeclensionNameModel>>(API_BASE_URL + DECLENSIONNAME);
  }
  public getDeclensionType(): Observable<Array<DeclensionTypeModel>> {
    return this.http.get<Array<DeclensionTypeModel>>(API_BASE_URL + DECLENSIONTYPE);
  }
  public getInterrogativeWord(): Observable<Array<InterrogativeWordModel>> {
    return this.http.get<Array<InterrogativeWordModel>>(API_BASE_URL + INTERROGATIVEWORD);
  }
  public getGrammaticalNumber(): Observable<Array<GrammaticalNumberModel>> {
    return this.http.get<Array<GrammaticalNumberModel>>(API_BASE_URL + GRAMMATICALNUMBER);
  }
  public getRussianGender(): Observable<Array<RussianGenderModel>> {
    return this.http.get<Array<RussianGenderModel>>(API_BASE_URL + GENDER);
  }
  public getRussianCase(): Observable<Array<RussianCaseModel>> {
    return this.http.get<Array<RussianCaseModel>>(API_BASE_URL + CASE);
  }
  public getRussianRole(): Observable<Array<RussianRoleModel>> {
    return this.http.get<Array<RussianRoleModel>>(API_BASE_URL + ROLE);
  }
  public getNounCategory(param: AnimateNounParam): Observable<Array<NounCategoryModel>> {
    return this.http.get<Array<NounCategoryModel>>(API_BASE_URL + NOUNCATEGORY, {
      observe: 'body',
      params: this.utils.asHttpParam(param)
    });
  }
  public getAdjectiveCategory(): Observable<Array<AdjectiveCategoryModel>> {
    return this.http.get<Array<AdjectiveCategoryModel>>(API_BASE_URL + ADJECTIVECATEGORY);
  }

}
