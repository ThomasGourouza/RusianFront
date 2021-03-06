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
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { TreeModule } from 'primeng/tree';
import { CardModule } from 'primeng/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { ConfirmationService } from 'primeng/api';
import { AccountComponent } from './views/player/account/account.component';
import { TrainingComponent } from './views/russian/training/training.component';
import { SideAdjectivesComponent } from './views/russian/adjectives/side-adjectives/side-adjectives.component';
import { LanguageFormComponent } from './views/menu/language-select/language-select.component';
import { GetPlayerComponent } from './views/player/get-player/get-player.component';
import { CreatePlayerComponent } from './views/player/create-player/create-player.component';
import { PlayerApi } from './services/api/player.api';
import { PlayerService } from './services/player.service';
import { AuthService } from './auth/auth.service';
import { SortPipe } from './pipes/sort.pipe';
import { UniquePipe } from './pipes/unique.pipe';
import { AdjectivesComponent } from './views/russian/adjectives/adjectives.component';
import { NounsComponent } from './views/russian/nouns/nouns.component';
import { Utils } from './services/utils/utils.service';
import { PlayerReferenceApi } from './services/api/player-reference.api';
import { PlayerReferenceService } from './services/player-reference.service';
import { RussianReferenceApi } from './services/api/russian-reference.api';
import { RussianReferenceService } from './services/russian-reference.service';
import { AdjectiveApi } from './services/api/adjective.api';
import { AdjectiveService } from './services/adjective.service';
import { NounApi } from './services/api/noun.api';
import { NounService } from './services/noun.service';
import { DeclensionCategoryComponent } from './views/russian/adjectives/core/declension-category/declension-category.component';
import { AdjectiveListComponent } from './views/russian/adjectives/core/adjective-list/adjective-list.component';
import { AddAdjectiveComponent } from './views/russian/adjectives/core/add-adjective/add-adjective.component';
import { ActionMenuComponent } from './views/russian/adjectives/action-menu/action-menu.component';
import { AdjectiveNotFoundComponent } from './views/russian/adjectives/core/adjective-not-found/adjective-not-found.component';
import { SideMenuAdjectivesService } from './services/side-menu-adjectives.service';
import { ActionMenuService } from './services/action-menu.service';
import { AdjectiveListService } from './services/adjective-list.service';
import { NounListService } from './services/noun-list.service';
import { UpdateAdjectiveComponent } from './views/russian/adjectives/core/update-adjective/update-adjective.component';
import { KeyboardComponent } from './views/russian/shared/keyboard/keyboard.component';
import { SideNounsComponent } from './views/russian/nouns/side-nouns/side-nouns.component';
import { SideMenuNounsService } from './services/side-menu-nouns.service';
import { SideMenuTrainingService } from './services/side-menu-training.service';
import { DeclensionComponent } from './views/russian/nouns/core/declension/declension.component';
import { NounListComponent } from './views/russian/nouns/core/noun-list/noun-list.component';
import { DeclensionNounComponent } from './views/russian/nouns/core/declension-noun/declension-noun.component';
import { AddNounComponent } from './views/russian/nouns/core/add-noun/add-noun.component';
import { NounNotFoundComponent } from './views/russian/nouns/core/noun-not-found/noun-not-found.component';
import { LinkComponent } from './views/russian/nouns/core/link/link.component';
import { SideTrainingComponent } from './views/russian/training/side-training/side-training.component';
import { PreparationComponent } from './views/russian/training/core/preparation/preparation.component';
import { VisualTestComponent } from './views/russian/training/core/visual-test/visual-test.component';
import { WrittenTestComponent } from './views/russian/training/core/written-test/written-test.component';
import { HistoryTrainingService } from './services/history-training.service';
import { SettingsTrainingService } from './services/settings-training.service';
import { HistoryComponent } from './views/russian/training/core/history/history.component';
import { GithubComponent } from './views/github/github.component';
import { GithubApi } from './services/api/githubApi.service';
import { GithubService } from './services/github.service';
import { StatisticsComponent } from './views/statistics/statistics.component';
import { UserHistoryComponent } from './views/user-history/user-history.component';
import { SettingsComponent } from './views/russian/training/core/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    WelcomeComponent,
    NotfoundComponent,
    AccountComponent,
    TrainingComponent,
    SideAdjectivesComponent,
    LanguageFormComponent,
    GetPlayerComponent,
    CreatePlayerComponent,
    SortPipe,
    UniquePipe,
    AdjectivesComponent,
    NounsComponent,
    DeclensionCategoryComponent,
    AdjectiveListComponent,
    AddAdjectiveComponent,
    ActionMenuComponent,
    AdjectiveNotFoundComponent,
    UpdateAdjectiveComponent,
    KeyboardComponent,
    SideNounsComponent,
    DeclensionComponent,
    NounListComponent,
    DeclensionNounComponent,
    AddNounComponent,
    NounNotFoundComponent,
    LinkComponent,
    SideTrainingComponent,
    PreparationComponent,
    VisualTestComponent,
    WrittenTestComponent,
    HistoryComponent,
    GithubComponent,
    StatisticsComponent,
    UserHistoryComponent,
    SettingsComponent
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
    TableModule,
    MenuModule,
    InputTextModule,
    TreeModule,
    ButtonModule,
    ConfirmDialogModule,
    CardModule,
    CheckboxModule,
    MultiSelectModule
  ],
  providers: [
    Utils,
    AuthService,
    PlayerReferenceApi,
    PlayerReferenceService,
    PlayerApi,
    PlayerService,
    RussianReferenceApi,
    RussianReferenceService,
    AdjectiveApi,
    AdjectiveService,
    NounApi,
    NounService,
    GithubApi,
    GithubService,
    ConfirmationService,
    SideMenuAdjectivesService,
    SideMenuNounsService,
    SideMenuTrainingService,
    HistoryTrainingService,
    SettingsTrainingService,
    ActionMenuService,
    AdjectiveListService,
    NounListService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}