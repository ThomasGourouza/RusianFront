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

@Component({
  selector: 'app-visual-test',
  templateUrl: './visual-test.component.html'
})
export class VisualTestComponent extends subscribedContainerMixin() implements OnInit {

  public nouns: Array<Noun>;
  public adjectives: Array<Adjective>;
  public cases: Array<RussianCase>;

  public declinedAdjective: string;
  public declinedNoun: string;

  public adjective: Adjective;
  public noun: Noun;
  public russianCase: RussianCase;

  public text: string;
  public context: string;

  constructor(
    public translate: TranslateService,
    private nounService: NounService,
    private adjectiveService: AdjectiveService,
    private russianReferenceService: RussianReferenceService
  ) {
    super();
  }

  ngOnInit(): void {

    this.russianReferenceService.cases$
      .subscribe((cases: Array<RussianCase>) => {
        this.cases = cases;
        this.russianCase = this.getRandom(this.cases);
        if (!!this.russianCase) {
          this.setContext(this.russianCase.value);
        }
      });

    this.nounService.fetchNouns();
    this.nounService.nounList$
      .subscribe((nouns: Array<Noun>) => {
        this.nouns = nouns;
        this.noun = this.getRandom(this.nouns);
      });

    this.adjectiveService.fetchAdjectives();
    this.adjectiveService.adjectiveList$
      .subscribe((adjectives: Array<Adjective>) => {
        this.adjectives = adjectives;
        this.adjective = this.getRandom(this.adjectives);
      });

  }

  private getRandom(array: Array<any>): any {
    return array[Math.floor(Math.random() * array.length)];
  }

  public onAnswer(): void {
    this.text = !!this.russianCase.value ?
      this.giveResult(this.adjective.id, this.noun.id, this.russianCase.value, Const.adjective)
      + ' ' + this.giveResult(this.adjective.id, this.noun.id, this.russianCase.value, Const.noun)
      : '';
  }

  public onHide(): void {
    this.text = '';
  }

  public onNew(): void {
    this.adjective = this.getRandom(this.adjectives);
    this.noun = this.getRandom(this.nouns);
    this.russianCase = this.getRandom(this.cases);

    this.onHide();
    this.setContext(this.russianCase.value);
  }

  private setContext(russianCaseValue: string): void {
    let context: string;
    switch(russianCaseValue) {
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
    this.context = context;
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

  public printCase(russianCaseId: string): string {
    return this.translate.instant('reference.case.' + russianCaseId);
  }

}

