import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotfoundComponent } from '../views/notfound/notfound.component';
import { RussianComponent } from '../views/russian/russian.component';
import { UserComponent } from '../views/user/user.component';
import { WelcomeComponent } from '../views/welcome/welcome.component';


const routes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: '', component: WelcomeComponent },
  { path: 'user', component: UserComponent },
  { path: 'russian', component: RussianComponent },
  { path: 'not-found', component: NotfoundComponent },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
