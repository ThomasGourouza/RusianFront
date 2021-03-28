import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { Noun } from 'src/app/models/noun/get/noun.model';
import { NounService } from 'src/app/services/noun.service';
import { Const } from 'src/app/services/utils/const';
import { subscribedContainerMixin } from 'src/app/subscribed-container.mixin';
export interface SimpleNoun {
  id: number;
  noun: string;
  translation: string;
}

@Component({
  selector: 'app-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss']
})
export class LinkComponent extends subscribedContainerMixin() implements OnInit {

  public linkForm: FormGroup;
  public singularNouns: Array<SimpleNoun>;
  public pluralNouns: Array<SimpleNoun>;

  constructor(
    private formBuilder: FormBuilder,
    private nounService: NounService,
    private router: Router
  ) {
    super();
  }

  public ngOnInit(): void {
    this.singularNouns = [];
    this.pluralNouns = [];
    this.initForm();
    this.nounService.fetchNouns();
    this.nounService.nounList$
      .subscribe((nouns: Array<Noun>) => {
        const notLinkedNouns = nouns
          .filter((noun) => noun.singularPluralCoupleNounId == null);
        if (notLinkedNouns.length > 0) {
          this.singularNouns = notLinkedNouns
            .filter((noun) => noun.russianNounCategory.russianGrammaticalNumber === Const.S)
            .map((noun) => this.mapToSimpleNoun(noun));
          this.pluralNouns = notLinkedNouns
            .filter((noun) => noun.russianNounCategory.russianGrammaticalNumber === Const.P)
            .map((noun) => this.mapToSimpleNoun(noun));
        }
      });
  }

  private mapToSimpleNoun(noun: Noun): SimpleNoun {
    return {
      id: noun.id,
      noun: noun.nominativeForm,
      translation: noun.translation
    };
  }

  private initForm(): void {
    this.linkForm = this.formBuilder.group(
      {
        singular: ['', Validators.required],
        plural: ['', Validators.required]
      }
    );
  }

  public onSubmit(): void {
    const formValue = this.linkForm.value;
    const singularId = formValue['singular'];
    const pluralId = formValue['plural'];

    this.nounService.addCouple({
      russianSingularNounId: singularId,
      russianPluralNounId: pluralId
    });

    this.nounService.fetchNounByTranslation(
      this.singularNouns
        .find((noun) => '' + noun.id === singularId)
        .translation
    );
    this.nounService.fetchNounPluralById(pluralId);
    setTimeout(() => {
      this.nounService.noun$.pipe(
        takeUntil(this.destroyed$)
      ).subscribe((noun: Noun) => {
        if (!!noun.translation) {
          this.router.navigateByUrl('/nouns/consult/' + noun.translation);
        }
      });
    }, 100);
  }

}
