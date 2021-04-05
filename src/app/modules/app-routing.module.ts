import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CreatePlayerGuard } from '../auth/guards/create-player.guard';
import { GetPlayerComponent } from '../views/player/get-player/get-player.component';
import { CreatePlayerComponent } from '../views/player/create-player/create-player.component';
import { NotfoundComponent } from '../views/notfound/notfound.component';
import { TrainingComponent } from '../views/russian/training/training.component';
import { AccountComponent } from '../views/player/account/account.component';
import { WelcomeComponent } from '../views/welcome/welcome.component';
import { AdjectivesComponent } from '../views/russian/adjectives/adjectives.component';
import { NounsComponent } from '../views/russian/nouns/nouns.component';
import { GithubComponent } from '../views/github/github.component';
import { StatisticsComponent } from '../views/statistics/statistics.component';
import { UserHistoryComponent } from '../views/user-history/user-history.component';

const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: '', redirectTo: '/welcome', pathMatch: 'full' },
  { path: 'register', canActivate: [CreatePlayerGuard], component: CreatePlayerComponent },
  { path: 'account', canActivate: [AuthGuard], component: AccountComponent },
  { path: 'history', canActivate: [AuthGuard], component: UserHistoryComponent },
  { path: 'statistics', canActivate: [AuthGuard], component: StatisticsComponent },
  { path: 'training', component: TrainingComponent },
  { path: 'training/check', component: TrainingComponent },
  { path: 'training/test/:mode', component: TrainingComponent },
  { path: 'adjectives', component: AdjectivesComponent },
  { path: 'adjectives/:category', component: AdjectivesComponent },
  { path: 'adjectives/consult/:adjective', component: AdjectivesComponent },
  { path: 'adjectives/add/:adjective', component: AdjectivesComponent },
  { path: 'adjectives/update/:adjective', component: AdjectivesComponent },
  { path: 'nouns', component: NounsComponent },
  { path: 'nouns/:category', component: NounsComponent },
  { path: 'nouns/:category/:gender/:type', component: NounsComponent },
  { path: 'nouns/consult/:noun', component: NounsComponent },
  { path: 'nouns/add/:noun', component: NounsComponent },
  { path: 'github', component: GithubComponent },
  { path: 'authentification', canActivate: [CreatePlayerGuard], component: GetPlayerComponent },
  { path: 'not-found', component: NotfoundComponent },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
