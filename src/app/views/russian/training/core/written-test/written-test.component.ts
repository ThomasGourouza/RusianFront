import { Component, OnInit } from '@angular/core';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { TranslateService } from '@ngx-translate/core';
import { NounService } from 'src/app/services/noun.service';
import { RussianReferenceService } from 'src/app/services/russian-reference.service';
import { AdjectiveService } from 'src/app/services/adjective.service';
import { RussianCase } from 'src/app/models/reference/russian/russian-case.model';
import { Adjective } from 'src/app/models/adjective/get/adjective.model';
import { Noun } from 'src/app/models/noun/get/noun.model';
import { Const } from 'src/app/services/utils/const';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Answer, HistoryTrainingService } from 'src/app/services/history-training.service';

@Component({
  selector: 'app-written-test',
  templateUrl: './written-test.component.html'
})
export class WrittenTestComponent extends subscribedContainerMixin() implements OnInit {

  public nouns: Array<Noun>;
  public adjectives: Array<Adjective>;
  public cases: Array<RussianCase>;

  public declinedAdjective: string;
  public declinedNoun: string;

  public adjective: Adjective;
  public noun: Noun;
  public russianCase: RussianCase;

  public adjectiveAnswer: string;
  public nounAnswer: string;

  public answerForm: FormGroup;
  public casesOfNoun: Array<string>;
  public casesOfAdjective: Array<string>;

  public adjectiveCorrect: boolean;
  public nounCorrect: boolean;

  public hasPlayed: boolean;

  constructor(
    public translate: TranslateService,
    private nounService: NounService,
    private adjectiveService: AdjectiveService,
    private russianReferenceService: RussianReferenceService,
    private formBuilder: FormBuilder,
    private historyService: HistoryTrainingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initCorrects();
    this.initForm();
    this.russianReferenceService.cases$
      .subscribe((cases: Array<RussianCase>) => {
        this.cases = cases;
        this.russianCase = this.getRandom(this.cases);
        if (!!this.russianCase) {
          this.setContext(this.russianCase.value);
        }
        // nouns
        this.nounService.fetchNouns();
        this.nounService.nounList$
          .subscribe((nouns: Array<Noun>) => {
            this.nouns = nouns;
            this.noun = this.getRandom(this.nouns);
            // adjectives
            this.adjectiveService.fetchAdjectives();
            this.adjectiveService.adjectiveList$
              .subscribe((adjectives: Array<Adjective>) => {
                this.adjectives = adjectives;
                this.adjective = this.getRandom(this.adjectives);
                // casesOfNoun
                this.casesOfNoun = this.casesOf(Const.noun);
                // casesOfAdjective
                this.casesOfAdjective = this.casesOf(Const.adjective);
              });
          });
      });
  }

  private initCorrects(): void {
    this.adjectiveCorrect = false;
    this.nounCorrect = false;
    this.hasPlayed = false;
  }

  private initForm(): void {
    this.answerForm = this.formBuilder.group(
      {
        adjective: ['', Validators.required],
        noun: ['', Validators.required],
        context: [{ value: '', disabled: true }]
      }
    );
  }

  private getRandom(array: Array<any>): any {
    return array[Math.floor(Math.random() * array.length)];
  }

  public setAnswer(): void {
    this.adjectiveAnswer = !!this.russianCase.value ?
      this.giveResult(this.adjective.id, this.noun.id, this.russianCase.value, Const.adjective)
      : '';
    this.nounAnswer = !!this.russianCase.value ?
      this.giveResult(this.adjective.id, this.noun.id, this.russianCase.value, Const.noun)
      : '';
  }

  public onNew(): void {
    this.setAnswer();
    const answer: Answer = {
      case: this.printCase(this.russianCase.id),
      adjective: this.adjectiveAnswer,
      noun: this.nounAnswer,
      point: 0
    };
    this.historyService.addHistory(answer);
    this.onNext();
  }

  public onNext(): void {
    this.initCorrects();
    this.answerForm.controls['adjective'].enable();
    this.answerForm.controls['noun'].enable();
    this.answerForm.controls['adjective'].setValue('');
    this.answerForm.controls['noun'].setValue('');

    this.adjective = this.getRandom(this.adjectives);
    this.noun = this.getRandom(this.nouns);
    this.russianCase = this.getRandom(this.cases);

    // casesOfNoun
    this.casesOfNoun = this.casesOf(Const.noun);
    // casesOfAdjective
    this.casesOfAdjective = this.casesOf(Const.adjective);

    this.setContext(this.russianCase.value);
    this.adjectiveAnswer = '';
    this.nounAnswer = '';
  }

  private earnedPoint(adjectiveCorrect, nounCorrect): number {
    if (adjectiveCorrect && nounCorrect) {
      return 1;
    } else if (adjectiveCorrect || nounCorrect) {
      return 0.5;
    } else {
      return 0;
    }
  }

  public casesOf(field: string): Array<string> {
    if (!!this.adjective && !!this.noun && !!this.cases && this.cases.length > 0) {
      const arrayWithoutRepetitons = [];
      this.cases.map((russianCase) =>
        this.giveResult(this.adjective.id, this.noun.id, russianCase.value, field
        )).forEach((item) => {
          if (!arrayWithoutRepetitons.includes(item)) {
            arrayWithoutRepetitons.push(item);
          }
        });
      const arrayUnsorted = [];
      while (arrayUnsorted.length < arrayWithoutRepetitons.length) {
        const random = Math.floor(Math.random() * arrayWithoutRepetitons.length);
        if (!arrayUnsorted.includes(arrayWithoutRepetitons[random])) {
          arrayUnsorted.push(arrayWithoutRepetitons[random]);
        }
      }
      return arrayUnsorted;
    }
    return [];
  }

  private setContext(russianCaseValue: string): void {
    let context: string;
    switch (russianCaseValue) {
      case Const.N: {
        context = 'что/кто';
        break;
      }
      case Const.A: {
        context = 'что/кого';
        break;
      }
      case Const.G: {
        context = 'чего/кого';
        break;
      }
      case Const.D: {
        context = 'чему/кому';
        break;
      }
      case Const.L: {
        context = 'о чём/о ком';
        break;
      }
      case Const.I: {
        context = 'с чем/с кем';
        break;
      }
    }
    this.answerForm.controls['context'].setValue(context);
  }

  public giveResult(adjectiveId: number, nounId: number, russianCase: string, field: string): string {
    const noun = this.nouns
      .find((n) => n.id === nounId);

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
      .find((adj) => adj.id === adjectiveId);
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

  public printCase(russianCaseId: number): string {
    return this.translate.instant('reference.case.' + russianCaseId);
  }

  public onSubmit(): void {
    this.hasPlayed = true;
    this.setAnswer();

    this.answerForm.controls['adjective'].disable();
    this.answerForm.controls['noun'].disable();

    const formValue = this.answerForm.value;
    const adjective = formValue['adjective'];
    const noun = formValue['noun'];

    this.adjectiveCorrect = (adjective === this.adjectiveAnswer);
    this.nounCorrect = (noun === this.nounAnswer);
    const point = this.earnedPoint(this.adjectiveCorrect, this.nounCorrect);

    const answer: Answer = {
      case: this.printCase(this.russianCase.id),
      adjective: this.adjectiveAnswer,
      noun: this.nounAnswer,
      point: point
    };
    this.historyService.addHistory(answer);
  }

}

