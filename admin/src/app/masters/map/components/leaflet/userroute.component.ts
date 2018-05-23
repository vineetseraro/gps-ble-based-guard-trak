import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-userroute-url',
  templateUrl: './userroute.component.html',
})

export class UserrouteComponent implements OnInit {

  employeeId: string;

  constructor(
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.route.params.subscribe( (params: any) => {
        if (params.hasOwnProperty('employeeId')) {
            this.employeeId = params['employeeId'];
        }
    });

  }


}

