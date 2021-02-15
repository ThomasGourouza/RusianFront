import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { subscribedContainerMixin } from '../subscribed-container.mixin';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { AdjectiveApi } from './api/adjective.api';
import { AdjectivePost } from '../models/adjective/post/adjective-post.model';
import { Adjective } from '../models/adjective/get/adjective.model';
export class AdjTranslationParam {
  constructor(
    public translation: string
  ) { }
}

@Injectable({
  providedIn: 'root'
})
export class AdjectiveService extends subscribedContainerMixin() {

  private _adjective$ = new BehaviorSubject({});
  private _adjectiveList$ = new BehaviorSubject([]);

  constructor(
    private adjectiveApi: AdjectiveApi,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    super();
  }

  public get adjective$() {
    return this._adjective$.asObservable();
  }

  public get adjectiveList$() {
    return this._adjectiveList$.asObservable();
  }

  public clearAdjective() {
    this._adjective$.next({});
  }

  public clearAdjectiveList() {
    this._adjectiveList$.next([]);
  }

  public fetchAdjectives() {
    this.adjectiveApi.getAdjectives()
      .toPromise()
      .then((adjectives: Array<Adjective>) => {
        this._adjectiveList$.next(adjectives);
      })
      .catch((error: HttpErrorResponse) => {
        this.toastr.error(
          this.translate.instant(
            error.status === 404 ? 'toastr.error.message.getAdjective' : 'toastr.error.message.basic'
          ),
          this.translate.instant('toastr.error.title')
        );
      });
  }

  public fetchAdjectiveByTranslation(englishTranslation: string) {
    this.adjectiveApi.getAdjectiveByTranslation(
      new AdjTranslationParam(englishTranslation)
    )
      .toPromise()
      .then((adjectives: Array<Adjective>) => {
        this._adjective$.next(adjectives[0]);
      })
      .catch((error: HttpErrorResponse) => {
        if (error.status === 404) {
          this._adjective$.next({});
        } else {
          this.toastr.error(this.translate.instant('toastr.error.message.basic'), this.translate.instant('toastr.error.title'));
        }
      });
  }

  public fetchAdjectiveById(id: number) {
    this.adjectiveApi.getAdjectiveById(id)
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((adjective: Adjective) => {
        this._adjective$.next(adjective);
        this.toastr.success(
          this.translate.instant('toastr.success.message.getAdjective'),
          this.translate.instant('toastr.success.title')
        );
      }, (error: HttpErrorResponse) => {
        this.toastr.error(
          this.translate.instant(
            error.status === 404 ? 'toastr.error.message.getAdjective' : 'toastr.error.message.basic'
          ),
          this.translate.instant('toastr.error.title')
        );
      });
  }

  public addAdjective(newAdjective: AdjectivePost) {
    this.adjectiveApi.createAdjective(newAdjective).pipe(
      takeUntil(this.destroyed$)
    ).subscribe((adjective: Adjective) => {
      this._adjective$.next(adjective);
      this.toastr.success(
        this.translate.instant('toastr.success.message.postAdjective'),
        this.translate.instant('toastr.success.title')
      );
    }, (error: HttpErrorResponse) => {
      console.log(error);
      this.toastr.error(
        this.translate.instant(
          error.status < 500 ? 'toastr.error.message.postAdjective' : 'toastr.error.message.basic'
        ),
        this.translate.instant('toastr.error.title')
      );
    });
  }

  public updateAdjective(id: number, updatedAdjective: AdjectivePost) {
    this.adjectiveApi.updateAdjective(id, updatedAdjective).pipe(
      takeUntil(this.destroyed$)
    ).subscribe((adjective: Adjective) => {
      this._adjective$.next(adjective);
      this.toastr.success(
        this.translate.instant('toastr.success.message.updateAdjective'),
        this.translate.instant('toastr.success.title')
      );
    }, (error: HttpErrorResponse) => {
      console.log(error);
      this.toastr.error(
        this.translate.instant(
          error.status < 500 ? 'toastr.error.message.updateAdjective' : 'toastr.error.message.basic'
        ),
        this.translate.instant('toastr.error.title')
      );
    });
  }

  public deleteAdjectiveById(id: number) {
    this.adjectiveApi.deleteAdjectiveById(id)
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((response: any) => {
        console.log(response);
        this.clearAdjective();
        this.toastr.success(
          this.translate.instant('toastr.success.message.deleteAdjective'),
          this.translate.instant('toastr.success.title')
        );
      }, (error: HttpErrorResponse) => {
        this.toastr.error(
          this.translate.instant(
            error.status === 404 ? 'toastr.error.message.deleteAdjective' : 'toastr.error.message.basic'
          ),
          this.translate.instant('toastr.error.title')
        );
      });
  }

}

