import { Component, OnInit } from '@angular/core';
import { GithubService } from 'src/app/services/github.service';
export interface GitRepo {
  name: string;
  description: string;
  url: string;
}
export interface ColData {
  field: string;
  header: string;
}

@Component({
  selector: 'app-github',
  templateUrl: './github.component.html'
})
export class GithubComponent implements OnInit {

  public repositories: Array<GitRepo>;
  public cols: Array<ColData>;

  constructor(
    private githubService: GithubService
  ) { }

  ngOnInit(): void {
    this.cols = [
      {
        field: 'name',
        header: 'Name'
      },
      {
        field: 'description',
        header: 'Description'
      }
    ];
    this.githubService.fetchRepositories();
    this.githubService.repositories$.subscribe((thomasgourouza) => {
      this.repositories = thomasgourouza.map((repo) => {
        return {
          name: repo['full_name'],
          description: repo['description'],
          url: repo['html_url']
        };
      });
    });
  }

}
