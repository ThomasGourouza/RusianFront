import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreatePlayerGuard } from '../auth/guards/create-player.guard';
import { GetPlayerComponent } from '../views/player/get-player/get-player.component';
import { CreatePlayerComponent } from '../views/player/create-player/create-player.component';
import { NotfoundComponent } from '../views/notfound/notfound.component';
import { RussianComponent } from '../views/russian/russian.component';
import { AccountComponent } from '../views/account/account.component';
import { WelcomeComponent } from '../views/welcome/welcome.component';


const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'register', canActivate: [CreatePlayerGuard], component: CreatePlayerComponent },
  { path: 'account', canActivate: [AuthGuard], component: AccountComponent },
  { path: 'russian', canActivate: [AuthGuard], component: RussianComponent },
  { path: 'authentification', component: GetPlayerComponent },
  { path: 'not-found', component: NotfoundComponent },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }