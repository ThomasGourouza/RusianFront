import { Component, OnInit } from '@angular/core';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { TranslateService } from '@ngx-translate/core';
import { NounService } from 'src/app/services/noun.service';
import { RussianReferenceService } from 'src/app/services/russian-reference.service';
import { NounEnding } from 'src/app/models/reference/russian/noun-ending.model';
import { AdjectiveService } from 'src/app/services/adjective.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RussianCase } from 'src/app/models/reference/russian/russian-case.model';

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

@Component({
  selector: 'app-russian',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent extends subscribedContainerMixin() implements OnInit {

  public nouns: Array<any>;
  public adjectives: Array<any>;
  public cases: Array<RussianCase>;

  public trainingForm: FormGroup;

  constructor(
    public translate: TranslateService,
    private nounService: NounService,
    private adjectiveService: AdjectiveService,
    private russianReferenceService: RussianReferenceService,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  ngOnInit(): void {

    this.russianReferenceService.cases$
    .subscribe((cases: Array<RussianCase>) => {
      this.cases = cases;
    });

    this.nounService.fetchNouns();
    this.nounService.nounList$
      .subscribe((nouns) => {
        this.nouns = nouns;
      });

    this.adjectiveService.fetchAdjectives();
    this.adjectiveService.adjectiveList$
      .subscribe((adjectives) => {
        this.adjectives = adjectives;
      });

    // update la langue à chaque changement
    this.translate.onLangChange.subscribe(() => {

    });

    // récupération des références
    // this.russianReferenceService.nounCategoriesInanimate$
    //   .subscribe((nounCategories: Array<NounCategory>) => {
    //     this._nounCategories = nounCategories;
    //     // setter de this.page au chargement de la page
    //     this.setPage(this.router.url);
    //   });

    this.initForm();
    this.onChanges();
  }

  public click(): void {
    console.log(this.adjectives);
    console.log(this.nouns);
    console.log(this.cases);
  }

  private initForm(): void {
    this.trainingForm = this.formBuilder.group(
      {
        adjective: ['', Validators.required],
        noun: ['', Validators.required],
        russianCase: ['', Validators.required]
      }
    );
  }

  private onChanges(): void {
    this.trainingForm.get('adjective').valueChanges.subscribe((adjective) => {
      console.log(adjective);
    });
    this.trainingForm.get('noun').valueChanges.subscribe((noun) => {
      console.log(noun);
    });
    this.trainingForm.get('russianCase').valueChanges.subscribe((russianCase) => {
      console.log(russianCase);
    });
  }

  public onSubmit(): void {
    const formValue = this.trainingForm.value;
    console.log(formValue['adjective']);
    console.log(formValue['noun']);
    console.log(formValue['russianCase']);
  }

}
