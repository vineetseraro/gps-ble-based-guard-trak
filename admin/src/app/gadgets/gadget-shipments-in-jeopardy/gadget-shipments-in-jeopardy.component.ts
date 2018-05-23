import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gadget-shipments-in-jeopardy',
  templateUrl: './gadget-shipments-in-jeopardy.component.html',
  styleUrls: ['./gadget-shipments-in-jeopardy.component.css']
})
export class GadgetShipmentsInJeopardyComponent implements OnInit {

public isShow:boolean= false;

  constructor() { }

  ngOnInit() {
  }
 show_search() {
    this.isShow = !this.isShow;
  }
  close_search(){
    this.isShow = false;
  }

}
