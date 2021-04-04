import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PlayerPost } from 'src/app/models/player/post/player-post.model';
import { PlayerReferenceService } from 'src/app/services/player-reference.service';
import { Image } from 'src/app/models/reference/player/image.model';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { takeUntil } from 'rxjs/operators';
import { PlayerService } from 'src/app/services/player.service';
import { Player } from 'src/app/models/player/get/player.model';

@Component({
  selector: 'app-create-player',
  templateUrl: './create-player.component.html'
})
export class CreatePlayerComponent extends subscribedContainerMixin() implements OnInit {

  public userForm: FormGroup;

  public _images: Array<Image>;
  public loginStatus: string;

  constructor(
    private formBuilder: FormBuilder,
    private playerReferenceService: PlayerReferenceService,
    private playerService: PlayerService,
    private router: Router
  ) {
    super();
  }

  public ngOnInit(): void {
    this.loginStatus = '';
    this.playerReferenceService.fetchReferences();

    this.playerReferenceService.images$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((images) => {
      this._images = images;
    });

    this.initForm();
    this.onChanges();
  }

  private initForm(): void {
    this.userForm = this.formBuilder.group(
      {
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
      null,
      null,
      null,
      null,
      null,
      formValue['imageRefId'],
      null,
      formValue['login'],
      formValue['password'],
      null,
      null
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
