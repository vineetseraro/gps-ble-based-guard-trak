import { MapsAPILoader } from '@agm/core';
import { Component, Input, OnInit } from '@angular/core';

import { CognitoUtil } from '../../../../core/aws/cognito.service';
import { LocationService } from './../../../../masters/locations/shared/location.service';
import { MapService } from './../shared/map.service';
// import { SigV4Utils } from './../shared/sigv4utils.service';
import { LocatormapService } from './locatormap.service';
import { LocatortypeFactory } from './locators/locatortype.factory';

declare var google: any;
// declare var AWS: any;
/**
 * LocatormapComponent widget class for locator type maps
 *
 * @export
 * @class LocatormapComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-locator-map',
  templateUrl: './locatormap.component.html',
  styleUrls: ['./locatormap.component.css'],
  providers: [LocationService, LocatormapService, LocatortypeFactory, MapService]
})

export class LocatormapComponent implements OnInit {

  credentials: any;
  lat = 28.6252;
  lng = 77.3732;
  zoom = 14;
  locations: any;
  isError = false;
  latlngbounds: any;
  knownLocations: any;
  unknownLocations: any;
  itemsMap: any;
  icons: any;
  @Input('locatorType') locatorType: string;

  /**
   * Creates an instance of LocatormapComponent.
   * @param {CognitoUtil} cognitoUtil
   * @param {SigV4Utils} sigV4Utils
   * @param {MapsAPILoader} mapsAPILoader
   * @param {LocationService} locationService
   * @param {LocatormapService} locatormapService
   * @param {MapService} mapService
   * @memberof LocatormapComponent
   */
  constructor(
      public cognitoUtil: CognitoUtil,
      // private sigV4Utils: SigV4Utils,
      private mapsAPILoader: MapsAPILoader,
      private locationService: LocationService,
      private locatormapService: LocatormapService,
      private mapService: MapService
    ) {
      // Getting AWS creds from Cognito is async, so we need to drive the rest of the mqtt client initialization in a callback
      const self = this;
            console.log('IN CONSTUNTOR');
      this.locationService.getAllPublic('/list').subscribe((data:any) => {
          // console.log("IN LOC LOOP 111");
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
                items: [],
                lastTracked: 0,
                icon: this.mapService.getIcon(this.icons.known_noitems)
            });
          });
        this.itemsMap = {};
        this.locations = this.knownLocations;
        // this.refreshMap();
      }, () => {
          // No Handling
      }, () => {
        this.locatormapService.initQueue(this.locatorType, this.locations, (locations:any) => {
            self.locations = locations;
            // self.refreshMap();
        });

      });
  }

  /**
   *
   *
   * @memberof LocatormapComponent
   */
  ngOnInit() {
  }

  /**
   * Utility method for convert string to number
   *
   * @param {string} value
   * @returns {number}
   * @memberof LocatormapComponent
   */
  convertStringToNumber(value: string): number {
    return +value;
  }

  /**
   * Refresh map after change in map data
   *
   * @memberof LocatormapComponent
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

