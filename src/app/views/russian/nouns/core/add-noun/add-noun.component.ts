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

  public adjectiveForm: FormGroup;
  public category: Category;
  public _nounCategories: Array<NounCategory>;
  public declensionIds: Array<number>;
  public exceptionIds: Array<number>;
  public russianNounCategoryRefId: number;
  public russianNounPluralCategoryRefId: number;
  private isSaved: boolean;

  public genders: Array<Item> = [
    {
      label: "Masculin",
      value: Const.m
    },
    {
      label: "Féminin",
      value: Const.f
    },
    {
      label: "Neutre",
      value: Const.n
    }
  ];
  public numbers: Array<Item> = [
    {
      label: "Singulier",
      value: Const.S
    },
    {
      label: "Pluriel",
      value: Const.P
    }
  ];
  public declensions: Array<Item>;
  public types: Array<Item>;

  public urlTranslation: string;
  public isKeyboardDisplayed: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private utils: Utils,
    private russianReferenceService: RussianReferenceService,
    private nounService: NounService,
    private router: Router
  ) {
    super();
  }

  public ngOnInit(): void {
    this.isSaved = false;
    // récupération des références
    this.russianReferenceService.nounCategoriesInanimate$
      .subscribe((nounCategories: Array<NounCategory>) => {
        this._nounCategories = nounCategories;
      });

    this.declensionIds = [];
    for (let i = 1; i <= 15; i++) {
      this.declensionIds.push(i);
    }

    this.urlTranslation = this.activatedRoute.snapshot.params['adjective'];
    this.adjectiveForm = this.formBuilder.group(
      {
        root: ['', Validators.required],
        number: ['', Validators.required],
        plural: [false],
        gender: [{ value: '', disabled: true }, Validators.required],
        declension: [{ value: '', disabled: true }, Validators.required],
        type: [{ value: '', disabled: true }, Validators.required],
        translation: [{ value: this.urlTranslationOrElse(''), disabled: !!this.urlTranslation }, Validators.required]
      }
    );
    this.onChanges();
  }

  private onChanges(): void {
    this.adjectiveForm.get('gender').valueChanges.subscribe((gender) => {
      if ([Const.m, Const.f, Const.n].includes(gender)) {
        switch (gender) {
          case Const.m: {
            this.declensions = [
              {
                label: "Première",
                value: Const.first
              },
              {
                label: "Deuxième",
                value: Const.second
              },
              {
                label: "Troisième",
                value: Const.third
              }
            ];
            break;
          }
          case Const.f: {
            this.declensions = [
              {
                label: "Première",
                value: Const.first
              },
              {
                label: "Troisième",
                value: Const.third
              }
            ];
            break;
          }
          case Const.n: {
            this.declensions = [
              {
                label: "Deuxième",
                value: Const.second
              },
              {
                label: "Troisième",
                value: Const.third
              }
            ];
            break;
          }
        }
        this.adjectiveForm.controls['declension'].enable();
        this.adjectiveForm.controls['declension'].setValue(this.declensions[0].value);
      }
    });

    this.adjectiveForm.get('declension').valueChanges.subscribe((declension) => {
      if ([Const.first, Const.second, Const.third].includes(declension)) {
        const gender = this.adjectiveForm.value['gender'];
        switch (declension) {
          case Const.first: {
            this.types = [
              {
                label: "Premier",
                value: Const.one
              },
              {
                label: "Deuxième",
                value: Const.two
              },
              {
                label: "Troisième",
                value: Const.three
              }
            ];
            break;
          }
          case Const.second: {
            switch (gender) {
              case Const.m: {
                this.types = [
                  {
                    label: "Premier",
                    value: Const.one
                  },
                  {
                    label: "Deuxième",
                    value: Const.two
                  },
                  {
                    label: "Troisième",
                    value: Const.three
                  }
                ];
                break;
              }
              case Const.n: {
                this.types = [
                  {
                    label: "Premier",
                    value: Const.one
                  },
                  {
                    label: "Deuxième",
                    value: Const.two
                  }
                ];
                break;
              }
            }
            break;
          }
          case Const.third: {
            switch (gender) {
              case Const.m:
              case Const.f: {
                this.types = [
                  {
                    label: "Premier",
                    value: Const.one
                  }
                ];
                break;
              }
              case Const.n: {
                this.types = [
                  {
                    label: "Premier",
                    value: Const.one
                  },
                  {
                    label: "Deuxième",
                    value: Const.two
                  }
                ];
                break;
              }
            }
            break;
          }
        }
        this.adjectiveForm.controls['type'].enable();
        this.adjectiveForm.controls['type'].setValue(this.types[0].value);
      }
    });

    this.adjectiveForm.get('type').valueChanges.subscribe((type) => {
      this.setCategory(type);
    });

    this.adjectiveForm.get('number').valueChanges.subscribe((number) => {
      if ([Const.S, Const.P].includes(number)) {
        this.adjectiveForm.controls['gender'].enable();
        this.adjectiveForm.controls['plural'].setValue(false);
      }
      this.setCategory(this.adjectiveForm.value['type']);
    });

  }

  public onException(exceptions: Array<number>): void {
    this.exceptionIds = exceptions;
  }

  private setCategory(type: string): void {
    const declension = this.adjectiveForm.value['declension'];
    const gender = this.adjectiveForm.value['gender'];
    const number = this.adjectiveForm.value['number'];

    if ([Const.first, Const.second, Const.third].includes(declension)
      && [Const.m, Const.f, Const.n].includes(gender)
      && [Const.one, Const.two, Const.three].includes(type)
      && !!number) {
      const selection = this.selectionFromForm(declension, gender, type);
      this.category = this.mapCategory(selection, number);
      if (!!this.adjectiveForm.value['root']) {
        this.category.root = this.adjectiveForm.value['root'];
      }
      const key = (number === Const.S) ? Const.s : Const.p;
      this.russianNounCategoryRefId = selection[key];
      this.russianNounPluralCategoryRefId = selection[Const.p];
    }
  }

  public isSingular(): boolean {
    return this.adjectiveForm.value['number'] === Const.S;
  }

  public isNotSelected(name: string): boolean {
    return this.adjectiveForm.value[name] === '';
  }

  private urlTranslationOrElse(translation: string): string {
    return !!this.urlTranslation ? this.urlTranslation : translation;
  }

  public displayKeyboard(value: boolean): void {
    this.isKeyboardDisplayed = value;
  }

  public onKey(key: string): void {
    this.utils.onKey(key, this.adjectiveForm);
  }

  public onSubmit(): void {
    const formValue = this.adjectiveForm.value;

    const translation = this.urlTranslationOrElse(formValue['translation']);
    const root = formValue['root'];
    const animate = this.exceptionIds.some((e) => e === 7);

    if (!!this.russianNounCategoryRefId) {


      if (this.adjectiveForm.value['plural']) {
        let trsl = this.adjectiveForm.value['translation'];
        trsl = (trsl.slice(-1) === 'y') ? trsl.slice(0, -1) + 'ies' : trsl + 's';
        const newNounPlural = new NounPost(
          root,
          this.russianNounPluralCategoryRefId,
          trsl,
          animate
        );
        this.nounService.clearNoun();
        this.nounService.addNoun(newNounPlural);
        this.nounService.noun$.pipe(
          takeUntil(this.destroyed$)
        ).subscribe((nounPl: Noun) => {
          if (nounPl.id && !this.isSaved) {
            this.addNoun(root, this.russianNounCategoryRefId, translation, animate, nounPl.id);
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
        // const otherExceptions = this.exceptionIds.filter((e) => e !== 7);
        // if (otherExceptions.length > 0) {
        //   // Remove exceptions
        //   // this.nounService.removeException({ noun_id: noun.id });
        //   otherExceptions.forEach((exceptionId) => {
        //     // Add exceptions
        //     this.nounService.addException({
        //       russianNounId: noun.id,
        //       russianDeclSpecEndingRefId: exceptionId
        //     });
        //   });
        // }
        if (!!nounPl) {
          // Create couple singular plural
          this.nounService.addCouple({
            russianSingularNounId: noun.id,
            russianPluralNounId: nounPl
          });
        }
        this.router.navigateByUrl('/nouns/consult/' + noun.translation);
      }
    });
  }

  private mapCategory(selection: NounCategoryIds, number: string): Category {
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
      ]
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
      case Const.first: {
        switch (gender) {
          case Const.m: {
            switch (type) {
              case Const.one: {
                selection.id = 1;
                selection.singular = 1;
                selection.plural = 4;
                break;
              }
              case Const.two: {
                selection.id = 2;
                selection.singular = 2;
                selection.plural = 5;
                break;
              }
              case Const.three: {
                selection.id = 3;
                selection.singular = 3;
                selection.plural = 6;
                break;
              }
            }
            break;
          }
          case Const.f: {
            switch (type) {
              case Const.one: {
                selection.id = 4;
                selection.singular = 7;
                selection.plural = 10;
                break;
              }
              case Const.two: {
                selection.id = 5;
                selection.singular = 8;
                selection.plural = 11;
                break;
              }
              case Const.three: {
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
      case Const.second: {
        switch (gender) {
          case Const.m: {
            switch (type) {
              case Const.one: {
                selection.id = 7;
                selection.singular = 13;
                selection.plural = 16;
                break;
              }
              case Const.two: {
                selection.id = 8;
                selection.singular = 14;
                selection.plural = 17;
                break;
              }
              case Const.three: {
                selection.id = 9;
                selection.singular = 15;
                selection.plural = 18;
                break;
              }
            }
            break;
          }
          case Const.n: {
            switch (type) {
              case Const.one: {
                selection.id = 10;
                selection.singular = 19;
                selection.plural = 21;
                break;
              }
              case Const.two: {
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
      case Const.third: {
        switch (gender) {
          case Const.m: {
            if (type === Const.one) {
              selection.id = 12;
              selection.singular = 23;
              selection.plural = 24;
            }
            break;
          }
          case Const.f: {
            if (type === Const.one) {
              selection.id = 13;
              selection.singular = 25;
              selection.plural = 26;
            }
            break;
          }
          case Const.n: {
            switch (type) {
              case Const.one: {
                selection.id = 14;
                selection.singular = 27;
                selection.plural = 29;
                break;
              }
              case Const.two: {
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
