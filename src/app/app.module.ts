import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './views/menu/nav/nav.component';
import { WelcomeComponent } from './views/welcome/welcome.component';
import { NotfoundComponent } from './views/notfound/notfound.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountComponent } from './views/account/account.component';
import { RussianComponent } from './views/russian/russian.component';
import { SideComponent } from './views/side/side.component';
import { LanguageFormComponent } from './views/menu/language-select/language-select.component';
import { GetPlayerComponent } from './views/player/get-player/get-player.component';
import { CreatePlayerComponent } from './views/player/create-player/create-player.component';
import { LogComponent } from './views/menu/log/log.component';
import { PlayerApi } from './services/api/player.api';
import { PlayerService } from './services/player.service';
import { AuthService } from './auth/auth.service';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    WelcomeComponent,
    NotfoundComponent,
    AccountComponent,
    RussianComponent,
    SideComponent,
    LanguageFormComponent,
    GetPlayerComponent,
    CreatePlayerComponent,
    LogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule, 
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    TabMenuModule,
    TieredMenuModule,
    BrowserAnimationsModule
  ],
  providers: [
    PlayerApi,
    PlayerService,
    AuthService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}