import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, SelectItem } from 'primeng/primeng';
import { Subscription } from 'rxjs/Rx';

import { GlobalService } from '../../core/global.service';
// import { StringUtil } from '../../core/string.util';
import { TourEvent } from '../shared/employee.model';
import { ReportService } from '../shared/report.service';
import { EmptyDataPipe } from './../../core/pipes/empty-data.pipe';

@Component({
  selector: 'app-report-incident-details-report',
  templateUrl: './report-incident-details-report.component.html',
  styleUrls: ['./report-event-report.component.css'],
  providers: [ReportService, EmptyDataPipe]
})
export class ReportIncidentDetailsReportComponent implements OnInit, OnDestroy {
  isTableReset = false;
  private subscription: Subscription;
  dataRow: TourEvent;
  display = false;
  eventId = '';
  title = '';
  totalRecords = 0;
  innerHeight: any;
  activeStatus: SelectItem[];
  images = [];

  items: MenuItem[];
  loader = false;
  referer = '';
  emptyMessage = '';
  eventdetails = [];
  locationData: any;
  /**
   * Creates an instance of ReportIncidentDetailsReportComponent.
   * @param {ReportService} reportService
   * @param {GlobalService} globalService
   * @memberof ReportEventReportComponent
   */
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private reportService: ReportService,
    private globalService: GlobalService,
    private emptyDataPipe: EmptyDataPipe
  ) {
  }


  /**
   * Init Method
   * @memberof ReportIncidentDetailsReportComponent
   */
  public ngOnInit() {
    this.eventId = '';
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.eventId = params['id'];

        this.reportService.eventDetails(this.eventId, '').subscribe((data: any) => {
          this.eventdetails = this.getEventDetails(data.data);
          this.locationData = data.data.location;
          // console.log('DDDDDDDDDDDDDDDDDDDDDDDDDD')
          // console.log(this.locationData);
          this.heightCalc();
        }, () => {
          // No Handling
        }, () => {
        });
        this.route.queryParams.subscribe((qparams: any) => {
          if (qparams.hasOwnProperty('referer')) {
            this.referer = qparams.referer;
          }
        });
      }
    });
  }

  public getEventDetails(data) {
    let zone = '';
    let latLngStr = '';
    if (typeof data.location.id !== 'undefined') {
      if (data.location.id === null) {
        if ( data.location.address !== ', , , ' ) {
          zone = data.location.address;
        }
      } else {
        zone = data.location.name;
      }
    }
    const latLng = data.location.pointCoordinates.coordinates.slice();
    latLngStr = this.globalService.formatLatLong(latLng.reverse());

    const eventdetails = [
      { 'label': 'Tour', 'value': data.task.name + ' - ' + data.tour.tourId, 'isImage': false },
      { 'label': 'Device', 'value': this.emptyDataPipe.transform(data.device.name), 'isImage': false },
      { 'label': 'App User', 'value': this.emptyDataPipe.transform(data.updatedBy.fullName), 'isImage': false },
      { 'label': 'Guard', 'value': this.emptyDataPipe.transform(data.attendee.fullName), 'isImage': false },
      { 'label': 'Location', 'value': zone + latLngStr, 'isImage': false },
      { 'label': 'Incident Date', 'value': data.action.actionDate, 'isImage': false },
      // {'label': 'Event', 'value': data.action.actionType, 'isImage' : false}
    ];

    if (typeof data.tour.tourId === 'undefined') {
      eventdetails[0].value = '-';
    }

    eventdetails.push({
      'label': 'Message',
      'value': data.additionalInfo.incident.data, 'isImage': false
    });

    console.log(eventdetails);

    data.additionalInfo.incident.images.forEach((imageRow) => {
      this.images.push(this.globalService.processImage(imageRow));
    });

    return eventdetails;
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public heightCalc() {
    this.innerHeight = (window.screen.height);
    this.innerHeight = (this.innerHeight - 400) + 'px';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerHeight = ((event.target.innerHeight) - 290) + 'px';
  }

  public navigateToList() {
    if (this.referer === '') {
      this.router.navigate(['/reports/tourincidents']);
    } else {
      this.router.navigate([this.referer]);
    }
  }
}
