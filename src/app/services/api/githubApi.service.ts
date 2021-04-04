import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const GITHUB_THOMAS_GOUROUZA_URL = 'https://api.github.com/users/ThomasGourouza/repos';

@Injectable({
    providedIn: 'root'
})
export class GithubApi {

    constructor(
        private http: HttpClient
    ) { }

    public getThomasGourouzaRepositories(): Observable<Array<any>> {
        const headers = new HttpHeaders({ 'Accept': 'application/vnd.github.v3+json' });
        return this.http.get<Array<any>>(GITHUB_THOMAS_GOUROUZA_URL, { headers });
    }

}
