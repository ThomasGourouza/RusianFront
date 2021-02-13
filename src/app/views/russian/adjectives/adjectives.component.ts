import { Component, OnInit } from '@angular/core';
export interface DECL {
  show: boolean;
  type: number
}

@Component({
  selector: 'app-adjectives',
  templateUrl: './adjectives.component.html',
  styleUrls: ['./adjectives.component.scss']
})
export class AdjectivesComponent implements OnInit {

  public declension: DECL;
  
  constructor() { }

  ngOnInit(): void {
    this.declension = {
      show: false,
      type: 0
    }
  }

  public onOpenDeclension(decl: DECL): void {
    this.declension = decl;
    console.log(this.declension);
  }

}
