import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-userpool',
  templateUrl: './userpool-user-group-tabs.component.html',
})
export class UserPoolUserGroupTabsComponent implements OnInit {

  index: number;
  constructor(
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
        this.index = 0;
        if (this.route.snapshot.queryParams['tabId'] !== undefined) {
            this.index = this.route.snapshot.queryParams['tabId'];
        }
  }

}
