import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Const } from 'src/app/services/utils/const';

@Component({
  selector: 'app-adjective-not-found',
  templateUrl: './adjective-not-found.component.html',
  styleUrls: ['./adjective-not-found.component.scss']
})
export class AdjectiveNotFoundComponent implements OnInit {

  public adjective: string;

  constructor(
    private activatedRoute: ActivatedRoute,

  ) { }

  ngOnInit(): void {
    this.adjective = this.activatedRoute.snapshot.params[Const.adjective];
  }

}
