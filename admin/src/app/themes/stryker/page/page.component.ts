import { DashboardService } from '../services/dashboard.service';
import { ScreenService } from '../services/screen.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {

  isMenuExpanded: boolean;
  isMenuVisible: boolean;

  constructor(
    public DashboardService: DashboardService,
    public ScreenService: ScreenService
  ) {
    this.isMenuExpanded = this.DashboardService.isMenuExpanded;
    this.isMenuVisible = this.DashboardService.isMenuVisible;
  }



  ngOnInit() {

  }

}
