import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Player } from 'src/app/models/player/get/player.model';
import { PlayerService } from 'src/app/services/player.service';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html'
})
export class AccountComponent extends subscribedContainerMixin() implements OnInit {

  public _player: Player;

  constructor(
    // private translate: TranslateService,
    private playerService: PlayerService
  ) {
    super();
  }

  ngOnInit(): void {
    this.playerService.player$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe((player: Player) => {
      this._player = player;
    })
  }

}
