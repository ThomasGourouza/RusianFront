import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { Noun } from '../models/noun/get/noun.model';
import { NounPost } from '../models/noun/post/noun-post.model';
import { SingularPluralPost } from '../models/noun/post/singular-plural-post.model';
import { SpecificRulePost } from '../models/noun/post/specific-rule-post.model';
import { NounSingularPluralApi } from './api/noun-singular-plural.api';
import { NounSpecificRuleApi, NounSpecParam } from './api/noun-specific-rule.api';
import { NounApi } from './api/noun.api';

export class NounTranslationParam {
  constructor(
    public translation: string
  ) { }
}

@Injectable({
  providedIn: 'root'
})
export class NounService {

  private _noun$ = new BehaviorSubject({});
  private _nounPlural$ = new BehaviorSubject({});
  private _nounList$ = new BehaviorSubject([]);

  constructor(
    private nounApi: NounApi,
    private nounSpecificRuleApi: NounSpecificRuleApi,
    private nounSingularPluralApi: NounSingularPluralApi,
    private toastr: ToastrService,
    private translate: TranslateService
  ) { }

  public get noun$() {
    return this._noun$.asObservable();
  }

  public get nounPlural$() {
    return this._nounPlural$.asObservable();
  }

  public get nounList$() {
    return this._nounList$.asObservable();
  }

  public clearNoun() {
    this._noun$.next({});
  }

  public clearNounPlural() {
    this._nounPlural$.next({});
  }

  public clearNounList() {
    this._nounList$.next([]);
  }

  public fetchNouns() {
    this.nounApi.getNouns()
      .toPromise()
      .then((nouns: Array<Noun>) => {
        this._nounList$.next(nouns);
      })
      .catch((error: HttpErrorResponse) => {
        this.toastr.error(
          this.translate.instant(
            error.status === 404 ? 'toastr.error.message.getNoun' : 'toastr.error.message.basic'
          ),
          this.translate.instant('toastr.error.title')
        );
      });
  }

  public fetchNounByTranslation(englishTranslation: string) {
    this.nounApi.getNounByTranslation(
      new NounTranslationParam(englishTranslation)
    )
      .toPromise()
      .then((nouns: Array<Noun>) => {
        this._noun$.next(nouns[0]);
      })
      .catch((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this._noun$.next({});
        } else {
          this.toastr.error(this.translate.instant('toastr.error.message.basic'), this.translate.instant('toastr.error.title'));
        }
      });
  }

  public fetchNounPluralById(id: number) {
    this.nounApi.getNounById(id)
      .toPromise()
      .then((nounPlural: Noun) => {
        this._nounPlural$.next(nounPlural);
      })
      .catch((error: HttpErrorResponse) => {
        this.toastr.error(
          this.translate.instant(
            error.status === 404 ? 'toastr.error.message.getNoun' : 'toastr.error.message.basic'
          ),
          this.translate.instant('toastr.error.title')
        );
      });
  }

  public addNoun(newNoun: NounPost) {
    this.nounApi.createNoun(newNoun)
      .toPromise()
      .then((noun: Noun) => {
        this.fetchNouns();
        this._noun$.next(noun);
        this.toastr.success(
          this.translate.instant('toastr.success.message.postNoun'),
          this.translate.instant('toastr.success.title')
        );
      })
      .catch((error: HttpErrorResponse) => {
        console.log(error);
        this.toastr.error(
          this.translate.instant(
            error.status < 500 ? 'toastr.error.message.postNoun' : 'toastr.error.message.basic'
          ),
          this.translate.instant('toastr.error.title')
        );
      });
  }

  public updateNoun(id: number, updatedNoun: NounPost) {
    this.nounApi.updateNoun(id, updatedNoun)
      .toPromise()
      .then((noun: Noun) => {
        this.fetchNouns();
        this._noun$.next(noun);
        this.toastr.success(
          this.translate.instant('toastr.success.message.updateNoun'),
          this.translate.instant('toastr.success.title')
        );
      })
      .catch((error: HttpErrorResponse) => {
        console.log(error);
        this.toastr.error(
          this.translate.instant(
            error.status < 500 ? 'toastr.error.message.updateNoun' : 'toastr.error.message.basic'
          ),
          this.translate.instant('toastr.error.title')
        );
      });
  }

  public deleteNounById(id: number) {
    this.nounApi.deleteNounById(id)
      .toPromise()
      .then(() => {
        this.fetchNouns();
        this.toastr.success(
          this.translate.instant('toastr.success.message.deleteNoun'),
          this.translate.instant('toastr.success.title')
        );
      })
      .catch((error: HttpErrorResponse) => {
        this.toastr.error(
          this.translate.instant(
            error.status === 404 ? 'toastr.error.message.deleteNoun' : 'toastr.error.message.basic'
          ),
          this.translate.instant('toastr.error.title')
        );
      });
  }

  public removeException(param: NounSpecParam) {
    this.nounSpecificRuleApi.deleteSpecificRuleByNounAndSpecId(param)
      .toPromise()
      .then(() => {
        this.fetchNouns();
      })
      .catch((error: HttpErrorResponse) => {
        if (error.status !== 404) {
          this.toastr.error(
            this.translate.instant('toastr.error.message.basic'),
            this.translate.instant('toastr.error.title')
          );
        }
      });
  }

  public addException(specificRule: SpecificRulePost) {
    this.nounSpecificRuleApi.createSpecificRule(specificRule)
      .toPromise()
      .then(() => {
        this.fetchNouns();
      })
      .catch((error: HttpErrorResponse) => {
        this.toastr.error(
          this.translate.instant(
            error.status === 404 ? 'toastr.error.message.deleteNoun' : 'toastr.error.message.basic'
          ),
          this.translate.instant('toastr.error.title')
        );
      });
  }

  public addCouple(singularPluralPost: SingularPluralPost) {
    this.nounSingularPluralApi.createCouple(singularPluralPost)
      .toPromise()
      .then(() => {
        this.fetchNouns();
      })
      .catch((error: HttpErrorResponse) => {
        this.toastr.error(
          this.translate.instant(
            error.status === 404 ? 'toastr.error.message.deleteNoun' : 'toastr.error.message.basic'
          ),
          this.translate.instant('toastr.error.title')
        );
      });
  }

}
