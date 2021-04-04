import { Component, OnInit } from '@angular/core';
import { Noun } from 'src/app/models/noun/get/noun.model';
import { NounService } from 'src/app/services/noun.service';
import { TranslateService } from '@ngx-translate/core';
import { Const } from 'src/app/services/utils/const';
import { NounListService, RowData } from 'src/app/services/noun-list.service';

@Component({
  selector: 'app-noun-list',
  templateUrl: './noun-list.component.html'
})
// url: noun/consult
export class NounListComponent implements OnInit {

  public _nouns: Array<Noun>;
  public data: Array<RowData>;
  public cols: Array<string>;
  public translation: string;

  constructor(
    private nounService: NounService,
    public translate: TranslateService,
    private nounListService: NounListService
  ) { }

  ngOnInit(): void {
    this.cols = [Const.noun, Const.translation, Const.declension];
    this.data = [];
    this.nounService.nounList$.subscribe(
      (nouns) => {
        if (nouns.length === 0) {
          this.nounService.fetchNouns();
          this.nounService.nounList$.subscribe(
            (nounsAfterFetch) => {
              this.initData(nounsAfterFetch);
            }
          );
        } else {
          this.initData(nouns);
        }
      }
    );
    this.onRowUnselect();
  }

  private initData(nouns: Array<Noun>): void {
    this.data = [];
    this._nouns = nouns.filter((noun) =>
      noun.singularPluralCoupleNounId == null
      || noun.russianNounCategory.russianGrammaticalNumber === Const.S
    );
    this._nouns.forEach((noun) => {
      this.data.push({
        noun: noun.nominativeForm,
        translation: noun.translation,
        declension: noun.russianNounCategory.id,
        id: noun.id,
        animate: noun.isAnimate,
        singularPluralId: noun.singularPluralCoupleNounId
      });
    });
  }

  public translateTitle(): string {
    return this.translate.instant('nouns.nouns.title')
  }

  public onRowSelect(event: any): void {
    this.nounListService.setRowdata(event.data);
  }

  public onRowUnselect(): void {
    this.nounListService.setRowdata(null);
  }

}
