import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
import { AdjectiveCategory } from 'src/app/models/reference/russian/adjective-category.model';
import { DeclensionName } from 'src/app/models/reference/russian/declension-name.model';
import { DeclensionType } from 'src/app/models/reference/russian/declension-type.model';
import { GrammaticalNumber } from 'src/app/models/reference/russian/grammatical-number.model';
import { InterrogativeWord } from 'src/app/models/reference/russian/interrogative-word.model';
import { NounCategory } from 'src/app/models/reference/russian/noun-category.model';
import { RussianCase } from 'src/app/models/reference/russian/russian-case.model';
import { RussianGender } from 'src/app/models/reference/russian/russian-gender.model';
import { RussianRole } from 'src/app/models/reference/russian/russian-role.model';
import { RussianReferenceService } from 'src/app/services/russian-reference.service';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';

@Component({
  selector: 'app-russian',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent extends subscribedContainerMixin()  implements OnInit {

  public items: MenuItem[];

  public _declensionNames: Array<DeclensionName>;
  public _declensionTypes: Array<DeclensionType>;
  public _interrogativeWords: Array<InterrogativeWord>;
  public _grammaticalNumbers: Array<GrammaticalNumber>;
  public _genders: Array<RussianGender>;
  public _cases: Array<RussianCase>;
  public _roles: Array<RussianRole>;
  public _nounCategories: Array<NounCategory>;
  public _adjectiveCategories: Array<AdjectiveCategory>;

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
    this.russianReferenceService.declensionNames$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((declensionNames) => {
      this._declensionNames = declensionNames;
      console.log(this._declensionNames);
    });

    this.russianReferenceService.declensionTypes$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((declensionTypes) => {
      this._declensionTypes = declensionTypes;
      console.log(this._declensionTypes);
    });

    this.russianReferenceService.interrogativeWords$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((interrogativeWords) => {
      this._interrogativeWords = interrogativeWords;
      console.log(this._interrogativeWords);
    });

    this.russianReferenceService.grammaticalNumbers$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((grammaticalNumbers) => {
      this._grammaticalNumbers = grammaticalNumbers;
      console.log(this._grammaticalNumbers);
    });

    this.russianReferenceService.genders$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((genders) => {
      this._genders = genders;
      console.log(this._genders);
    });

    this.russianReferenceService.cases$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((cases) => {
      this._cases = cases;
      console.log(this._cases);
    });

    this.russianReferenceService.roles$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((roles) => {
      this._roles = roles;
      console.log(this._roles);
    });

    this.russianReferenceService.nounCategoriesInanimate$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((nounCategoriesInanimate) => {
      this._nounCategories = nounCategoriesInanimate;
      console.log(this._nounCategories);
    });

    this.russianReferenceService.adjectiveCategories$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((adjectiveCategories) => {
      this._adjectiveCategories = adjectiveCategories;
      console.log(this._adjectiveCategories);
    });
  }

}
