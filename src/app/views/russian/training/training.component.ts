import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
import { AdjectiveCategoryModel } from 'src/app/models/reference/russian/adjective-category.model';
import { DeclensionNameModel } from 'src/app/models/reference/russian/declension-name.model';
import { DeclensionTypeModel } from 'src/app/models/reference/russian/declension-type.model';
import { GrammaticalNumberModel } from 'src/app/models/reference/russian/grammatical-number.model';
import { InterrogativeWordModel } from 'src/app/models/reference/russian/interrogative-word.model';
import { NounCategoryModel } from 'src/app/models/reference/russian/noun-category.model';
import { RussianCaseModel } from 'src/app/models/reference/russian/russian-case.model';
import { RussianGenderModel } from 'src/app/models/reference/russian/russian-gender.model';
import { RussianRoleModel } from 'src/app/models/reference/russian/russian-role.model';
import { RussianReferenceService } from 'src/app/services/russian-reference.service';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';

@Component({
  selector: 'app-russian',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent extends subscribedContainerMixin()  implements OnInit {

  public items: MenuItem[];

  public _declensionNames: Array<DeclensionNameModel>;
  public _declensionTypes: Array<DeclensionTypeModel>;
  public _interrogativeWords: Array<InterrogativeWordModel>;
  public _grammaticalNumbers: Array<GrammaticalNumberModel>;
  public _genders: Array<RussianGenderModel>;
  public _cases: Array<RussianCaseModel>;
  public _roles: Array<RussianRoleModel>;
  public _nounCategoriesInanimate: Array<NounCategoryModel>;
  public _nounCategoriesAnimate: Array<NounCategoryModel>;
  public _adjectiveCategories: Array<AdjectiveCategoryModel>;

  constructor(
    public translate: TranslateService,
    private russianReferenceService: RussianReferenceService
    ) { 
    super();
    this.translate.get('home.name').subscribe((res: string) => {

    this.items = [
      {
        label: this.translate.instant('navbar.side.file'),
        items: [{
          label: 'new',
          icon: 'pi pi-fw pi-plus',
          items: [
            { label: 'project'},
            { label: 'other' },
          ]
        },
        { label: 'open' },
        { label: 'quit' }
        ]
      },
      {
        label: 'edit',
        icon: 'pi pi-fw pi-pencil',
        items: [
          { label: 'delete', icon: 'pi pi-fw pi-trash' },
          { label: 'refresh', icon: 'pi pi-fw pi-refresh' }
        ]
      }
    ];

  });
  }

  ngOnInit(): void {
    this.russianReferenceService.declensionNamesSubject$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((declensionNames) => {
      this._declensionNames = declensionNames;
      console.log(this._declensionNames);
    });

    this.russianReferenceService.declensionTypesSubject$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((declensionTypes) => {
      this._declensionTypes = declensionTypes;
      console.log(this._declensionTypes);
    });

    this.russianReferenceService.interrogativeWordsSubject$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((interrogativeWords) => {
      this._interrogativeWords = interrogativeWords;
      console.log(this._interrogativeWords);
    });

    this.russianReferenceService.grammaticalNumbersSubject$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((grammaticalNumbers) => {
      this._grammaticalNumbers = grammaticalNumbers;
      console.log(this._grammaticalNumbers);
    });

    this.russianReferenceService.gendersSubject$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((genders) => {
      this._genders = genders;
      console.log(this._genders);
    });

    this.russianReferenceService.casesSubject$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((cases) => {
      this._cases = cases;
      console.log(this._cases);
    });

    this.russianReferenceService.rolesSubject$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((roles) => {
      this._roles = roles;
      console.log(this._roles);
    });

    this.russianReferenceService.nounCategoriesInanimateSubject$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((nounCategoriesInanimate) => {
      this._nounCategoriesInanimate = nounCategoriesInanimate;
      console.log(this._nounCategoriesInanimate);
    });

    this.russianReferenceService.nounCategoriesAnimateSubject$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((nounCategoriesAnimate) => {
      this._nounCategoriesAnimate = nounCategoriesAnimate;
      console.log(this._nounCategoriesAnimate);
    });

    this.russianReferenceService.adjectiveCategoriesSubject$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((adjectiveCategories) => {
      this._adjectiveCategories = adjectiveCategories;
      console.log(this._adjectiveCategories);
    });
  }

}
