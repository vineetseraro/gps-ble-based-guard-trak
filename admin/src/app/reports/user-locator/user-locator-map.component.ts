import 'leaflet.markercluster';

import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment';
import { GlobalService } from '../../core/global.service';
import { LocatortypeFactory } from '../../core/widget/maps/locatormap/locators/locatortype.factory';
import { LocationService } from '../../masters/locations/shared/location.service';
import { LocatormapService } from '../../masters/map/shared/leaflet/locatormap.service';

const L = require('leaflet');
@Component({
  selector: 'app-userlocator-map',
  templateUrl: './user-locator-map.component.html',
  providers: [GlobalService, LocationService, LocatormapService, LocatortypeFactory, DatePipe]
})
export class UserLocatorMapComponent implements OnInit, OnDestroy, AfterViewInit {

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
  liveUpdate: boolean;
  toggleLiveLabel: string;
  knownCoreLocations: any;
  showKnownLocation: boolean;
  toggleKnownLocationLabel:any;
  geoJsonLayer:any;
  users: any;
  userPoints: any;
  userId:any;
  constructor(
    private globalService: GlobalService,
    private locationService: LocationService,
    private locatormapService: LocatormapService,
  ) {
    this.liveUpdate = true;
    this.toggleLiveLabel = 'Stop Live Updates';
    this.showKnownLocation = true;
    this.toggleKnownLocationLabel = 'Hide Known Locations';
    this.cluster = L.markerClusterGroup();
    this.geoJsonLayer = L.layerGroup();
    this.locations = [];
    this.userPoints = [];

    this.icons = this.globalService.getIconList('empTrack');

    this.globalService.getUserDropdown('users' + environment.serverEnv).subscribe((data:any) => {
      this.users  = this.globalService.prepareUserDropDown(data.data, 'Select User', false);
    });

    const self = this;
    this.knownLocations = [];
    this.unknownLocations = [];
    this.knownCoreLocations = [];    

    this.locationService.getAll('').finally(()=>{
      this.itemsMap = {};
      this.knownCoreLocations = this.knownLocations;
      // render core locations
      this.renderKnownLocations(this.knownCoreLocations);

      this.locatormapService.initQueue('user', this.knownCoreLocations, (locations:any) => {
        console.log(locations);
        self.locations = locations;
        this.renderPoints();
      });
    }).subscribe((data:any) => {
      data.data.forEach((row:any) => {
        if ( row.status ) {
          this.knownLocations.push({
            id: row.id,
            key: row.id,
            lat: row.coordinates.latitude,
            lng: row.coordinates.longitude,
            location: row.name,
            address: this.globalService.formatCommaSeperatedData([row.address, row.city, row.state, row.country]),
            items: [],
            lastTracked: 0,
            icon: this.icons.known_noemployees,
            /*geojsonFeature: [
              {
                "type": "Feature",
                "properties": {
                  "name": row.name
                },
                "geometry": row.perimeter
              }
            ]*/
          });
        }
      });
  }, () => {
      // No Handling
  }, () => {

  });

    // this.locationService.getAllPublic('/list').subscribe((data:any) => {
    //   this.knownLocations = [];
    //   this.unknownLocations = [];
    //   this.knownCoreLocations = [];

    //   data.data.forEach((row:any) => {

    //     this.knownLocations.push({
    //       id: row.id,
    //       key: row.id,
    //       lat: row.coordinates.latitude,
    //       lng: row.coordinates.longitude,
    //       location: row.name,
    //       address: this.globalService.formatCommaSeperatedData([row.address, row.city, row.state, row.country]),
    //       items: [],
    //       lastTracked: 0,
    //       icon: this.icons.known_noemployees,
    //       geojsonFeature: [
    //         {
    //           "type": "Feature",
    //           "properties": {
    //             "name": row.name
    //           },
    //           "geometry": row.perimeter
    //         }
    //       ]
    //     });
    //   });

    //   this.knownCoreLocations = this.knownLocations;
    //   // render core locations
    //   this.renderKnownLocations(this.knownCoreLocations);

    //   this.itemsMap = {};

    //   this.locatormapService.initQueue('user', this.knownCoreLocations, (locations:any) => {
    //     console.log(locations);
    //     self.locations = locations;
    //     this.renderPoints();
    //   });      

    // }, () => {
    //   // No Handling
    // }, () => {

    // });

  }

  ngOnInit() {
    // this.initializeMap();
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  ngOnDestroy() {
    this.locatormapService.closeQueue();
  }

  initializeMap() {
    const self = this;
    this.map = L.map('map').setView(L.latLng(28.6252, 77.3732), 5);
    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(this.map);

    const legend = L.control({ position: 'topleft' });

    legend.onAdd = function (map:any) {
      map;
      const div = L.DomUtil.create('div', 'info legend');
      const locations = [
        'Location',
        'Location with Guard',
        'Guard',
      ];
      const labels = [
        self.icons.known_noemployees,
        self.icons.known_employees,
        self.icons.employees,
      ];

      // loop through our density intervals and generate a label with a colored square for each interval
      for (let i = 0; i < locations.length; i++) {
        div.innerHTML += (' <img src=' + labels[i] + '> ') + '<span>' + locations[i] + '</span>' + '<br>';
      }
      return div;
    };

    legend.addTo(this.map);
  }

  renderKnownLocations(locations:any) {
    const self = this;
    let myIcon = L.icon({ iconUrl: this.icons.known_noemployees, shadowUrl: this.icons.known_noemployees });
    this.cluster.clearLayers();
    console.log('IN Known Locations RENDER');
    for (let i = 0; i < locations.length; i++) {
      const a = locations[i];
      const title = a.location;
      const marker = L.marker(new L.LatLng(a.lat, a.lng), { icon: myIcon, title: title });
      let info = '';
      info += '<div style="margin-bottom: -12px;"><div>' + title + '</div>';
      if (typeof a.address !== 'undefined') {
        info += (a.address);
      }
      info += '</div></br>';
      marker.bindPopup(L.popup({ maxHeight: 300 }).setContent(info));
      self.cluster.addLayer(marker);

      if (a.id !== null && a.geojsonFeature) {
        /*self.geoJsonLayer = L.geoJSON(a.geojsonFeature, {
          onEachFeature: self.onEachFeature
          style: function (feature:any) {
            feature;
            return { color: "#FF6666", "weight": 0.5 };
          }
        });

        self.geoJsonLayer.addTo(self.map);*/
        // self.cluster.addLayer(self.geoJsonLayer);
      }
    }

    this.map.addLayer(this.cluster);
  }

  renderPoints() {
    const self = this;
    let myIcon = L.icon({ iconUrl: this.icons.known_noemployees, shadowUrl: this.icons.known_noemployees });
    this.cluster.clearLayers();
    console.log('IN RENDER');
    for (let i = 0; i < this.locations.length; i++) {
      const a = this.locations[i];
      if (a.id === null) {
        if (a.items.length > 1) {
          myIcon = L.icon({ iconUrl: this.icons.employees, shadowUrl: this.icons.employees });
        } else if (a.items.length === 1) {
          myIcon = L.icon({ iconUrl: this.icons.employees, shadowUrl: this.icons.employees });
        } else {
          myIcon = L.icon({ iconUrl: a.icon, shadowUrl: a.icon });
        }
      } else {
        myIcon = L.icon({ iconUrl: a.icon, shadowUrl: a.icon });
      }

      const title = a.location;
      const marker = L.marker(new L.LatLng(a.lat, a.lng), { icon: myIcon, title: title });
      let info = '';
      info += '<div style="margin-bottom: -12px;"><div>' + title + '</div>';
      if (typeof a.address !== 'undefined') {
        info += (a.address);
      }

      info += '</div></br>';
      if (a.items) {
        for (let j = 0; j < a.items.length; j++) {
          if (a.items[j].fields) {
            info += '<div>';
            for (let k = 0; k < a.items[j].fields.length; k++) {
              self.userPoints.push(L.latLng(a.lat, a.lng));
              if (a.items[j].fields[k].name === 'code') {
                info += '<strong>' + a.items[j].fields[k].label +
                  ': </strong> <a href="' + a.items[j].detailsUrl + '">' +
                  a.items[j].fields[k].value + '</a><br/>';
              } else {
                info += '<strong>' + a.items[j].fields[k].label + ': </strong>' + a.items[j].fields[k].value + '<br/>';
              }
            }
            info += '</div>';
          }
        }
      }
      marker.bindPopup(L.popup({ maxHeight: 300 }).setContent(info));
      this.cluster.addLayer(marker);
    }

    this.map.addLayer(this.cluster);
  }

  onEachFeature(feature:any, layer:any) {
    if (feature.properties && feature.properties.name) {
      layer.bindPopup(feature.properties.name);
    }
  }

  /**
  * Refresh map after change in map data
  *
  * @memberof ShipmentLocatorMapComponent
  */
  refreshMap() {
    // set fitBounds here
    this.map.fitBounds(this.cluster.getBounds(), { maxZoom: 16 });
    // if ( this.userPoints.length ) {
    //   console.log(this.us  erPoints);
    //   this.map.fitBounds(L.latLngBounds(this.userPoints), { maxZoom: 16 });
    // }
  }

  toggleLiveUpdates() {
    const self = this;
    if (this.liveUpdate === false) {
      this.liveUpdate = true;
      this.toggleLiveLabel = 'Stop Live Updates';
      this.locatormapService.initQueue('user', this.locations, (locations:any) => {
        self.locations = locations;
        self.renderPoints();
      });
    } else {
      this.liveUpdate = false;
      this.toggleLiveLabel = 'Start Live Updates';
      this.locatormapService.closeQueue();
    }
  }

  toggleKnownLocations() {
    // const self = this;
    // if (this.showKnownLocation === false) {
    //   this.showKnownLocation = true;
    //   this.toggleKnownLocationLabel = 'Hide Known Locations';
    //   //  self.renderKnownLocations(self.knownCoreLocations);
    //   // self.geoJsonLayer.clearLayers();
    //   // self.cluster.clearLayers();
    //   // self.cluster.removeLayer(self.geoJsonLayer);
    // } else {
    //   this.showKnownLocation = false;
    //   this.toggleKnownLocationLabel = 'Show Known Locations';
    //   this.map.removeLayer(this.geoJsonLayer);
    //   this.geoJsonLayer.clearLayers();
    //   this.cluster.clearLayers();
    //   this.locatormapService.initQueue('user', this.knownCoreLocations, (locations) => {
    //     console.log(locations);
    //     self.locations = locations;
    //     self.renderPoints();
    //   });
    // }
  }

  filterUser(event:any) {
    console.log(event.value);
    // this.userId = '';
    // const self = this;
    // if ( event.value ) {
    //   this.cluster.clearLayers();
    //   this.locatormapService.closeQueue();
    //   this.userId = event.value;
    //   this.locatormapService.initQueue('user', self.locations, (locations:any) => {
    //     self.locations = locations;
    //     self.renderKnownLocations(self.knownCoreLocations);
    //     self.renderPoints();
    //   }, self.userId);
    // }

  }

}

