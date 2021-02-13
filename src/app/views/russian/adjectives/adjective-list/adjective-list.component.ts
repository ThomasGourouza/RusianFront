import { Component, OnInit } from '@angular/core';
import { Adjective } from 'src/app/models/adjective/get/adjective.model';
import { AdjectiveService } from 'src/app/services/adjective.service';
import { TableModule } from 'primeng/table';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-adjective-list',
  templateUrl: './adjective-list.component.html',
  styleUrls: ['./adjective-list.component.scss']
})
export class AdjectiveListComponent implements OnInit {

  public _adjectives: Array<Adjective>;

  public selected: any;

  public cars = [
    { brand: "Volkswagen", year: 2012, color: "White", vin: "dsad231ff" },
    { brand: "Audi", year: 2011, color: "Black", vin: "gwregre345" },
    { brand: "Renault", year: 2005, color: "Gray", vin: "h354htr" },
    { brand: "BMW", year: 2003, color: "Blue", vin: "j6w54qgh" },
    { brand: "Mercedes", year: 1995, color: "White", vin: "hrtwy34" },
    { brand: "Volvo", year: 2005, color: "Black", vin: "jejtyj" },
    { brand: "Honda", year: 2012, color: "Yellow", vin: "g43gr" },
    { brand: "Jaguar", year: 2013, color: "White", vin: "greg34" },
    { brand: "Ford", year: 2000, color: "Black", vin: "h54hw5" },
    { brand: "Fiat", year: 2013, color: "Red", vin: "245t2s" }
  ]

  public cols = [
    { field: 'brand', header: 'Brand' },
    { field: 'year', header: 'Year' },
    { field: 'color', header: 'Color' },
    { field: 'vin', header: 'Vin' }
];


  constructor(
    private adjectiveService: AdjectiveService
  ) { }

  ngOnInit(): void {
    this.adjectiveService.fetchAdjectives();
    this.adjectiveService.adjectiveList$.subscribe(
      (adjectives) => this._adjectives = adjectives
    );
  }

  public voir(): void {
    console.log(this._adjectives);
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

  public onRowSelect(event: any): void {
    console.log(event.data);
  }

  public onRowUnselect(event: any): void {
    console.log(event.data);
  }

}
