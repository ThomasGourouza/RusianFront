import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { takeUntil } from 'rxjs/operators';
import { AdjectivePost } from 'src/app/models/adjective/post/adjective-post.model';
import { AdjectiveService } from 'src/app/services/adjective.service';
import { Adjective } from 'src/app/models/adjective/get/adjective.model';
import { Utils } from 'src/app/services/utils/utils.service';
import { Const } from 'src/app/services/utils/const';

@Component({
  selector: 'app-update-adjective',
  templateUrl: './update-adjective.component.html',
  styleUrls: ['./update-adjective.component.scss']
})
export class UpdateAdjectiveComponent extends subscribedContainerMixin() implements OnInit {

  public adjectiveForm: FormGroup;

  public categories: Array<string> = ["ый", "ой", "ий"];
  public isKeyboardDisplayed: boolean = true;
  private translation: string;
  private root: string;
  private ending: string;
  private adjectiveId: number;

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
    this.translation = this.activatedRoute.snapshot.params['adjective'];
    this.adjectiveForm = this.formBuilder.group(
      {
        root: ['', Validators.required],
        ending: ['', Validators.required],
        translation: [{ value: this.translation, disabled: true }]
      }
    );
    this.adjectiveService.adjective$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((adjective: Adjective) => {
      if (adjective.id) {
        this.adjectiveId = adjective.id;
        this.initForm(adjective);
      }
    });
  }

  public displayKeyboard(value: boolean): void {
    this.isKeyboardDisplayed = value;
  }

  public onKey(key: string): void {
    this.utils.onKey(key, this.adjectiveForm);
  }

  private initForm(adjective: Adjective): void {
    this.root = adjective.root;
    this.ending = adjective.category.endings
      .find((ending) => ending.russianCase === Const.N && ending.russianGender === Const.M)
      .value;
    this.adjectiveForm.controls['root'].setValue(this.root);
    this.adjectiveForm.controls['ending'].setValue(this.ending);
  }

  public isModified(): boolean {
    const formValue = this.adjectiveForm.value;
    return this.root !== formValue['root'] || this.ending !== formValue['ending'];
  }

  public onSubmit(): void {
    const formValue = this.adjectiveForm.value;

    const translation = this.translation;
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
    const updatedAdjective = new AdjectivePost(
      root,
      categoryId,
      translation
    );
    this.adjectiveService.clearAdjective();
    this.adjectiveService.updateAdjective(this.adjectiveId, updatedAdjective);
    this.router.navigateByUrl('/adjectives/consult/' + this.translation);
  }

}
