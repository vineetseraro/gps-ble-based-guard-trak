import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';

import { TaskService } from '../../masters/tasks/shared/task.service';

@Component({
  selector: 'app-report-tour-detail',
  templateUrl: './tourdetail.component.html',
  providers: [TaskService]
})
export class TourDetailComponent implements OnInit, OnDestroy {
  isTableReset = false;
  private subscription: Subscription;
  id = '';
  title = '';
  loader = false;
  tour: any;

  /**
   * Creates an instance of TourDetailComponent.
   * @param {Router} router
   * @param {GlobalService} globalService
   * @param {ActivatedRoute} route
   */
  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }


  /**
   * Init Method
   * @memberof OrderListComponent
   */
  ngOnInit() {
    this.title = 'Tour Detail';
    this.subscription = this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id')) {
          this.id = params['id'];
          this.loader = true;
          this.taskService.getPublicTourById(this.id).subscribe((data: any) => {
            this.loader = false;
            this.tour = data.data;
            this.reOrderEvents();
          });
        }
      }
    );
  }

  reOrderEvents() {
    if ( this.tour && this.tour.actions ) {
      this.tour.actions.push(this.tour.actions.splice(1, 1)[0]);
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  navigateToList() {
    this.router.navigate(['/reports/tourreport'], {queryParams: {referer: 'tourdetail'}});
  }

}
