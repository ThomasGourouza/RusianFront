import { Component, OnInit } from '@angular/core';
import { Adjective } from 'src/app/models/adjective/get/adjective.model';
import { AdjectiveService } from 'src/app/services/adjective.service';
import { SortEvent } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { AdjectiveCategory } from 'src/app/models/reference/russian/adjective-category.model';
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
export class AdjectiveListComponent implements OnInit {

  public _adjectives: Array<Adjective>;

  public rowSelected: RowData;
  public previousRowSelected: RowData;
  public data: Array<RowData>;
  public cols: Array<string>;


  constructor(
    private adjectiveService: AdjectiveService,
    public translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.cols = [a, t, d];
    this.data = [];
    this.adjectiveService.fetchAdjectives();
    this.adjectiveService.adjectiveList$.subscribe(
      (adjectives) => {
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
    );
  }

  public customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null)
        result = -1;
      else if (value1 != null && value2 == null)
        result = 1;
      else if (value1 == null && value2 == null)
        result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string')
        result = value1.localeCompare(value2);
      else
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;

      return (event.order * result);
    });
  }

  public onRowSelect(): void {
    if (this.previousRowSelected) {
      this.previousRowSelected = this.rowSelected;
      this.previousRowSelected = undefined;
    } else {
      this.previousRowSelected = this.rowSelected;
      this.rowSelected = undefined;
    }
  }

  public adjectiveCategory(rowSelected: RowData): AdjectiveCategory {
    return this._adjectives
    .find((adjective) => adjective.id === rowSelected.id)
    .category;
  }

}
