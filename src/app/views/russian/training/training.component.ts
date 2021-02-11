import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-russian',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit {

  public items: MenuItem[];

  constructor(public translate: TranslateService) { 
    this.translate.get('home.name').subscribe((res: string) => {

    this.items = [
      {
        label: this.translate.instant('navbar.side.file'),
        items: [{
          label: 'new',
          icon: 'pi pi-fw pi-plus',
          items: [
            { label: 'project'},
            { label: 'other' },
          ]
        },
        { label: 'open' },
        { label: 'quit' }
        ]
      },
      {
        label: 'edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          { label: 'delete', icon: 'pi pi-fw pi-trash' },
          { label: 'refresh', icon: 'pi pi-fw pi-refresh' }
        ]
      }
    ];

  });
  }

  ngOnInit(): void {
  }

}
