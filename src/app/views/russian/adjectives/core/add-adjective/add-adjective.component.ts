import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { takeUntil } from 'rxjs/operators';
import { AdjectivePost } from 'src/app/models/adjective/post/adjective-post.model';
import { AdjectiveService } from 'src/app/services/adjective.service';
import { Adjective } from 'src/app/models/adjective/get/adjective.model';
import { Utils } from 'src/app/services/utils/utils.service';

@Component({
  selector: 'app-add-adjective',
  templateUrl: './add-adjective.component.html',
  styleUrls: ['./add-adjective.component.scss']
})
export class AddAdjectiveComponent extends subscribedContainerMixin() implements OnInit {

  public adjectiveForm: FormGroup;

  public categories: Array<string> = ["ый", "ой", "ий"];
  public urlTranslation: string;
  public isKeyboardDisplayed: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private adjectiveService: AdjectiveService,
    private activatedRoute: ActivatedRoute,
    private utils: Utils
  ) {
    super();
  }

  public ngOnInit(): void {
    this.urlTranslation = this.activatedRoute.snapshot.params['adjective'];
    this.adjectiveForm = this.formBuilder.group(
      {
        root: ['', Validators.required],
        ending: ['', Validators.required],
        translation: [{ value: this.urlTranslationOrElse(''), disabled: !!this.urlTranslation }, Validators.required]
      }
    );
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
    const ending = formValue['ending'];
    let categoryId: number;
    switch (ending) {
      case 'ый': {
        categoryId = 1;
        break;
      }
      case 'ой': {
        categoryId = 2;
        break;
      }
      case 'ий': {
        categoryId = root.trim().slice(-1) === 'н' ? 4 : 3;
        break;
      }
      default: {
        categoryId = 0;
        break;
      }
    }
    const newAdjective = new AdjectivePost(
      root,
      categoryId,
      translation
    );
    this.adjectiveService.clearAdjective();
    this.adjectiveService.addAdjective(newAdjective);
    this.adjectiveService.adjective$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((adjective: Adjective) => {
      if (adjective.id) {
        this.router.navigateByUrl('/adjectives/consult/' + adjective.translation);
      }
    });
  }

}
