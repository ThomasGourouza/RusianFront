import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
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
import { MegaMenuModule } from 'primeng/megamenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AccountComponent } from './views/player/account/account.component';
import { TrainingComponent } from './views/russian/training/training.component';
import { SideComponent } from './views/side/side.component';
import { LanguageFormComponent } from './views/menu/language-select/language-select.component';
import { GetPlayerComponent } from './views/player/get-player/get-player.component';
import { CreatePlayerComponent } from './views/player/create-player/create-player.component';
import { PlayerApi } from './services/api/player.api';
import { PlayerService } from './services/player.service';
import { AuthService } from './auth/auth.service';
import { SortPipe } from './pipes/sort.pipe';
import { AdjectivesComponent } from './views/russian/adjectives/adjectives.component';
import { NounsComponent } from './views/russian/nouns/nouns.component';
import { Utils } from './services/utils/utils.service';
import { PlayerReferenceApi } from './services/api/player-reference.api';
import { PlayerReferenceService } from './services/player-reference.service';
import { RussianReferenceApi } from './services/api/russian-reference.api';
import { RussianReferenceService } from './services/russian-reference.service';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    WelcomeComponent,
    NotfoundComponent,
    AccountComponent,
    TrainingComponent,
    SideComponent,
    LanguageFormComponent,
    GetPlayerComponent,
    CreatePlayerComponent,
    SortPipe,
    AdjectivesComponent,
    NounsComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
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
    MegaMenuModule,
    TieredMenuModule
  ],
  providers: [
    Utils,
    RussianReferenceApi,
    RussianReferenceService,
    PlayerReferenceApi,
    PlayerReferenceService,
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