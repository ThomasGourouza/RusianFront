import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { subscribedContainerMixin } from '../subscribed-container.mixin';
import { takeUntil } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { PlayerReferenceApi } from './api/player-reference.api';
import { CountryModel } from '../models/reference/player/country.model';
import { GenderModel } from '../models/reference/player/gender.model';
import { LanguageModel } from '../models/reference/player/language.model';
import { LevelModel } from '../models/reference/player/level.model';
import { ImageModel } from '../models/reference/player/image.model';


@Injectable({
  providedIn: 'root'
})
export class PlayerReferenceService extends subscribedContainerMixin() {

  private _countriesSubject$ = new BehaviorSubject([]);
  private _gendersSubject$ = new BehaviorSubject([]);
  private _imagesSubject$ = new BehaviorSubject([]);
  private _languagesSubject$ = new BehaviorSubject([]);
  private _levelsSubject$ = new BehaviorSubject([]);

  constructor(
    private playerReferenceApi: PlayerReferenceApi
  ) {
    super();
  }

  public get countriesSubject$() {
    return this._countriesSubject$.asObservable();
  }
  public get gendersSubject$() {
    return this._gendersSubject$.asObservable();
  }
  public get imagesSubject$() {
    return this._imagesSubject$.asObservable();
  }
  public get languagesSubject$() {
    return this._languagesSubject$.asObservable();
  }
  public get levelsSubject$() {
    return this._levelsSubject$.asObservable();
  }

  public fetchPlayerReferences() {
    this.playerReferenceApi.getCountry()
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((countries: Array<CountryModel>) => {
        this._countriesSubject$.next(countries);
      });

    this.playerReferenceApi.getGender()
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((genders: Array<GenderModel>) => {
        this._gendersSubject$.next(genders);
      });

    this.playerReferenceApi.getImage()
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((images: Array<ImageModel>) => {
        this._imagesSubject$.next(images);
      });

    this.playerReferenceApi.getLanguage()
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((languages: Array<LanguageModel>) => {
        this._languagesSubject$.next(languages);
      });

    this.playerReferenceApi.getLevel()
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((levels: Array<LevelModel>) => {
        this._levelsSubject$.next(levels);
      });
  }

}
