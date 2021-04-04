import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GithubApi } from './api/githubApi.service';

@Injectable({
    providedIn: 'root'
})
export class GithubService {

    private _repositories$ = new BehaviorSubject([]);

    constructor(
        private githubApi: GithubApi
    ) { }

    public get repositories$() {
        return this._repositories$.asObservable();
    }

    public fetchRepositories(): void {
        this.githubApi.getThomasGourouzaRepositories()
            .subscribe((repositories: Array<any>) => {
                this._repositories$.next(repositories);
            });
    }

}
