import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CountryModel } from 'src/app/models/reference/player/country.model';
import { GenderModel } from 'src/app/models/reference/player/gender.model';
import { ImageModel } from 'src/app/models/reference/player/image.model';
import { LanguageModel } from 'src/app/models/reference/player/language.model';
import { LevelModel } from 'src/app/models/reference/player/level.model';

const API_BASE_URL = 'http://localhost:8080/api/v1/reference/player/';
const COUNTRY = 'country';
const GENDER = 'gender';
const IMAGE = 'image';
const LANGUAGE = 'language';
const LEVEL= 'language/level';


@Injectable({
  providedIn: 'root'
})
export class PlayerReferenceApi {

  constructor(private http: HttpClient) { }

  public getCountry(): Observable<Array<CountryModel>> {
    return this.http.get<Array<CountryModel>>(API_BASE_URL + COUNTRY);
  }
  public getGender(): Observable<Array<GenderModel>> {
    return this.http.get<Array<GenderModel>>(API_BASE_URL + GENDER);
  }
  public getImage(): Observable<Array<ImageModel>> {
    return this.http.get<Array<ImageModel>>(API_BASE_URL + IMAGE);
  }
  public getLanguage(): Observable<Array<LanguageModel>> {
    return this.http.get<Array<LanguageModel>>(API_BASE_URL + LANGUAGE);
  }
  public getLevel(): Observable<Array<LevelModel>> {
    return this.http.get<Array<LevelModel>>(API_BASE_URL + LEVEL);
  }
  
}
