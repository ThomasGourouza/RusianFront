import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http'
import { AppRoutingModule } from './modules/app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './views/nav/nav.component';
import { WelcomeComponent } from './views/welcome/welcome.component';
import { NotfoundComponent } from './views/notfound/notfound.component';
import { TabMenuModule } from 'primeng/tabmenu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserComponent } from './views/user/user.component';
import { RussianComponent } from './views/russian/russian.component';
import { SideComponent } from './views/side/side.component';
import { CasesComponent } from './views/cases/cases.component';
import { TableComponent } from './views/cases/table/table.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    WelcomeComponent,
    NotfoundComponent,
    UserComponent,
    RussianComponent,
    SideComponent,
    CasesComponent,
    TableComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
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
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http);
}