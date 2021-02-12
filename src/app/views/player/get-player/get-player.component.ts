import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { SignInParams, PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-get-player',
  templateUrl: './get-player.component.html',
  styleUrls: ['./get-player.component.scss']
})
export class GetPlayerComponent extends subscribedContainerMixin() implements OnInit {
  public login: string;
  public password: string;

  constructor(
    private playerService: PlayerService,
    private router: Router) {
    super();
  }

  public ngOnInit(): void { }

  public onSignIn(login: string, password: string): void {
    this.playerService.fetchPlayer(new SignInParams(login, password));
    this.playerService.playerSubject$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
        this.router.navigate(['/welcome']);
    });
  }

}
