import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../../../masters/tasks/shared/task.service';
import { interval } from 'rxjs/observable/interval';
import { environment } from './../../../../../environments/environment';
/**
 * Device Map Component
 *
 * @export
 * @class ToursComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-tours-map',
  templateUrl: './tours.component.html',
  providers: [TaskService]
})

export class ToursComponent implements OnInit, OnDestroy {
  isError = false;
  sub: any;
  latitude: string;
  longitude: string;
  tourId: string;
  deviceId: string;
  ts: string;
  loadMap: boolean;
  mapIntervalObj: any;
  draw: number;
  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService
  ) {

  }

  /**
   * On Init Method
   *
   * @memberof UsersComponent
   */
  ngOnInit() {
    const refreshMapInterval = +environment.defaultConfig.refreshMapInterval || 300;
    this.mapIntervalObj = interval( refreshMapInterval * 1000 );
    this.loadMap = false;
    this.sub = this.route.queryParams
      .subscribe(params => {
        this.latitude = params.latitude;
        this.longitude = params.longitude;
        // this.tourId = params.tourId;
        this.deviceId = params.deviceId;
        this.ts = params.ts;
        this.getData();
      });
    this.mapIntervalObj.subscribe( () => {
      this.getData();
    });
  }

  getData() {
    this.taskService.getPublicTourByDeviceAndTime(this.deviceId, this.ts).subscribe((data: any) => {
      this.loadMap = true;
      if (typeof data.data.id !== 'undefined') {
        this.tourId = data.data.id;
        this.draw = Math.random();
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.mapIntervalObj.unsubscribe();
  }

}

