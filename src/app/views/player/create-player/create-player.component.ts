import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlayerPost } from 'src/app/models/post/player-post.model';
import { PlayerReferenceService } from 'src/app/services/player-reference.service';
import { CountryModel } from 'src/app/models/reference/player/country.model';
import { GenderModel } from 'src/app/models/reference/player/gender.model';
import { ImageModel } from 'src/app/models/reference/player/image.model';
import { LanguageModel } from 'src/app/models/reference/player/language.model';
import { LevelModel } from 'src/app/models/reference/player/level.model';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-create-player',
  templateUrl: './create-player.component.html',
  styleUrls: ['./create-player.component.scss']
})
export class CreatePlayerComponent extends subscribedContainerMixin() implements OnInit {

  public userForm: FormGroup;

  public _countries: Array<CountryModel>;
  public _genders: Array<GenderModel>;
  public _images: Array<ImageModel>;
  public _languages: Array<LanguageModel>;
  public _levels: Array<LevelModel>;

  constructor(
    private formBuilder: FormBuilder,
    private playerReferenceService: PlayerReferenceService,
    private playerService: PlayerService,
    private router: Router,
    private translate: TranslateService
  ) {
    super();
  }

  public ngOnInit(): void {
    this.playerReferenceService.fetchPlayerReferences();

    this.playerReferenceService.countriesSubject$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((countries) => {
      this._countries = countries;
    });

    this.playerReferenceService.gendersSubject$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((genders) => {
      this._genders = genders;
    });

    this.playerReferenceService.imagesSubject$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((images) => {
      this._images = images;
    });

    this.playerReferenceService.languagesSubject$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((languages) => {
      this._languages = languages;
    });

    this.playerReferenceService.levelsSubject$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((levels) => {
      this._levels = levels;
    });

    this.initForm();
  }

  private initForm(): void {
    this.userForm = this.formBuilder.group(
      {
        birthCountryRefId: ['', Validators.required],
        birthDate: ['', Validators.required],
        email: ['', Validators.required, Validators.email],
        firstName: ['', Validators.required],
        genderRefId: ['', Validators.required],
        imageRefId: ['', Validators.required],
        lastName: ['', Validators.required],
        phone: ['', Validators.required],
        playerSpokenLanguages: this.formBuilder.array([]),
        login: ['', Validators.required],
        password: ['', Validators.required],
        passwordConfirmation: ['', Validators.required],
      },
      {
        validator: this.passwordMatchValidator(
          'password',
          'passwordConfirmation'
        ),
      }
    );
  }

  public onSubmit(): void {
    const formValue = this.userForm.value;
    const newPlayer = new PlayerPost(
      formValue['birthCountryRefId'],
      formValue['birthDate'],
      formValue['email'],
      formValue['firstName'],
      formValue['genderRefId'],
      formValue['imageRefId'],
      formValue['lastName'],
      formValue['login'],
      formValue['password'],
      formValue['phone'],
      formValue['playerSpokenLanguages'] ? formValue['playerSpokenLanguages'] : []
    );
    this.playerService.registerPlayer(newPlayer);
    this.playerService.playerSubject$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((player) => {
        this.router.navigate(['/account']);
    });
    
  }

  public getLanguages(): FormArray {
    return this.userForm.get('playerSpokenLanguages') as FormArray;
  }

  public onAddLanguage(): void {
    const newLanguageControl = this.formBuilder.control(
      '',
      Validators.required
    );
    this.getLanguages().push(newLanguageControl);
  }

  private passwordMatchValidator(password: string, confirmPassword: string): ValidationErrors | null {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password];
      const confirmPasswordControl = formGroup.controls[confirmPassword];
      if (!passwordControl || !confirmPasswordControl) {
        return null;
      }
      if (
        confirmPasswordControl.errors &&
        !confirmPasswordControl.errors.passwordMismatch
      ) {
        return null;
      }
      confirmPasswordControl.setErrors(
        passwordControl.value !== confirmPasswordControl.value
          ? { passwordMismatch: true }
          : null
      );
    };
  }
}
