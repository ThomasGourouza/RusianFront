import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Player } from 'src/app/models/player.model';
import { PlayerSpokenLanguage } from 'src/app/models/playerSpokenLanguages.model';
import { PlayerService } from 'src/app/services/player.service';
import { PlayerApi } from 'src/app/services/api/player.api';

@Component({
  selector: 'app-create-player',
  templateUrl: './create-player.component.html',
  styleUrls: ['./create-player.component.scss']
})
export class CreatePlayerComponent implements OnInit {



  private playerSpokenLanguages: Array<PlayerSpokenLanguage> = [
    {
      certification: "Certif1",
      languageRefId: 1,
      levelRefId: 5
    },
    {
      certification: "Certif2",
      languageRefId: 2,
      levelRefId: 4
    },
    {
      certification: "Certif3",
      languageRefId: 3,
      levelRefId: 4
    }
  ]
  private player: Player = new Player(
    3,
    "1983-08-15",
    "testrrr@moonfruit.com",
    "Coco2",
    1,
    2,
    "Bandicoot",
    "cocoB2",
    "psswd",
    "0671933441",
    this.playerSpokenLanguages
  );

  private message: any;






  public userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private playerService: PlayerService,
    private playerApi: PlayerApi,
    private router: Router
  ) { }

  public ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.userForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        sport: ['', Validators.required],
        languages: this.formBuilder.array([]),
        email: ['', [Validators.required, Validators.email]],
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
    this.playerApi.register(this.player).toPromise()
      .then((success) => {
        this.message = 'Success';
      }
      ).catch((error) => {
        console.log(error.status);
        this.message = 'Error';
      });


    // const formValue = this.userForm.value;
    // const newUser = new Player(
    //   formValue['firstName'],
    //   formValue['lastName'],
    //   formValue['email'],
    //   formValue['password'],
    //   formValue['sport'],
    //   formValue['languages'] ? formValue['languages'] : []
    // );
    // this.playerService.addUser(newUser);
    // this.router.navigate(['/users']);
  }

  public getLanguages(): FormArray {
    return this.userForm.get('languages') as FormArray;
  }

  public onAddLanguage(): void {
    const newLanguageControl = this.formBuilder.control(
      '',
      Validators.required
    );
    this.getLanguages().push(newLanguageControl);
  }

  private passwordMatchValidator(password: string, confirmPassword: string) {
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
