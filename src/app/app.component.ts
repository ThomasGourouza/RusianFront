import { Component, OnInit } from '@angular/core';
import { RussianReferenceService } from './services/russian-reference.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    private russianReferenceService: RussianReferenceService,
    private translateService: TranslateService
  ) { }

  public ngOnInit(): void {
    this.translateService.addLangs(['en', 'fr', 'de', 'es', 'ja']);
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');

    this.russianReferenceService.fetchReferences();
  }

}
