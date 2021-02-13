import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Country } from 'src/app/models/reference/player/country.model';
import { Gender } from 'src/app/models/reference/player/gender.model';
import { Image } from 'src/app/models/reference/player/image.model';
import { Language } from 'src/app/models/reference/player/language.model';
import { Level } from 'src/app/models/reference/player/level.model';

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

  public getCountry(): Observable<Array<Country>> {
    return this.http.get<Array<Country>>(API_BASE_URL + COUNTRY);
  }
  public getGender(): Observable<Array<Gender>> {
    return this.http.get<Array<Gender>>(API_BASE_URL + GENDER);
  }
  public getImage(): Observable<Array<Image>> {
    return this.http.get<Array<Image>>(API_BASE_URL + IMAGE);
  }
  public getLanguage(): Observable<Array<Language>> {
    return this.http.get<Array<Language>>(API_BASE_URL + LANGUAGE);
  }
  public getLevel(): Observable<Array<Level>> {
    return this.http.get<Array<Level>>(API_BASE_URL + LEVEL);
  }
  
}
