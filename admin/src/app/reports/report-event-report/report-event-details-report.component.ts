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
  selector: 'app-report-event-details-report',
  templateUrl: './report-event-details-report.component.html',
  styleUrls: ['./report-event-report.component.css'],
  providers: [ReportService, EmptyDataPipe]
})
export class ReportEventDetailsReportComponent implements OnInit, OnDestroy {
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
  /**
   * Creates an instance of ReportEventDetailsReportComponent.
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
   * @memberof ReportEventDetailsReportComponent
   */
  public ngOnInit() {
    this.eventId = '';
    this.route.params.subscribe((params: any) => {
      if (params.hasOwnProperty('id')) {
        this.eventId = params['id'];

        this.reportService.eventDetails(this.eventId, '').subscribe((data: any) => {
          this.eventdetails = this.getEventDetails(data.data);
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
    let zone = this.emptyDataPipe.transform('');
    let latLngStr = '';
    if (typeof data.location !== 'undefined' && typeof data.location.id !== 'undefined') {
      if ( data.action.actionType === 'Incident' ) {
        if (data.location.id === null) {
          zone = data.location.address;
        } else {
          zone = data.location.name;
        }
      } else {
        if ( typeof data.location.floor !== 'undefined' && typeof data.location.floor.zone !== 'undefined' ) {
          if (typeof data.location.floor.zone.id !== 'undefined') {
            zone = data.location.floor.zone.name + ', ' + data.location.name;
          }
        }
      }
      const latLng = data.location.pointCoordinates.coordinates.slice();
      latLngStr = ' ( ' + latLng.reverse().join(' ,') + ' )';
    }

    const eventdetails = [
      { 'label': 'Tour', 'value': data.task.name + ' - ' + data.tour.tourId, 'isImage': false },
      { 'label': 'Device', 'value': this.emptyDataPipe.transform(data.device.name), 'isImage': false },
      { 'label': 'App User', 'value': this.emptyDataPipe.transform(data.updatedBy.fullName), 'isImage': false },
      { 'label': 'Guard', 'value': this.emptyDataPipe.transform(data.attendee.fullName), 'isImage': false },
      { 'label': 'Location', 'value': zone + latLngStr, 'isImage': false },
      { 'label': 'Event', 'value': data.action.actionType, 'isImage': false },
      { 'label': 'Event Date', 'value': data.action.actionDate, 'isImage': false },
    ];

    if (typeof data.tour.tourId === 'undefined') {
      eventdetails[0].value = '-';
    }

    switch (data.action.actionType) {
      case 'Scan':
        eventdetails.push({
          'label': 'Sensor',
          'value': data.additionalInfo.scan.sensor.name +
            ' ( ' + data.additionalInfo.scan.sensor.code + ' )',
          'isImage': false
        });
        eventdetails.push({
          'label': 'Device',
          'value': data.additionalInfo.scan.device.name +
            ' ( ' + data.additionalInfo.scan.device.model + ' ' +
            data.additionalInfo.scan.device.os + ' )',
          'isImage': false
        });
        break;
      case 'Incident':
        eventdetails.push({
          'label': 'Message',
          'value': data.additionalInfo.incident.data, 'isImage': false
        });
        data.additionalInfo.incident.images.forEach((imageRow) => {
          // eventdetails.push({'label': 'Screenshot ', 'value': imageRow.url, 'isImage' : true})
          this.images.push(this.globalService.processImage(imageRow));
        });

        break;
      default:
        break;
    }
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
      this.router.navigate(['/reports/tourevents']);
    } else {
      this.router.navigate([this.referer]);
    }
  }
}
