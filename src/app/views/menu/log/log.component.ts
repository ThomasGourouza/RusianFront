import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { PlayerService } from 'src/app/services/player.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {
  public login: string;
  public password: string;

  constructor(
    private authService: AuthService,
    private playerService: PlayerService,
    private router: Router
    ) {}

  public ngOnInit(): void {}

  public isAuth(): boolean {
    return this.authService.isAuth;
  }

  public onSignOut(): void {
    this.authService.isAuth = false;
    this.playerService.logout();
    this.router.navigate(['/welcome']);
  }
  
}
