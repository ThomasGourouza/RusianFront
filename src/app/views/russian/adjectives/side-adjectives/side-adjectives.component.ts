import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TreeNode } from 'primeng/api';
import { SideMenu, MN } from '../adjectives.component';
const C = 'category';
const A = 'adjective';
const CSLT = 'consult';
const ADD = 'add';

@Component({
  selector: 'app-side-adjectives',
  templateUrl: './side-adjectives.component.html',
  styleUrls: ['./side-adjectives.component.scss']
})
export class SideAdjectivesComponent implements OnInit {

  @Input()
  public masculineNominative: MN;
  @Output()
  public openPage: EventEmitter<SideMenu> = new EventEmitter();

  public files: Array<TreeNode>;
  public langue: string;


  constructor(
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute
  ) { }


  ngOnInit(): void {
    this.langue = this.translate.currentLang;
    this.translate.get('home.name').subscribe(() => {
      this.refresh();
    });
  }

  nodeSelect(event: any) {
    this.openPage.emit({
      show: (event.node.data != 0),
      type: event.node.data
    });
  }

  public refresh(): void {
    const intro = this.translate.instant('adjectives.side.intro');
    const declension = this.translate.instant('adjectives.side.declension');
    const first = this.translate.instant('adjectives.side.first') + this.masculineNominative.first;
    const second = this.translate.instant('adjectives.side.second') + this.masculineNominative.second;
    const third = this.translate.instant('adjectives.side.third') + this.masculineNominative.third;
    const fourth = this.translate.instant('adjectives.side.fourth') + this.masculineNominative.fourth;
    const adjectives = this.translate.instant('adjectives.side.adjectives');
    const consult = this.translate.instant('adjectives.side.consult');
    const add = this.translate.instant('adjectives.side.add');

    this.files = [
      {
        label: intro,
        icon: "pi pi-paperclip",
        selectable: true,
        data: 0
      },
      {
        label: declension,
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
        selectable: false,
        expanded: this.activatedRoute.snapshot.params[C]
          && ![CSLT, ADD].includes(this.activatedRoute.snapshot.params[C]),
        children: [
          {
            label: first,
            icon: 'pi pi-fw pi-file',
            selectable: true,
            data: 1
          },
          {
            label: second,
            icon: 'pi pi-fw pi-file',
            selectable: true,
            data: 2
          },
          {
            label: third,
            icon: 'pi pi-fw pi-file',
            selectable: true,
            data: 3
          },
          {
            label: fourth,
            icon: 'pi pi-fw pi-file',
            selectable: true,
            data: 4
          }
        ]
      },
      {
        label: adjectives,
        expandedIcon: "pi pi-folder-open",
        collapsedIcon: "pi pi-folder",
        selectable: false,
        expanded: this.activatedRoute.snapshot.params[A]
          || [CSLT, ADD].includes(this.activatedRoute.snapshot.params[C]),
        children: [{
          label: consult,
          icon: 'pi pi-fw pi-eye',
          selectable: true,
          data: 5
        },
        {
          label: add,
          icon: 'pi pi-fw pi-plus',
          selectable: true,
          data: 6
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
