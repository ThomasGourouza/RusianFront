import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { subscribedContainerMixin } from '../subscribed-container.mixin';
import { takeUntil } from 'rxjs/operators';
import { RussianReferenceApi } from './api/russian-reference.api';
import { NounCategoryModel } from '../models/reference/russian/noun-category.model';
import { DeclensionNameModel } from '../models/reference/russian/declension-name.model';
import { DeclensionTypeModel } from '../models/reference/russian/declension-type.model';
import { InterrogativeWordModel } from '../models/reference/russian/interrogative-word.model';
import { GrammaticalNumberModel } from '../models/reference/russian/grammatical-number.model';
import { RussianGenderModel } from '../models/reference/russian/russian-gender.model';
import { RussianCaseModel } from '../models/reference/russian/russian-case.model';
import { RussianRoleModel } from '../models/reference/russian/russian-role.model';
import { AdjectiveCategoryModel } from '../models/reference/russian/adjective-category.model';
export class AnimateNounParam {
  constructor(
    public is_noun_animate: boolean
  ) { }
}


@Injectable({
  providedIn: 'root'
})
export class RussianReferenceService extends subscribedContainerMixin() {

  private _declensionNamesSubject$ = new BehaviorSubject([]);
  private _declensionTypesSubject$ = new BehaviorSubject([]);
  private _interrogativeWordsSubject$ = new BehaviorSubject([]);
  private _grammaticalNumbersSubject$ = new BehaviorSubject([]);
  private _gendersSubject$ = new BehaviorSubject([]);
  private _casesSubject$ = new BehaviorSubject([]);
  private _rolesSubject$ = new BehaviorSubject([]);
  private _nounCategoriesInanimateSubject$ = new BehaviorSubject([]);
  private _nounCategoriesAnimateSubject$ = new BehaviorSubject([]);
  private _adjectiveCategoriesSubject$ = new BehaviorSubject([]);

  constructor(
    private russianReferenceApi: RussianReferenceApi
  ) {
    super();
  }

  public get declensionNamesSubject$() {
    return this._declensionNamesSubject$.asObservable();
  }
  public get declensionTypesSubject$() {
    return this._declensionTypesSubject$.asObservable();
  }
  public get interrogativeWordsSubject$() {
    return this._interrogativeWordsSubject$.asObservable();
  }
  public get grammaticalNumbersSubject$() {
    return this._grammaticalNumbersSubject$.asObservable();
  }
  public get gendersSubject$() {
    return this._gendersSubject$.asObservable();
  }
  public get casesSubject$() {
    return this._casesSubject$.asObservable();
  }
  public get rolesSubject$() {
    return this._rolesSubject$.asObservable();
  }
  public get nounCategoriesInanimateSubject$() {
    return this._nounCategoriesInanimateSubject$.asObservable();
  }
  public get nounCategoriesAnimateSubject$() {
    return this._nounCategoriesAnimateSubject$.asObservable();
  }
  public get adjectiveCategoriesSubject$() {
    return this._adjectiveCategoriesSubject$.asObservable();
  }

  public fetchReferences() {
    this.russianReferenceApi.getDeclensionName()
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((declensionNames: Array<DeclensionNameModel>) => {
        this._declensionNamesSubject$.next(declensionNames);
      });

      this.russianReferenceApi.getDeclensionType()
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((declensionTypes: Array<DeclensionTypeModel>) => {
        this._declensionTypesSubject$.next(declensionTypes);
      });

      this.russianReferenceApi.getInterrogativeWord()
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((interrogativeWords: Array<InterrogativeWordModel>) => {
        this._interrogativeWordsSubject$.next(interrogativeWords);
      });

      this.russianReferenceApi.getGrammaticalNumber()
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((grammaticalNumbers: Array<GrammaticalNumberModel>) => {
        this._grammaticalNumbersSubject$.next(grammaticalNumbers);
      });

      this.russianReferenceApi.getRussianGender()
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((russianGenders: Array<RussianGenderModel>) => {
        this._gendersSubject$.next(russianGenders);
      });

      this.russianReferenceApi.getRussianCase()
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((russianCases: Array<RussianCaseModel>) => {
        this._casesSubject$.next(russianCases);
      });

      this.russianReferenceApi.getRussianRole()
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((russianRoles: Array<RussianRoleModel>) => {
        this._rolesSubject$.next(russianRoles);
      });

      this.russianReferenceApi.getNounCategory(new AnimateNounParam(false))
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((nounCategories: Array<NounCategoryModel>) => {
        this._nounCategoriesInanimateSubject$.next(nounCategories);
      });

      this.russianReferenceApi.getNounCategory(new AnimateNounParam(true))
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((nounCategories: Array<NounCategoryModel>) => {
        this._nounCategoriesAnimateSubject$.next(nounCategories);
      });

      this.russianReferenceApi.getAdjectiveCategory()
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((adjectiveCategories: Array<AdjectiveCategoryModel>) => {
        this._adjectiveCategoriesSubject$.next(adjectiveCategories);
      });
  }

}
