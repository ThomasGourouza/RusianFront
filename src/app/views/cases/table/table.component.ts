import { Component, Input, OnInit } from '@angular/core';
import { Content, Data, Table } from 'src/app/constants/texts.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input()
  public content: Content;
  @Input()
  public table: Table;
  @Input()
  public russianContent: Data;

  constructor() { }

  ngOnInit(): void {
  }

  public get(id_row: number, id_column: number): string {
    return this.russianContent.tableContent.find(
      (data) => data.id_column === id_column && data.id_row === id_row)
      .value;
  }

}
