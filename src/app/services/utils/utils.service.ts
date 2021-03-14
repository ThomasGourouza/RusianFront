import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NounEnding } from 'src/app/models/reference/russian/noun-ending.model';

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

  public onKey(key: string, form: FormGroup): void {
    const root = form.value['root'];
    let value: string = '';
    if (key === 'back') {
      if (root.length > 1) {
        value = root.slice(0, -1);
      } 
    } else {
      value = root + key;
    }
    form.controls['root'].setValue(value);
  }
  
}
