import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlayerPost } from 'src/app/models/player/post/player-post.model';
import { PlayerReferenceService } from 'src/app/services/player-reference.service';
import { Country } from 'src/app/models/reference/player/country.model';
import { Gender } from 'src/app/models/reference/player/gender.model';
import { Image } from 'src/app/models/reference/player/image.model';
import { Language } from 'src/app/models/reference/player/language.model';
import { Level } from 'src/app/models/reference/player/level.model';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { PlayerService } from 'src/app/services/player.service';
import { Player } from 'src/app/models/player/get/player.model';
// import { SortPipe } from 'src/app/pipes/sort.pipe';

@Component({
  selector: 'app-create-player',
  templateUrl: './create-player.component.html',
  styleUrls: ['./create-player.component.scss']
})
export class CreatePlayerComponent extends subscribedContainerMixin() implements OnInit {

  public userForm: FormGroup;

  public _countries: Array<Country>;
  public _genders: Array<Gender>;
  public _images: Array<Image>;
  public _languages: Array<Language>;
  public _levels: Array<Level>;
  public loginStatus: string;

  constructor(
    private formBuilder: FormBuilder,
    private playerReferenceService: PlayerReferenceService,
    private playerService: PlayerService,
    private router: Router,
    private translate: TranslateService,
    // private sortPipe: SortPipe
  ) {
    super();
  }

  public ngOnInit(): void {
    this.loginStatus = '';
    this.playerReferenceService.fetchReferences();

    this.playerReferenceService.countries$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((countries) => {
      this._countries = countries;
    });

    this.playerReferenceService.genders$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((genders) => {
      this._genders = genders;
    });

    this.playerReferenceService.images$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((images) => {
      this._images = images;
    });

    this.playerReferenceService.languages$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((languages) => {
      this._languages = languages;
    });

    this.playerReferenceService.levels$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((levels) => {
      this._levels = levels;
    });

    this.initForm();
    this.onChanges();
  }

  private initForm(): void {
    this.userForm = this.formBuilder.group(
      {
        // birthCountryRefId: ['', Validators.required],
        // birthDate: ['', Validators.required],
        // email: ['', Validators.required
        //   // , Validators.email
        // ],
        // firstName: ['', Validators.required],
        // genderRefId: ['', Validators.required],
        // lastName: ['', Validators.required],
        // phone: ['', Validators.required],
        // playerSpokenLanguages: this.formBuilder.array([]),
        imageRefId: ['', Validators.required],
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

  public checkPlayerByLogin(): void {
    const login = this.userForm.controls['login'].value;
    this.playerService.checkPlayerByLogin(login);
    this.playerService.checkPlayer$.subscribe((loginExists) => {
      this.loginStatus = loginExists ? 'taken' : 'available';
    });
  }

  public checkAvailable(): boolean {
    return this.userForm.controls['login'].value !== '';
  }

  public selectImg(id: number): void {
    this.userForm.controls['imageRefId'].setValue(this.imgIdEquals(id) ? '' : id);
  }

  public imgIdEquals(id: number): boolean {
    return this.userForm.controls['imageRefId'].value === id;
  }

  private onChanges(): void {
    this.userForm.get('login').valueChanges.subscribe(() => {
      this.loginStatus = '';
    });
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
    this.playerService.player$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((player: Player) => {
      if (player.login === this.userForm.value['login']) {
        this.router.navigateByUrl('/account');
      }
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

  // public sort(array: Array<any>): Array<any> {
  //   return this.sortPipe.transform(array, false);
  // }
}
