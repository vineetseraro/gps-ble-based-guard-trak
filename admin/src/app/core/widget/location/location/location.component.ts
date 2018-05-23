import { AgmMap, GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';
import { ElementRef, EventEmitter, Input, Output } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

declare var google: any;

@Component({
  selector: 'app-location-widget',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css'],
  providers: [GoogleMapsAPIWrapper]
})
export class LocationComponent implements OnInit {
  latitude: number;
  longitude: number;
  radius: number;
  searchControl: FormControl;
  zoom: number;
  loader = false;
  city: string; state: string; country: string; zipcode: string; address: string; postal_code: string;
  addressArray = [];
  measurementUnit = '';
  loaderMap = false;
  @Input('parentFormGroup') parentFormGroup: FormGroup;
  @Input('showLocation') showLocation: Boolean;
  @Input('processClick') processClick: Boolean;
  @Input('disableSearch') disableSearch: Boolean;

  @Output() locationUpdated: EventEmitter<FormGroup> = new EventEmitter();

  @ViewChild("search")
  @ViewChild(AgmMap) myMap: AgmMap;
  public searchElementRef: ElementRef;



  constructor(
    private mapsAPILoader: MapsAPILoader) { }


  ngOnInit() {
    this.radius = 300;
    this.searchControl = new FormControl();
    this.setCurrentPosition();
    if (window.localStorage.getItem('measurement') !== '' && window.localStorage.getItem('measurement') !== undefined) {
      if (window.localStorage.getItem('measurement') === 'Imperial') {
        this.measurementUnit = '(Feet)';
      } else {
        this.measurementUnit = '(Meter)';
      }
    }
    // console.log(typeof this.processClick);
    // console.log(this.processClick);
    if (typeof this.processClick === 'undefined') {
      this.processClick = false;
    }

    if (typeof this.disableSearch === 'undefined') {
      this.disableSearch = false;
    }
    console.log(this.disableSearch);

  }

  public searchLocation(address: any) {
    this.loader = true;
    this.mapsAPILoader.load().then(() => {
      this.address = '';
      this.city = '';
      this.state = '';
      this.country = '';
      this.zipcode = '';
      this.radius = 300;
      this.addressArray = [];
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': address }, (results: any, status: any) => {
        status = status;
        if (results.length > 0) {
          const gaddress_components = results[0].address_components;
          for (let i = 0; i < gaddress_components.length; i++) {
            const comps = gaddress_components[i];
            const longName: any = comps.long_name;
            if (comps.types.indexOf('administrative_area_level_2') >= 0) {
              this.city = longName;
            } else if (comps.types.indexOf('administrative_area_level_1') >= 0) {
              this.state = longName;
            } else if (comps.types.indexOf('country') >= 0) {
              this.country = longName;
            } else if (comps.types.indexOf('postal_code') >= 0) {
              this.postal_code = longName;
            } else {
              this.addressArray.push(longName);
            }
          }
          this.address = this.addressArray.join(',');
        }
        this.parentFormGroup.patchValue({
          address: this.address,
          city: this.city,
          state: this.state,
          country: this.country,
          zipcode: this.postal_code,
          latitude: +results[0].geometry.location.lat().toFixed(8),
          longitude: +results[0].geometry.location.lng().toFixed(8),
          radius: this.radius,
        });

        this.latitude = +results[0].geometry.location.lat().toFixed(8);
        this.longitude = +results[0].geometry.location.lng().toFixed(8);
        this.zoom = 16;
        this.loader = false;
        this.showLocation = true;
        this.locationUpdated.emit(this.parentFormGroup);

      });
    });
  }

  setRadius() {
    this.radius = this.parentFormGroup.value.radius;
    this.locationUpdated.emit(this.parentFormGroup);
  }

  private setCurrentPosition() {
    this.loaderMap = true;
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (this.showLocation === false) {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          this.zoom = 16;
        } else {
          this.latitude = parseFloat(this.parentFormGroup.value.latitude);
          this.longitude = parseFloat(this.parentFormGroup.value.longitude);
          this.radius = this.parentFormGroup.value.radius;
          this.zoom = 16;
        }
      });
      this.loaderMap = false;
    }
  }

  getCity() {
    if (this.city === '' || this.city !== undefined) {
      return false;
    } else {
      return true;
    }
  }

  // center map if required.
  centerMap() {
    const self = this;
    this.mapsAPILoader.load().then(() => {
      if (self.myMap) {
        self.myMap.triggerResize()
          .then(() => {
            (self.myMap as any)._mapsWrapper.setCenter({ lat: +this.latitude, lng: +this.longitude });
          });
      }
    });
  }

  placeMarker(event) {
    if (this.processClick === true) {
      this.parentFormGroup.patchValue({
        // address: this.address,
        // city: this.city,
        // state: this.state,
        // country: this.country,
        // zipcode: this.postal_code,
        latitude: +event.coords.lat.toFixed(8),
        longitude: +event.coords.lng.toFixed(8),
        radius: this.radius
      });
      // this.latitude = event.coords.lat;
      // this.longitude = event.coords.lng;
      this.latitude = +event.coords.lat.toFixed(8);
      this.longitude = +event.coords.lng.toFixed(8);
    }
  }

}
