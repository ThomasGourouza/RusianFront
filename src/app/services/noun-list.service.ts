import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
export interface RowData {
  noun: string;
  translation: string;
  declension: number;
  id: number;
  animate: boolean;
  singularPluralId: number;
}
@Injectable({
  providedIn: 'root'
})
export class NounListService {

  // selected row
  private _rowData$ = new BehaviorSubject<RowData>(null);

  constructor( ) { }

  public get rowData$(): Observable<RowData> {
    return this._rowData$.asObservable();
  }

  public setRowdata(selection: RowData): void {
    this._rowData$.next(selection);
  }
}
