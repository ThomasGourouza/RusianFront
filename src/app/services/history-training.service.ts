import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
export interface Answer {
  case: string;
  adjective: string;
  noun: string;
  point: number;
}

@Injectable({
  providedIn: 'root'
})
export class HistoryTrainingService {

  private _history: Array<Answer> = [];

  constructor(
    public translate: TranslateService,
  ) { }

  public get history(): Array<Answer> {
    return this._history;
  }

  public addHistory(answer: Answer): void {
    this._history.push(answer);
  }

  public reset(): void {
    this._history = [];
  }

}
