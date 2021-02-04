import { Component, OnInit } from '@angular/core';
import { TextsService, Text, RussianContent, Data } from 'src/app/constants/texts.service';

@Component({
  selector: 'app-cases',
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.scss']
})
export class CasesComponent implements OnInit {

  private language = "french";
  public text: Text;
  public russianContent: RussianContent;

  constructor(private textsService: TextsService) {
    this.text = this.textsService[this.language];
    this.russianContent = this.textsService.russianContent;
  }

  ngOnInit(): void {
  }

  public getRussianContent(id: number): Data {
    const content = this.russianContent.data.find((d) => d.id === id);
    const general = this.russianContent.general.tableContent;
    return {
      id: content.id,
      gender: content.gender,
      tableContent: general.concat(content.tableContent)
    };
  }

  public switch(language: string): void {
    this.text = this.textsService[language];
  }


}

