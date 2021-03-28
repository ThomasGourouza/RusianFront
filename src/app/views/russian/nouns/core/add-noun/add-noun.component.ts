import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { Utils } from 'src/app/services/utils/utils.service';
import { Const } from 'src/app/services/utils/const';
import { NounCategoryIds } from 'src/app/services/side-menu-nouns.service';
import { Category } from '../../nouns.component';
import { NounCategory } from 'src/app/models/reference/russian/noun-category.model';
import { RussianReferenceService } from 'src/app/services/russian-reference.service';
import { NounPost } from 'src/app/models/noun/post/noun-post.model';
import { NounService } from 'src/app/services/noun.service';
import { takeUntil } from 'rxjs/operators';
import { Noun } from 'src/app/models/noun/get/noun.model';
import { ExceptionIds } from '../declension/declension.component';
import { TranslateService } from '@ngx-translate/core';
export interface Item {
  label: string;
  value: string;
}

@Component({
  selector: 'app-add-noun',
  templateUrl: './add-noun.component.html',
  styleUrls: ['./add-noun.component.scss']
})
export class AddNounComponent extends subscribedContainerMixin() implements OnInit {

  public nounForm: FormGroup;
  public category: Category;
  public _nounCategories: Array<NounCategory>;
  public declensionIds: Array<number>;
  public exceptionIds: Array<ExceptionIds>;
  public russianNounCategoryRefId: number;
  public russianNounPluralCategoryRefId: number;
  private isSaved: boolean;
  public displayDeclensionTab: boolean;

  public genders: Array<Item>;
  public numbers: Array<Item>;
  public declensions: Array<Item>;
  public types: Array<Item>;

  public urlTranslation: string;
  public isKeyboardDisplayed: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    private utils: Utils,
    private russianReferenceService: RussianReferenceService,
    private nounService: NounService,
    private router: Router
  ) {
    super();
  }

  public ngOnInit(): void {
    this.urlTranslation = this.activatedRoute.snapshot.params['noun'];
    this.isSaved = false;
    this.refresh();
    // update la langue à chaque changement
    this.translate.onLangChange.subscribe(() => {
      this.refresh();
    });
    // récupération des références
    this.russianReferenceService.nounCategoriesInanimate$
      .subscribe((nounCategories: Array<NounCategory>) => {
        this._nounCategories = nounCategories;
      });

    this.declensionIds = [];
    for (let i = 1; i <= 15; i++) {
      this.declensionIds.push(i);
    }

    this.nounForm = this.formBuilder.group(
      {
        root: ['', Validators.required],
        number: ['', Validators.required],
        plural: [false],
        gender: [{ value: '', disabled: true }, Validators.required],
        declension: [{ value: '', disabled: true }, Validators.required],
        type: [{ value: '', disabled: true }, Validators.required],
        translation: [{ value: this.urlTranslationOrElse(''), disabled: !!this.urlTranslation }, Validators.required],
        translationPlural: [{ value: '', disabled: true }, Validators.required]
      }
    );
    this.onChanges();
  }

  public refresh(): void {
    this.genders = [
      {
        label: this.translate.instant('nouns.gender.masculine'),
        value: Const.M
      },
      {
        label: this.translate.instant('nouns.gender.feminine'),
        value: Const.F
      },
      {
        label: this.translate.instant('nouns.gender.neuter'),
        value: Const.NT
      }
    ];
    this.numbers = [
      {
        label: this.translate.instant('nouns.number.singular'),
        value: Const.S
      },
      {
        label: this.translate.instant('nouns.number.plural'),
        value: Const.P
      }
    ];
    if (!!this.nounForm) {
      this.nounForm.controls['gender'].setValue('');
      this.nounForm.controls['declension'].setValue('');
      this.nounForm.controls['declension'].disable();
      this.nounForm.controls['type'].setValue('');
      this.nounForm.controls['type'].disable();
      this.category = null;
    }
  }

  public translationPluralEnabled(): boolean {
    return this.nounForm.controls['translationPlural'].enabled;
  }

  private onChanges(): void {
    this.nounForm.get('gender').valueChanges.subscribe((gender) => {
      if ([Const.M, Const.F, Const.NT].includes(gender)) {
        switch (gender) {
          case Const.M: {
            this.declensions = [
              {
                label: this.translate.instant('reference.declension.first'),
                value: Const.FIRST
              },
              {
                label: this.translate.instant('reference.declension.second'),
                value: Const.SECOND
              },
              {
                label: this.translate.instant('reference.declension.third'),
                value: Const.THIRD
              }
            ];
            break;
          }
          case Const.F: {
            this.declensions = [
              {
                label: this.translate.instant('reference.declension.first'),
                value: Const.FIRST
              },
              {
                label: this.translate.instant('reference.declension.third'),
                value: Const.THIRD
              }
            ];
            break;
          }
          case Const.NT: {
            this.declensions = [
              {
                label: this.translate.instant('reference.declension.second'),
                value: Const.SECOND
              },
              {
                label: this.translate.instant('reference.declension.third'),
                value: Const.THIRD
              }
            ];
            break;
          }
        }
        this.nounForm.controls['declension'].enable();
        this.nounForm.controls['declension'].setValue(this.declensions[0].value);
      }
    });

    this.nounForm.get('declension').valueChanges.subscribe((declension) => {
      if ([Const.FIRST, Const.SECOND, Const.THIRD].includes(declension)) {
        const gender = this.nounForm.value['gender'];
        switch (declension) {
          case Const.FIRST: {
            this.types = [
              {
                label: this.translate.instant('reference.type.first'),
                value: Const.FT
              },
              {
                label: this.translate.instant('reference.type.second'),
                value: Const.ST
              },
              {
                label: this.translate.instant('reference.type.third'),
                value: Const.TT
              }
            ];
            break;
          }
          case Const.SECOND: {
            switch (gender) {
              case Const.M: {
                this.types = [
                  {
                    label: this.translate.instant('reference.type.first'),
                    value: Const.FT
                  },
                  {
                    label: this.translate.instant('reference.type.second'),
                    value: Const.ST
                  },
                  {
                    label: this.translate.instant('reference.type.third'),
                    value: Const.TT
                  }
                ];
                break;
              }
              case Const.NT: {
                this.types = [
                  {
                    label: this.translate.instant('reference.type.first'),
                    value: Const.FT
                  },
                  {
                    label: this.translate.instant('reference.type.second'),
                    value: Const.ST
                  }
                ];
                break;
              }
            }
            break;
          }
          case Const.THIRD: {
            switch (gender) {
              case Const.M:
              case Const.F: {
                this.types = [
                  {
                    label: this.translate.instant('reference.type.first'),
                    value: Const.FT
                  }
                ];
                break;
              }
              case Const.NT: {
                this.types = [
                  {
                    label: this.translate.instant('reference.type.first'),
                    value: Const.FT
                  },
                  {
                    label: this.translate.instant('reference.type.second'),
                    value: Const.ST
                  }
                ];
                break;
              }
            }
            break;
          }
        }
        this.nounForm.controls['type'].enable();
        this.nounForm.controls['type'].setValue(this.types[0].value);
      }
    });

    this.nounForm.get('type').valueChanges.subscribe((type) => {
      this.setCategory(type);
    });

    this.nounForm.get('number').valueChanges.subscribe((number) => {
      if ([Const.S, Const.P].includes(number)) {
        this.nounForm.controls['gender'].enable();
        this.nounForm.controls['plural'].setValue(false);
      }
      this.reloadDisplayDeclensionTab();
    });

    this.nounForm.get('plural').valueChanges.subscribe((plural) => {
      let trsl = this.nounForm.value['translation'];
      if (!!trsl) {
        const lastLetter = trsl.slice(-1);
        switch (lastLetter) {
          case 'y': {
            trsl = trsl.slice(0, -1) + 'ies';
            break;
          }
          case 's': {
            trsl = trsl + 'es';
            break;
          }
          default: {
            trsl = trsl + 's';
            break;
          }
        }
      }
      plural ?
        this.nounForm.controls['translationPlural'].enable() : this.nounForm.controls['translationPlural'].disable();
      this.nounForm.controls['translationPlural'].setValue(trsl);
      this.reloadDisplayDeclensionTab();
    });

    this.nounForm.get('translation').valueChanges.subscribe((translation) => {
      let trsl = translation;
      if (!!trsl) {
        const lastLetter = trsl.slice(-1);
        switch (lastLetter) {
          case 'y': {
            trsl = trsl.slice(0, -1) + 'ies';
            break;
          }
          case 's': {
            trsl = trsl + 'es';
            break;
          }
          default: {
            trsl = trsl + 's';
            break;
          }
        }
      }
      if (this.translationPluralEnabled()) {
        this.nounForm.controls['translationPlural'].setValue(trsl);
      }
    });

    this.nounForm.get('root').valueChanges.subscribe(() => {
      this.reloadDisplayDeclensionTab();
    });

  }

  private reloadDisplayDeclensionTab(): void {
    this.displayDeclensionTab = false;
    setTimeout(() => {
      this.setCategory(this.nounForm.value['type']);
    }, 10);
  }

  public onException(exceptions: Array<ExceptionIds>): void {
    this.exceptionIds = exceptions;
  }

  private setCategory(type: string): void {
    const declension = this.nounForm.value['declension'];
    const gender = this.nounForm.value['gender'];
    const number = this.nounForm.value['number'];
    const plural = this.nounForm.value['plural'];

    if ([Const.FIRST, Const.SECOND, Const.THIRD].includes(declension)
      && [Const.M, Const.F, Const.NT].includes(gender)
      && [Const.FT, Const.ST, Const.TT].includes(type)
      && !!number) {
      const selection = this.selectionFromForm(declension, gender, type);
      this.category = this.mapCategory(selection, number, plural);
      if (!!this.category && !!this.nounForm.value['root']) {
        this.category.root = this.nounForm.value['root'];
      }
      const key = (number === Const.S) ? Const.s : Const.p;
      this.russianNounCategoryRefId = selection[key];
      this.russianNounPluralCategoryRefId = selection[Const.p];
      this.displayDeclensionTab = true;
    }
  }

  public isSingular(): boolean {
    return this.nounForm.value['number'] === Const.S;
  }

  public isNotSelected(name: string): boolean {
    return this.nounForm.value[name] === '';
  }

  private urlTranslationOrElse(translation: string): string {
    return !!this.urlTranslation ? this.urlTranslation : translation;
  }

  public displayKeyboard(value: boolean): void {
    this.isKeyboardDisplayed = value;
  }

  public onKey(key: string): void {
    this.utils.onKey(key, this.nounForm);
  }

  public onSubmit(): void {
    const formValue = this.nounForm.value;

    const translation = this.urlTranslationOrElse(formValue['translation']);
    const translationPlural = this.nounForm.value['translationPlural'];
    const root = formValue['root'];
    const animate = this.exceptionIds.some((e) => e.ruleId === 7);

    if (!!this.russianNounCategoryRefId) {
      if (this.nounForm.value['plural'] && !!translationPlural) {
        const newNounPlural = new NounPost(
          root,
          this.russianNounPluralCategoryRefId,
          translationPlural,
          animate
        );
        this.nounService.clearNoun();
        this.nounService.addNoun(newNounPlural);
        this.nounService.noun$.pipe(
          takeUntil(this.destroyed$)
        ).subscribe((nounPl: Noun) => {
          if (nounPl.id && !this.isSaved) {
            const otherExceptions = this.exceptionIds.filter((e) =>
              ![6, 7].includes(e.ruleId) && e.numbers.includes(Const.P)
            );
            if (otherExceptions.length > 0) {
              otherExceptions.forEach((exceptionId) => {
                // Add exceptions
                this.nounService.addException({
                  russianNounId: nounPl.id,
                  russianDeclSpecEndingRefId: exceptionId.specificId
                });
              });
            }
            setTimeout(() => {
              this.addNoun(root, this.russianNounCategoryRefId, translation, animate, nounPl.id);
            }, 100);
          }
        });
      } else if (!this.isSaved) {
        this.addNoun(root, this.russianNounCategoryRefId, translation, animate, null);
      }
    }
  }

  private addNoun(root: string, categoryId: number, translation: string, animate: boolean, nounPl: number): void {
    this.isSaved = true;
    const newNoun = new NounPost(
      root,
      categoryId,
      translation,
      animate
    );
    this.nounService.clearNoun();
    this.nounService.addNoun(newNoun);
    this.nounService.noun$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((noun: Noun) => {
      if (noun.id) {
        const plural = this.nounForm.value['plural'];
        const otherExceptions = this.exceptionIds.filter(
          (e) => ![6, 7].includes(e.ruleId) && ((plural && e.numbers.includes(Const.S)) || !plural)
        );
        if (otherExceptions.length > 0) {
          otherExceptions.forEach((exceptionId) => {
            // Add exceptions
            this.nounService.addException({
              russianNounId: noun.id,
              russianDeclSpecEndingRefId: exceptionId.specificId
            });
          });
        }
        if (!!nounPl) {
          // Create couple singular plural
          this.nounService.addCouple({
            russianSingularNounId: noun.id,
            russianPluralNounId: nounPl
          });
        }
        setTimeout(() => {
          this.router.navigateByUrl('/nouns/consult/' + noun.translation);
        }, 500);
      }
    });
  }

  private mapCategory(selection: NounCategoryIds, number: string, plural: boolean): Category {
    const categories = this._nounCategories.filter(
      (c) => c.id === selection.singular || c.id === selection.plural
    );
    if (categories.length === 2) {
      const category: Category = {
        id: 0,
        declension: '',
        gender: '',
        type: '',
        endings: []
      }
      category.id = selection.id;
      category.declension = categories[0].russianDeclensionName;
      category.gender = categories[0].russianGender;
      category.type = categories[0].russianDeclCatType;
      category.endings = [
        {
          number: number,
          nounEndings: categories.find((cat) => cat.russianGrammaticalNumber === number).russianNounEndings
        }
      ];
      if (plural) {
        category.endings.push(
          {
            number: Const.P,
            nounEndings: categories.find((cat) => cat.russianGrammaticalNumber === Const.P).russianNounEndings
          }
        );
      }
      return category;
    } else {
      return null;
    }
  }

  private selectionFromForm(category: string, gender: string, type: string): NounCategoryIds {
    const selection: NounCategoryIds = {
      id: 0,
      name: 'declension',
      singular: 0,
      plural: 0
    };
    switch (category) {
      case Const.FIRST: {
        switch (gender) {
          case Const.M: {
            switch (type) {
              case Const.FT: {
                selection.id = 1;
                selection.singular = 1;
                selection.plural = 4;
                break;
              }
              case Const.ST: {
                selection.id = 2;
                selection.singular = 2;
                selection.plural = 5;
                break;
              }
              case Const.TT: {
                selection.id = 3;
                selection.singular = 3;
                selection.plural = 6;
                break;
              }
            }
            break;
          }
          case Const.F: {
            switch (type) {
              case Const.FT: {
                selection.id = 4;
                selection.singular = 7;
                selection.plural = 10;
                break;
              }
              case Const.ST: {
                selection.id = 5;
                selection.singular = 8;
                selection.plural = 11;
                break;
              }
              case Const.TT: {
                selection.id = 6;
                selection.singular = 9;
                selection.plural = 12;
                break;
              }
            }
            break;
          }
        }
        break;
      }
      case Const.SECOND: {
        switch (gender) {
          case Const.M: {
            switch (type) {
              case Const.FT: {
                selection.id = 7;
                selection.singular = 13;
                selection.plural = 16;
                break;
              }
              case Const.ST: {
                selection.id = 8;
                selection.singular = 14;
                selection.plural = 17;
                break;
              }
              case Const.TT: {
                selection.id = 9;
                selection.singular = 15;
                selection.plural = 18;
                break;
              }
            }
            break;
          }
          case Const.NT: {
            switch (type) {
              case Const.FT: {
                selection.id = 10;
                selection.singular = 19;
                selection.plural = 21;
                break;
              }
              case Const.ST: {
                selection.id = 11;
                selection.singular = 20;
                selection.plural = 22;
                break;
              }
            }
            break;
          }
        }
        break;
      }
      case Const.THIRD: {
        switch (gender) {
          case Const.M: {
            if (type === Const.FT) {
              selection.id = 12;
              selection.singular = 23;
              selection.plural = 24;
            }
            break;
          }
          case Const.F: {
            if (type === Const.FT) {
              selection.id = 13;
              selection.singular = 25;
              selection.plural = 26;
            }
            break;
          }
          case Const.NT: {
            switch (type) {
              case Const.FT: {
                selection.id = 14;
                selection.singular = 27;
                selection.plural = 29;
                break;
              }
              case Const.ST: {
                selection.id = 15;
                selection.singular = 28;
                selection.plural = 30;
                break;
              }
            }
            break;
          }
        }
        break;
      }
    }
    return selection;
  }

}
