import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-side',
  templateUrl: './side.component.html',
  styleUrls: ['./side.component.scss']
})
export class SideComponent implements OnInit {

  public items: MenuItem[];

  public langue: string;

  constructor(
    public translate: TranslateService
  ) {

    this.langue = this.translate.currentLang;

    this.translate.get('home.name').subscribe((res: string) => {
      this.refresh();
    });
  }


  ngOnInit(): void {
  }

  public refresh(): void {

    const language = this.translate.instant('navbar.side.language');
    const neww = this.translate.instant('navbar.side.new');
    const project = this.translate.instant('navbar.side.project');
    const other = this.translate.instant('navbar.side.other');
    const open = this.translate.instant('navbar.side.open');
    const quit = this.translate.instant('navbar.side.quit');
    const deletee = this.translate.instant('navbar.side.delete');
    const refresh = this.translate.instant('navbar.side.refresh');
    const edit = this.translate.instant('navbar.menu.edit');

    this.items = [
      {
        label: language,
        items: [{
          label: neww,
          icon: 'pi pi-fw pi-plus',
          items: [
            { label: project},
            { label: other },
          ]
        },
        { label: open },
        { label: quit }
        ]
      },
      {
        label: edit,
        icon: 'pi pi-fw pi-pencil',
        items: [
          { label: deletee, icon: 'pi pi-fw pi-trash' },
          { label: refresh, icon: 'pi pi-fw pi-refresh' }
        ]
      }
    ];

  }

  public actualise(): boolean {
    if (this.langue !== this.translate.currentLang) {
      this.langue = this.translate.currentLang;
      this.refresh();
    }
    return true;
  }

}
