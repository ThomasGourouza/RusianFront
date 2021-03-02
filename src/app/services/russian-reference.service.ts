import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RussianReferenceApi } from './api/russian-reference.api';
import { NounCategory } from '../models/reference/russian/noun-category.model';
import { DeclensionName } from '../models/reference/russian/declension-name.model';
import { DeclensionType } from '../models/reference/russian/declension-type.model';
import { InterrogativeWord } from '../models/reference/russian/interrogative-word.model';
import { GrammaticalNumber } from '../models/reference/russian/grammatical-number.model';
import { RussianGender } from '../models/reference/russian/russian-gender.model';
import { RussianCase } from '../models/reference/russian/russian-case.model';
import { RussianRole } from '../models/reference/russian/russian-role.model';
import { AdjectiveCategory } from '../models/reference/russian/adjective-category.model';
export class AnimateNounParam {
  constructor(
    public is_noun_animate: boolean
  ) { }
}


@Injectable({
  providedIn: 'root'
})
export class RussianReferenceService {

  private _declensionNames$ = new BehaviorSubject([]);
  private _declensionTypes$ = new BehaviorSubject([]);
  private _interrogativeWords$ = new BehaviorSubject([]);
  private _grammaticalNumbers$ = new BehaviorSubject([]);
  private _genders$ = new BehaviorSubject([]);
  private _cases$ = new BehaviorSubject([]);
  private _roles$ = new BehaviorSubject([]);
  private _nounCategories$ = new BehaviorSubject([]);
  private _adjectiveCategories$ = new BehaviorSubject([]);

  constructor(
    private russianReferenceApi: RussianReferenceApi
  ) { }

  public get declensionNames$() {
    return this._declensionNames$.asObservable();
  }
  public get declensionTypes$() {
    return this._declensionTypes$.asObservable();
  }
  public get interrogativeWords$() {
    return this._interrogativeWords$.asObservable();
  }
  public get grammaticalNumbers$() {
    return this._grammaticalNumbers$.asObservable();
  }
  public get genders$() {
    return this._genders$.asObservable();
  }
  public get cases$() {
    return this._cases$.asObservable();
  }
  public get roles$() {
    return this._roles$.asObservable();
  }
  public get nounCategoriesInanimate$() {
    return this._nounCategories$.asObservable();
  }
  public get adjectiveCategories$() {
    return this._adjectiveCategories$.asObservable();
  }

  public fetchReferences() {
    this.russianReferenceApi.getDeclensionName()
      .toPromise()
      .then((declensionNames: Array<DeclensionName>) => {
        this._declensionNames$.next(declensionNames);
      });

    this.russianReferenceApi.getDeclensionType()
      .toPromise()
      .then((declensionTypes: Array<DeclensionType>) => {
        this._declensionTypes$.next(declensionTypes);
      });

    this.russianReferenceApi.getInterrogativeWord()
      .toPromise()
      .then((interrogativeWords: Array<InterrogativeWord>) => {
        this._interrogativeWords$.next(interrogativeWords);
      });

    this.russianReferenceApi.getGrammaticalNumber()
      .toPromise()
      .then((grammaticalNumbers: Array<GrammaticalNumber>) => {
        this._grammaticalNumbers$.next(grammaticalNumbers);
      });

    this.russianReferenceApi.getRussianGender()
      .toPromise()
      .then((russianGenders: Array<RussianGender>) => {
        this._genders$.next(russianGenders);
      });

    this.russianReferenceApi.getRussianCase()
      .toPromise()
      .then((russianCases: Array<RussianCase>) => {
        this._cases$.next(russianCases);
      });

    this.russianReferenceApi.getRussianRole()
      .toPromise()
      .then((russianRoles: Array<RussianRole>) => {
        this._roles$.next(russianRoles);
      });

    this.russianReferenceApi.getNounCategory(new AnimateNounParam(false))
      .toPromise()
      .then((nounCategories: Array<NounCategory>) => {
        this._nounCategories$.next(nounCategories);
      });

    this.russianReferenceApi.getAdjectiveCategory()
      .toPromise()
      .then((adjectiveCategories: Array<AdjectiveCategory>) => {
        this._adjectiveCategories$.next(adjectiveCategories);
      });
  }

}
