import 'leaflet.markercluster';

import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

import { LocatortypeFactory } from '../../../../core/widget/maps/locatormap/locators/locatortype.factory';
import { LocationService } from './../../../locations/shared/location.service';
import { LocatormapService } from './../../shared/leaflet/locatormap.service';

// ChangeDetectionStrategy
@Component({
  selector: 'app-shipments-map',
  templateUrl: './shipmentmap.component.html',
  // styleUrls: ['./map.component.css'],
  providers: [LocationService, LocatormapService, LocatortypeFactory],
  // changeDetection: ChangeDetectionStrateagy.OnPush
})
export class ShipmentmapComponent implements OnInit {

  cluster:any;
  lat = 28.6252;
  lng = 77.3732;
  zoom = 18;
  locations: any;
  isError = false;
  latlngbounds: any;
  knownLocations: any;
  unknownLocations: any;
  itemsMap: any;
  icons: any;
  map:any;

  constructor(
    private locationService: LocationService,
    private locatormapService: LocatormapService
  ) {

      this.cluster = L.markerClusterGroup();
      this.locations = [];

      this.icons = this.locatormapService.getIconList();

      const self = this;
      this.locationService.getAllPublic('/list').subscribe((data:any) => {
          this.knownLocations = [];
          this.unknownLocations = [];
          data.data.forEach((row:any) => {

            this.knownLocations.push({
                id: row.id,
                key : row.id,
                lat: row.coordinates.latitude,
                lng: row.coordinates.longitude,
                location: row.name,
                // itemCount : this.mapService.getIconText(''),
                items: [],
                lastTracked: 0,
                icon: this.icons.known_noitems
            });
          });
        this.itemsMap = {};
        this.locations = this.knownLocations;
        this.renderPoints();
      }, () => {
          // No Handling
      }, () => {
        locatormapService.initQueue('shipment', this.locations, (locations:any) => {
            self.locations = locations;
            this.renderPoints();
        });
      });

  }

  ngOnInit() {
    this.initializeMap();
  }

  initializeMap() {
      this.map = L.map('map').setView(L.latLng(28.6252, 77.3732), 5);
      L.tileLayer(
          'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
      }).addTo(this.map);
  }

  renderPoints () {
    // let myIcon =  L.icon( { iconUrl: 'assets/marker-icon.png', shadowUrl: 'assets/marker-shadow.png' } );
    let myIcon =  L.icon( { iconUrl: this.icons.known_noitems, shadowUrl: this.icons.known_noitems } );
    this.cluster.clearLayers();
    for (let i = 0; i < this.locations.length; i++) {
      const a = this.locations[i];
      const title = a.location;
      if ( a.icon !== null ) {
        myIcon =  L.icon( { iconUrl: a.icon, shadowUrl: a.icon } );
      }
      const marker = L.marker(new L.LatLng(a.lat, a.lng), {icon: myIcon, title: title });
      let info = '';
      info += '<strong>Location: </strong>' + title + '<br/>';
      if ( a.items ) {
        for (let j = 0; j < a.items.length; j++ ) {
          if ( a.items[j].fields ) {
            for (let k = 0; k < a.items[j].fields.length; k++ ) {
              info += '<strong>' + a.items[j].fields[k].label + ': </strong>' + a.items[j].fields[k].value + '<br/>';
            }
          }
          info += '<div><a href=' + a.items[j].detailsUrl + '>Go To Details</a></div>';
        }
      }
      marker.bindPopup(info);
      this.cluster.addLayer(marker);
    }
    this.map.addLayer(this.cluster);
  }

}

