import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { subscribedContainerMixin } from '../subscribed-container.mixin';
import { takeUntil } from 'rxjs/operators';
import { PlayerReferenceApi } from './api/player-reference.api';
import { Country } from '../models/reference/player/country.model';
import { Gender } from '../models/reference/player/gender.model';
import { Language } from '../models/reference/player/language.model';
import { Level } from '../models/reference/player/level.model';
import { Image } from '../models/reference/player/image.model';


@Injectable({
  providedIn: 'root'
})
export class PlayerReferenceService extends subscribedContainerMixin() {

  private _countries$ = new BehaviorSubject([]);
  private _genders$ = new BehaviorSubject([]);
  private _images$ = new BehaviorSubject([]);
  private _languages$ = new BehaviorSubject([]);
  private _levels$ = new BehaviorSubject([]);

  constructor(
    private playerReferenceApi: PlayerReferenceApi
  ) {
    super();
  }

  public get countries$() {
    return this._countries$.asObservable();
  }
  public get genders$() {
    return this._genders$.asObservable();
  }
  public get images$() {
    return this._images$.asObservable();
  }
  public get languages$() {
    return this._languages$.asObservable();
  }
  public get levels$() {
    return this._levels$.asObservable();
  }

  public fetchReferences() {
    this.playerReferenceApi.getCountry()
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((countries: Array<Country>) => {
        this._countries$.next(countries);
      });

    this.playerReferenceApi.getGender()
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((genders: Array<Gender>) => {
        this._genders$.next(genders);
      });

    this.playerReferenceApi.getImage()
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((images: Array<Image>) => {
        this._images$.next(images);
      });

    this.playerReferenceApi.getLanguage()
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((languages: Array<Language>) => {
        this._languages$.next(languages);
      });

    this.playerReferenceApi.getLevel()
      .pipe(
        takeUntil(
          this.destroyed$
        )
      ).subscribe((levels: Array<Level>) => {
        this._levels$.next(levels);
      });
  }

}
