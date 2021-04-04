import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Const } from 'src/app/services/utils/const';

@Component({
  selector: 'app-noun-not-found',
  templateUrl: './noun-not-found.component.html'
})
export class NounNotFoundComponent implements OnInit {

  public noun: string;

  constructor(
    private activatedRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.noun = this.activatedRoute.snapshot.params[Const.noun];
  }

}
