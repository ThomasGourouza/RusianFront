import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { Answer, HistoryTrainingService } from 'src/app/services/history-training.service';
import { Const } from 'src/app/services/utils/const';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html'
})
export class HistoryComponent implements OnInit {

  public showHistory: boolean;
  private oldCounter: number;
  public history: Array<Answer>;
  public cols: Array<string>;
  public search: string;
  public showConfirm: boolean;

  constructor(
    private historyService: HistoryTrainingService,
    private confirmationService: ConfirmationService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.showConfirm = false;
    this.oldCounter = this.historyService.history.length;
    this.showHistory = true;
    this.cols = [
      Const.case,
      Const.adjective,
      Const.noun,
      Const.point
    ];
    this.history = this.historyService.history;
  }

  private refreshHistory(): void {
    setTimeout(() => {
      this.showHistory = false;
      setTimeout(() => {
        this.showHistory = true;
      }, 10);
    }, 10);
  }

  public onResetHistory(): void {
    this.showConfirm = true;
    this.confirmationService.confirm({
      message: this.translate.instant('training.confirm.message'),
      accept: () => {
        this.historyService.reset();
        this.history = this.historyService.history;
      }
    });
  }

  public getTranslated(word: string): string {
    return this.translate.instant('training.confirm.' + word);
  }

  public getCounter(): number {
    const counter = this.historyService.history.length;
    if (counter !== this.oldCounter && counter > 5 && counter % 5 === 1) {
      this.oldCounter = counter;
      this.refreshHistory();
    }
    return counter;
  }

  public getPoints(): number {
    let points = 0;
    this.historyService.history
      .map((answer) => answer.point)
      .forEach((point) => {
        points += point;
      });
    return points;
  }

}
