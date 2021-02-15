import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Adjective } from 'src/app/models/adjective/get/adjective.model';
import { AdjectiveService } from 'src/app/services/adjective.service';
import { TranslateService } from '@ngx-translate/core';
import { ActionMenu } from '../adjectives.component';
import { SortPipe } from 'src/app/pipes/sort.pipe';
export interface RowData {
  adjective: string;
  translation: string;
  declension: number;
  id: number;
}
const a = 'adjective';
const t = 'translation';
const d = 'declension';

@Component({
  selector: 'app-adjective-list',
  templateUrl: './adjective-list.component.html',
  styleUrls: ['./adjective-list.component.scss']
})
// url: adjectives/consult
export class AdjectiveListComponent implements OnInit {

  @Output()
  public openActionMenu: EventEmitter<ActionMenu> = new EventEmitter();

  public _adjectives: Array<Adjective>;
  public data: Array<RowData>;
  public cols: Array<string>;


  constructor(
    private adjectiveService: AdjectiveService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.cols = [a, t, d];
    this.data = [];
    this.adjectiveService.adjectiveList$.subscribe(
      (adjectives) => {
        if (adjectives.length === 0) {
          this.adjectiveService.fetchAdjectives();
          this.adjectiveService.adjectiveList$.subscribe(
            (adjectivesAfterFetch) => {
              this.data = [];
              this.initData(adjectivesAfterFetch);
            }
          );
        } else {
          this.data = [];
          this.initData(adjectives);
        }
      }
    );
  }

  private initData(adjectives: Array<Adjective>): void {
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
    this.openActionMenu.emit({
      show: true,
      rowData: event.data
    });
  }

  public onRowUnselect(): void {
    this.openActionMenu.emit({
      show: false,
      rowData: null
    });
  }

}
