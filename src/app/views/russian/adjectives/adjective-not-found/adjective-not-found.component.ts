import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Adjective } from 'src/app/models/adjective/get/adjective.model';
import { AdjectiveService } from 'src/app/services/adjective.service';
const A = 'adjective';

@Component({
  selector: 'app-adjective-not-found',
  templateUrl: './adjective-not-found.component.html',
  styleUrls: ['./adjective-not-found.component.scss']
})
export class AdjectiveNotFoundComponent implements OnInit {

  public adjective: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private adjectiveService: AdjectiveService

  ) { }

  ngOnInit(): void {
    this.adjective = this.activatedRoute.snapshot.params[A];
    this.adjectiveService.fetchAdjectiveByTranslation(this.adjective);
    this.adjectiveService.adjective$.subscribe(
      (adj: Adjective) => {
        if (adj.id) {
          this.router.navigate(['/adjectives/consult/' + this.adjective]);
        }
      }
    );
  }

}
