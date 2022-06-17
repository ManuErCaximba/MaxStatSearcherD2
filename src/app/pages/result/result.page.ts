import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-result',
  templateUrl: './result.page.html',
  styleUrls: ['./result.page.scss'],
})
export class ResultPage implements OnInit {

  public results;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.results = this.route.snapshot.paramMap.get('results');
    if (this.results === null || this.results === undefined) {
      this.router.navigate(['/build-searcher']);
    } else {
      console.log(this.results);
    }
  }

}
