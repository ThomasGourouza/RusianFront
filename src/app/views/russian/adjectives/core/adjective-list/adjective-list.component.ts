import { Component, OnInit } from '@angular/core';
import { Adjective } from 'src/app/models/adjective/get/adjective.model';
import { AdjectiveService } from 'src/app/services/adjective.service';
import { TranslateService } from '@ngx-translate/core';
import { Const } from 'src/app/services/utils/const';
import { AdjectiveListService, RowData } from 'src/app/services/adjective-list.service';

@Component({
  selector: 'app-adjective-list',
  templateUrl: './adjective-list.component.html'
})
// url: adjectives/consult
export class AdjectiveListComponent implements OnInit {

  public _adjectives: Array<Adjective>;
  public data: Array<RowData>;
  public cols: Array<string>;
  public translation: string;

  constructor(
    private adjectiveService: AdjectiveService,
    public translate: TranslateService,
    // private router: Router,
    private adjectiveListService: AdjectiveListService
  ) { }

  ngOnInit(): void {
    this.cols = [Const.adjective, Const.translation, Const.declension];
    this.data = [];
    this.adjectiveService.adjectiveList$.subscribe(
      (adjectives) => {
        if (adjectives.length === 0) {
          this.adjectiveService.fetchAdjectives();
          this.adjectiveService.adjectiveList$.subscribe(
            (adjectivesAfterFetch) => {
              this.initData(adjectivesAfterFetch);
            }
          );
        } else {
          this.initData(adjectives);
        }
      }
    );
    this.onRowUnselect();
  }

  private initData(adjectives: Array<Adjective>): void {
    this.data = [];
    this._adjectives = adjectives;
    this._adjectives.forEach((adjective) => {
      this.data.push({
        adjective: adjective.nominativeMasculineForm,
        translation: adjective.translation,
        declension: adjective.category.id,
        id: adjective.id
      });
    });
  }

  public translateTitle(): string {
    return this.translate.instant('adjectives.adjectives.title')
  }

  public onRowSelect(event: any): void {
    this.adjectiveListService.setRowdata(event.data);
  }

  public onRowUnselect(): void {
    this.adjectiveListService.setRowdata(null);
  }

}
