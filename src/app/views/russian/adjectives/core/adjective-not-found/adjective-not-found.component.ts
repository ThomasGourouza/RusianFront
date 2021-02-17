import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
const A = 'adjective';

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
    this.adjective = this.activatedRoute.snapshot.params[A];
  }

}
