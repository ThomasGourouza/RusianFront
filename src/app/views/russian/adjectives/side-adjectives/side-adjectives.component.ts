import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { PAGE, MN } from '../adjectives.component';

@Component({
  selector: 'app-side-adjectives',
  templateUrl: './side-adjectives.component.html',
  styleUrls: ['./side-adjectives.component.scss']
})
export class SideAdjectivesComponent implements OnInit {

  public items: Array<MenuItem>;
  public langue: string;
  @Input()
  public masculineNominative: MN;
  @Output()
  public openPage: EventEmitter<PAGE> = new EventEmitter();


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
    const first = this.translate.instant('adjectives.side.first') + this.masculineNominative.first;
    const second = this.translate.instant('adjectives.side.second') + this.masculineNominative.second;
    const third = this.translate.instant('adjectives.side.third') + this.masculineNominative.third;
    const fourth = this.translate.instant('adjectives.side.fourth') + this.masculineNominative.fourth;
    const close = this.translate.instant('adjectives.side.close');
    const adjectives = this.translate.instant('adjectives.side.adjectives');
    const consult = this.translate.instant('adjectives.side.consult');
    const add = this.translate.instant('adjectives.side.add');

    this.items = [
      {
        label: declension,
        icon: 'pi pi-fw pi-folder-open',
        items: [{
          label: first,
          icon: 'pi pi-fw pi-file',
          command: () => {
            this.openPage.emit(
              {
                show: true,
                type: 1
              }
            );
          }
        },
        {
          label: second,
          icon: 'pi pi-fw pi-file',
          command: () => {
            this.openPage.emit(
              {
                show: true,
                type: 2
              }
            );
          }
        },
        {
          label: third,
          icon: 'pi pi-fw pi-file',
          command: () => {
            this.openPage.emit(
              {
                show: true,
                type: 3
              }
            );
          }
        },
        {
          label: fourth,
          icon: 'pi pi-fw pi-file',
          command: () => {
            this.openPage.emit(
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
            this.openPage.emit(
              {
                show: false,
                type: 0
              }
            );
          }
        }
        ]
      },
      {
        label: adjectives,
        icon: 'pi pi-fw pi-folder-open',
        items: [{
          label: consult,
          icon: 'pi pi-fw pi-eye',
          command: () => {
            this.openPage.emit(
              {
                show: true,
                type: 5
              }
            );
          }
        },
        {
          label: add,
          icon: 'pi pi-fw pi-plus',
          command: () => {
            this.openPage.emit(
              {
                show: true,
                type: 6
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
            this.openPage.emit(
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
