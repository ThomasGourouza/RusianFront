import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Utils {

  constructor() { }

  public asHttpParam(object: any): HttpParams {
    let httpParams = new HttpParams();
    for(const param in object) {
      httpParams = httpParams.set(param, object[param]);
    }
    return httpParams;
  }
}
