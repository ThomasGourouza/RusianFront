import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  public variable: { a: string; b: string } = { a: '', b: '' };

  public langue: string;

  constructor(private translate: TranslateService) {
    this.langue = this.translate.currentLang;
    this.translate.get('account.welcome').subscribe((res: string) => {
      this.refresh();
    });
  }

  ngOnInit(): void {
   

  }

  public refresh(): void {
    this.variable.a = this.translate.instant('account.welcome');
    this.variable.b = this.translate.instant('home.title');
  }


  public actualise(): boolean {
    if (this.langue !== this.translate.currentLang) {
      this.langue = this.translate.currentLang;
      this.refresh();
    }
    return true;
  }

}
