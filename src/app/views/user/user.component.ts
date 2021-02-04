import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  public variable: { a: string; b: string } = { a: '', b: '' };

  public langue: string;

  constructor(private translate: TranslateService) {
    this.langue = this.translate.currentLang;
    this.translate.get('user.welcome').subscribe((res: string) => {
      this.refresh();
    });
  }

  ngOnInit(): void {
   

  }

  public refresh(): void {
    this.variable.a = this.translate.instant('user.welcome');
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
