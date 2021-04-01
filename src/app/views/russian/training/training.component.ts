import { Component, OnInit } from '@angular/core';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
import { TranslateService } from '@ngx-translate/core';
import { NounService } from 'src/app/services/noun.service';
import { RussianReferenceService } from 'src/app/services/russian-reference.service';
import { NounEnding } from 'src/app/models/reference/russian/noun-ending.model';
import { AdjectiveService } from 'src/app/services/adjective.service';
import { FormBuilder } from '@angular/forms';
import { Const } from 'src/app/services/utils/const';
import { SideMenuTrainingService } from 'src/app/services/side-menu-training.service';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
export interface Category {
  id: number;
  idSingularPlural?: number;
  root?: string;
  rootPlural?: string;
  declension: string;
  gender: string;
  type: string;
  endings: Array<Ending>;
}
export interface Ending {
  number: string;
  nounEndings: Array<NounEnding>;
}
export interface RowData {
  case: string;
  context: string;
  adjective: string;
  noun: string;
}
export interface RowContext {
  case: string;
  context: string;
}

@Component({
  selector: 'app-russian',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent extends subscribedContainerMixin() implements OnInit {

  public page: string;

  constructor(
    private router: Router,
    public translate: TranslateService,
    private sideMenuService: SideMenuTrainingService,
  ) {
    super();
  }

  ngOnInit(): void {
    // setter de this.page au chargement de la page
    this.setPage(this.router.url);

    this.sideMenuService.setSelection(null);
    // mise à jour du menu de gauche
    this.sideMenuService.setMenu();

    // update la langue à chaque changement
    this.translate.onLangChange.subscribe(() => {
      // mise à jour du menu de gauche
      this.sideMenuService.setMenu();
    });

    // emetter du service sideMenu (gauche)
    this.sideMenuService.selection$.pipe(
      takeUntil(
        this.destroyed$
      )
    ).subscribe((selection: string) => {
      if (!!selection) {
        switch (selection) {
          case Const.intro: {
            this.sideMenuService.setSelection(null);
            this.redirect('/' + Const.training);
            break;
          }
          case Const.preparation:
          case Const.test: {
            this.sideMenuService.setSelection(null);
            this.redirect('/' + Const.training + '/' + selection);
            break;
          }
        }
      }
    });
  }

  // redirection en modifiant la valeur de this.page
  private redirect(url: string): void {
    this.setPage(url);
    this.router.navigateByUrl(url);
  }

  private setPage(url: string): void {
    const urlArray = url.split('/');
    // url = /training
    if (urlArray.length === 2 && urlArray[1] === Const.training) {
      this.page = 'intro';
    }
    // url = /nouns/:category
    if (urlArray.length === 3) {
      if ([Const.preparation, Const.test].includes(urlArray[2])) {
        this.page = urlArray[2];
      } else {
        // si la valeur de :category n'existe pas
        this.router.navigateByUrl('/' + Const.NF);
        this.page = Const.NF;
      }
    }
  }
}
