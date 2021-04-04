import { Component, OnInit } from '@angular/core';
import { RussianReferenceService } from './services/russian-reference.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    private russianReferenceService: RussianReferenceService
  ) { }

  public ngOnInit(): void {
    this.russianReferenceService.fetchReferences();
  }

}
