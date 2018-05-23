import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-shipmentroute-url',
  templateUrl: './Shipmentroute.component.html',
})

export class ShipmentrouteComponent implements OnInit {

  shipmentId: string;

  constructor(
    private route: ActivatedRoute
  ) {

  }

  ngOnInit() {
    this.route.params.subscribe( (params: any) => {
        if (params.hasOwnProperty('shipmentid')) {
            this.shipmentId = params['shipmentid'];
            // console.log(this.shipmentId);
        }
    });

  }


}

