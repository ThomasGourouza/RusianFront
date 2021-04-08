import { Component, OnInit } from '@angular/core';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { TranslateService } from '@ngx-translate/core';
import { NounService } from 'src/app/services/noun.service';
import { AdjectiveService } from 'src/app/services/adjective.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Adjective } from 'src/app/models/adjective/get/adjective.model';
import { Noun } from 'src/app/models/noun/get/noun.model';
import { Const } from 'src/app/services/utils/const';
import { AdjectivePractice, NounPractice, SettingsTrainingService } from 'src/app/services/settings-training.service';
export interface FormPractice {
  adjectives: Array<AdjectivePractice>;
  nouns: Array<NounPractice>;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent extends subscribedContainerMixin() implements OnInit {
  public nouns: Array<NounPractice>;
  public selectedNouns: Array<NounPractice>;

  public adjectives: Array<AdjectivePractice>;
  public selectedAjectives: Array<AdjectivePractice>;

  public trainingForm: FormGroup;

  public itemSelectedLabel: string;
  public showInput: boolean;

  public nounsData: Array<NounPractice>;
  public nounsCols: Array<string>;

  public adjectivesData: Array<AdjectivePractice>;
  public adjectivesCols: Array<string>;

  public oneTime: number;

  constructor(
    public translate: TranslateService,
    private nounService: NounService,
    private adjectiveService: AdjectiveService,
    private formBuilder: FormBuilder,
    private settingsService: SettingsTrainingService
  ) {
    super();
  }

  ngOnInit(): void {
    this.oneTime = 0;
    this.initForm();
    this.settingsService.nouns$.subscribe((nouns) => {
      this.nounsData = nouns;
      this.trainingForm.controls['nouns'].setValue(this.nounsData);
    });
    this.settingsService.adjectives$.subscribe((adjectives) => {
      this.adjectivesData = adjectives;
      this.trainingForm.controls['adjectives'].setValue(this.adjectivesData);
    });
    this.nounsCols = [
      Const.noun,
      Const.translation
    ];
    this.adjectivesCols = [
      Const.adjective,
      Const.translation
    ];
    this.showInput = true;
    this.nounService.fetchNouns();
    this.nounService.nounList$
      .subscribe((nouns: Array<Noun>) => {
        this.nouns = nouns.map((n) => {
          return {
            noun: n.nominativeForm,
            translation: n.translation,
            declension: n.russianNounCategory.id
          }
        });
      });

    this.adjectiveService.fetchAdjectives();
    this.adjectiveService.adjectiveList$
      .subscribe((adjectives: Array<Adjective>) => {
        this.adjectives = adjectives.map((a) => {
          return {
            adjective: a.nominativeMasculineForm,
            translation: a.translation,
            declension: a.category.id
          };
        });
      });

    this.refreshItemsSelectedLabel();
    // update la langue à chaque changement
    this.translate.onLangChange.subscribe(() => {
      this.refreshItemsSelectedLabel();
    });

    this.onChanges();
  }

  private initForm(): void {
    this.trainingForm = this.formBuilder.group(
      {
        adjectives: [[], Validators.required],
        nouns: [[], Validators.required]
      }
    );
  }

  private onChanges(): void {
    this.trainingForm.valueChanges.subscribe((form) => {
      this.submit(form);
    });
  }

  public refreshItemsSelectedLabel(): void {
    this.showInput = false;
    this.itemSelectedLabel = this.translate.instant('training.item-selected');
    setTimeout(() => {
      this.showInput = true;
    }, 10);
  }

  public printCategory(startPath: string, endPath: string): string {
    return this.translate.instant(startPath + endPath);
  }

  public submit(form: FormPractice): void {
    if (form.nouns.length > 0 && form.adjectives.length > 0 && this.oneTime < 1) {
      this.oneTime++;
      this.settingsService.setNouns(form.nouns);
      this.settingsService.setAdjectives(form.adjectives);
      setTimeout(() => {
        this.oneTime = 0;
      }, 10);
    }
  }

}

