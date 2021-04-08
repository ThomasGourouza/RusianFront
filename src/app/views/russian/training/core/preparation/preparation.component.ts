import { Component, OnInit } from '@angular/core';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { TranslateService } from '@ngx-translate/core';
import { NounService } from 'src/app/services/noun.service';
import { RussianReferenceService } from 'src/app/services/russian-reference.service';
import { NounEnding } from 'src/app/models/reference/russian/noun-ending.model';
import { AdjectiveService } from 'src/app/services/adjective.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RussianCase } from 'src/app/models/reference/russian/russian-case.model';
import { Adjective } from 'src/app/models/adjective/get/adjective.model';
import { Noun } from 'src/app/models/noun/get/noun.model';
import { Const } from 'src/app/services/utils/const';
import { ColData } from '../../../nouns/core/declension-noun/declension-noun.component';
import { SettingsTrainingService } from 'src/app/services/settings-training.service';
export interface Category {
  id: number;
  idSingularPlural?: number;
  root?: string;
  rootPlural?: string;
  declension: string;
  gender: string;
  type: string;
  endings: Array<Ending>;
}
export interface Ending {
  number: string;
  nounEndings: Array<NounEnding>;
}
export interface RowData {
  case: string;
  context: string;
  adjective: string;
  noun: string;
}
export interface RowContext {
  case: string;
  context: string;
}

@Component({
  selector: 'app-preparation',
  templateUrl: './preparation.component.html'
})
export class PreparationComponent extends subscribedContainerMixin() implements OnInit {

  public nouns: Array<Noun>;
  public adjectives: Array<Adjective>;
  public cases: Array<RussianCase>;

  public trainingForm: FormGroup;
  public declinedAdjective: string;
  public declinedNoun: string;

  public rows: Array<RowContext>;
  public cols: Array<ColData>;
  public data: Array<RowData>;

  constructor(
    public translate: TranslateService,
    private nounService: NounService,
    private adjectiveService: AdjectiveService,
    private russianReferenceService: RussianReferenceService,
    private formBuilder: FormBuilder,
    private settingsService: SettingsTrainingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.rows = [
      { case: Const.N, context: 'что/кто' },
      { case: Const.A, context: 'что/кого' },
      { case: Const.G, context: 'чего/кого' },
      { case: Const.D, context: 'чему/кому' },
      { case: Const.L, context: 'о чём/о ком' },
      { case: Const.I, context: 'с чем/с кем' }
    ];
    this.cols = [
      { field: Const.c, header: '' },
      { field: Const.context, header: 'Context' },
      { field: Const.adjective, header: 'Adjective' },
      { field: Const.noun, header: 'Noun' }
    ];

    this.russianReferenceService.cases$
      .subscribe((cases: Array<RussianCase>) => {
        this.cases = cases;
      });

    this.settingsService.nouns$.subscribe((n) => {
      this.nounService.fetchNouns();
      this.nounService.nounList$
        .subscribe((nouns: Array<Noun>) => {
          this.nouns = (!!n && n.length > 0) ?
            nouns.filter((noun) => n.map((i) => i.translation).includes(noun.translation))
            : nouns;
        });
    });

    this.settingsService.adjectives$.subscribe((a) => {
      this.adjectiveService.fetchAdjectives();
      this.adjectiveService.adjectiveList$
        .subscribe((adjectives: Array<Adjective>) => {
          this.adjectives = (!!a && a.length > 0) ?
            adjectives.filter((adjective) => a.map((i) => i.translation).includes(adjective.translation))
            : adjectives;
        });
    });

    this.initForm();
    this.onChanges();
    this.setData(this.rows);
  }

  private setData(rows: Array<RowContext>): void {
    this.data = [];
    rows.forEach((row) => {
      this.data.push({ case: row.case, context: row.context, adjective: '', noun: '' });
    });
  }

  private initForm(): void {
    this.trainingForm = this.formBuilder.group(
      {
        adjective: ['', Validators.required],
        noun: ['', Validators.required]
      }
    );
  }

  private onChanges(): void {
    this.trainingForm.valueChanges.subscribe(() => {
      const formValue = this.trainingForm.value;
      const adjectiveId = formValue['adjective'];
      const nounId = formValue['noun'];
      if (![adjectiveId, nounId].includes('')) {
        this.rows.forEach((row) => {
          this.cols.forEach((col) => {
            if (![Const.c, Const.context].includes(col.field)) {
              this.data
                .find((rowData) => rowData.case === row.case)
              [col.field] = this.giveResult(adjectiveId, nounId, row.case, col.field);
            }
          });
        });
      }
    });
  }

  public giveResult(adjectiveId: string, nounId: string, russianCase: string, field: string): string {
    const noun = this.nouns
      .find((n) => '' + n.id === nounId);

    const rootNoun = noun.root;
    const endingNounObject = noun.russianNounCategory.russianNounEndings
      .find((ending) => ending.russianCase === russianCase);
    let endingNoun = endingNounObject.value;
    if (endingNounObject.specificEndingRules.length > 0) {
      const appliedRule = endingNounObject.specificEndingRules
        .find((rule) => rule.applied);
      if (!!appliedRule) {
        endingNoun = appliedRule.value;
      }
    }
    this.declinedNoun = rootNoun + endingNoun;

    const adjective = this.adjectives
      .find((adj) => '' + adj.id === adjectiveId);
    const rootAdjective = adjective.root;
    const gender = noun.russianNounCategory.russianGender;
    const number = noun.russianNounCategory.russianGrammaticalNumber;
    const genderAdjective = number === Const.S ? gender : number;
    let endingAdjective = adjective.category.endings
      .find((ending) => (
        ending.russianCase === russianCase && ending.russianGender === genderAdjective
      ))
      .value;
    if (russianCase === Const.A && endingAdjective === Const.NG) {
      const newRussianCase = noun.isAnimate ? Const.G : Const.N;
      endingAdjective = adjective.category.endings
        .find((ending) => (
          ending.russianCase === newRussianCase && ending.russianGender === genderAdjective
        ))
        .value;
    }
    this.declinedAdjective = rootAdjective + endingAdjective;

    return field === Const.adjective ? this.declinedAdjective : this.declinedNoun;
  }

  public printCase(russianCase: string): string {
    switch (russianCase) {
      case Const.N: {
        return this.translate.instant('reference.case.nominative');
      }
      case Const.A: {
        return this.translate.instant('reference.case.accusative');
      }
      case Const.G: {
        return this.translate.instant('reference.case.genitive');
      }
      case Const.D: {
        return this.translate.instant('reference.case.dative');
      }
      case Const.L: {
        return this.translate.instant('reference.case.locative');
      }
      case Const.I: {
        return this.translate.instant('reference.case.instrumental');
      }
      default: {
        return russianCase;
      }
    }
  }

  public printNumber(russianNumber: string): string {
    switch (russianNumber) {
      case Const.c: {
        return this.translate.instant('training.russianCase');
      }
      case Const.context: {
        return this.translate.instant('training.context');
      }
      case Const.adjective: {
        return this.translate.instant('training.adjective');
      }
      case Const.noun: {
        return this.translate.instant('training.noun');
      }
    }
  }

}

