import { MapsAPILoader } from '@agm/core';
import { Component, Input, OnInit } from '@angular/core';

import { LocatortypeFactory } from '../locatormap/locators/locatortype.factory';
import { LocationService } from './../../../../masters/locations/shared/location.service';
import { MapService } from './../shared/map.service';
import { RoutemapService } from './routemap.service';

declare var google: any;
// declare var AWS: any;

/**
 * RoutemapComponent widget class for route type maps
 *
 * @export
 * @class RoutemapComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-route-map',
  templateUrl: './routemap.component.html',
  styleUrls: ['./routemap.component.css'],
  providers: [LocationService, RoutemapService, LocatortypeFactory, MapService]
})

export class RoutemapComponent implements OnInit {

  credentials: any;
  lat = 28.6252;
  lng = 77.3732;
  zoom= 14;
  locations: any;
  isError = false;
  latlngbounds: any;
  knownLocations: any;
  unknownLocations: any;
  itemsMap: any;
  icons: any;
  @Input('routeType') routeType: string;
  @Input('itemId') itemId: string;

  /**
   * Creates an instance of RoutemapComponent.
   * @param {MapsAPILoader} mapsAPILoader
   * @param {LocationService} locationService
   * @param {RoutemapService} routemapService
   * @param {MapService} mapService
   * @memberof RoutemapComponent
   */
  constructor(
    private mapsAPILoader: MapsAPILoader,
    private locationService: LocationService,
    private routemapService: RoutemapService,
    private mapService: MapService
    ) {
      // Getting AWS creds from Cognito is async, so we need to drive the rest of the mqtt client initialization in a callback
      const self = this;
      this.locationService.getAllPublic('/list').subscribe((data:any) => {
          this.locations = [];
          this.knownLocations = [];
          this.unknownLocations = [];
          this.icons = this.mapService.getIconList();

          data.data.forEach((row:any) => {

            this.knownLocations.push({
                id: row.id,
                key : row.id,
                lat: row.coordinates.latitude,
                lng: row.coordinates.longitude,
                location: row.name,
                animation: google.maps.Animation.DROP,
                itemCount : this.mapService.getIconText(''),
                dt: '',
                items: {},
                lastTracked: 0,
                icon: this.mapService.getIcon(this.icons.known_noitems)
            });
          });
        this.itemsMap = {};
        // this.locations = this.knownLocations;
        // this.refreshMap();
      }, () => {
          // No Handling
      }, () => {
        this.routemapService.initQueue(this.itemId, this.routeType, this.locations, (locations:any) => {
            self.locations = locations;
           // self.refreshMap();
        });
      });
  }

  /**
   *
   *
   * @memberof RoutemapComponent
   */
  ngOnInit() {
  }

  /**
   * Utility method for convert string to number
   *
   * @param {string} value
   * @returns {number}
   * @memberof RoutemapComponent
   */
  convertStringToNumber(value: string): number {
    return +value;
  }

  /**
   * Refresh map after change in map data
   *
   * @memberof RoutemapComponent
   */
  refreshMap( ) {
    // set fitBounds here
    const that = this;
    console.log(this.locations);
    this.mapsAPILoader.load().then(() => {
        that.latlngbounds = new google.maps.LatLngBounds();
        that.locations.forEach(( loc ) => {
            that.latlngbounds.extend(new google.maps.LatLng(loc.lat, loc.lng));
        });
    });
  }

}

