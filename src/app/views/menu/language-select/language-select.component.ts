import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.scss']
})
export class LanguageFormComponent {

  constructor(
    public translate: TranslateService
  ) { }

  public isLanguage(language: string): boolean {
    return this.translate.currentLang === language
  }

}
