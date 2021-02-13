import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { DECL } from '../adjectives.component';

@Component({
  selector: 'app-side-adjectives',
  templateUrl: './side-adjectives.component.html',
  styleUrls: ['./side-adjectives.component.scss']
})
export class SideAdjectivesComponent implements OnInit {

  public items: Array<MenuItem>;
  public langue: string;
  @Output()
  public openDeclension: EventEmitter<DECL> = new EventEmitter();


  constructor(
    public translate: TranslateService
  ) {
    this.langue = this.translate.currentLang;
  }


  ngOnInit(): void {
    this.translate.get('home.name').subscribe(() => {
      this.refresh();
    });
  }

  public refresh(): void {
    const declension = this.translate.instant('adjectives.side.declension');
    const firstType = this.translate.instant('adjectives.side.firstType');
    const secondType = this.translate.instant('adjectives.side.secondType');
    const thirdType = this.translate.instant('adjectives.side.thirdType');
    const fourthType = this.translate.instant('adjectives.side.fourthType');
    const close = this.translate.instant('adjectives.side.close');

    this.items = [
      {
        label: declension,
        icon: 'pi pi-fw pi-folder-open',
        items: [{
          label: firstType,
          icon: 'pi pi-fw pi-file',
          command: () => {
            this.openDeclension.emit(
              {
                show: true,
                type: 1
              }
            );
          }
        },
        {
          label: secondType,
          icon: 'pi pi-fw pi-file',
          command: () => {
            this.openDeclension.emit(
              {
                show: true,
                type: 2
              }
            );
          }
        },
        {
          label: thirdType,
          icon: 'pi pi-fw pi-file',
          command: () => {
            this.openDeclension.emit(
              {
                show: true,
                type: 3
              }
            );
          }
        },
        {
          label: fourthType,
          icon: 'pi pi-fw pi-file',
          command: () => {
            this.openDeclension.emit(
              {
                show: true,
                type: 4
              }
            );
          }
        },
        {
          separator: true
        },
        {
          label: close,
          icon: 'pi pi-times',
          command: () => {
            this.openDeclension.emit(
              {
                show: false,
                type: 0
              }
            );
          }
        }
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
