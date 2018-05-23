import { AfterViewInit, Component, OnDestroy, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TaskService } from '../../masters/tasks/shared/task.service';

const L = require('leaflet');

@Component({
  selector: 'app-tourlocator-map',
  templateUrl: './tour-locator-map.component.html',
  providers: [TaskService]
})
export class TourLocatorMapComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input('latitude') latitude: string;
  @Input('longitude') longitude: string;
  @Input('tourId') tourId: string;
  @Input('draw') draw: number;
  defaultLat = '28.6252';
  defaultLng = '77.3732';
  zoom = 18;
  isError = false;
  map: any;
  locations: any;
  markers: any;
  featureGroup: any;
  scannedLocations: any;

  constructor(
    private taskService: TaskService
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if ( changes.draw && !changes.draw.firstChange ) {
      this.prepareMapData();
    }
  }

  ngOnInit() {
    this.prepareMapData();
  }

  prepareMapData() {
    // get tour locations
    this.markers = [];
    this.scannedLocations = [];
    if ( this.tourId ) {
      this.locations = [];
      this.taskService.getPublicTourById(this.tourId).subscribe((data: any) => {
        // console.log(data.data.locations.length);
        data.data.locations.forEach((row: any) => {
          this.locations.push({
            id: row.floor.zone.id,
            lat: row.floor.zone.pointCoordinates.coordinates[1],
            lng: row.floor.zone.pointCoordinates.coordinates[0],
            name: row.floor.zone.name + ', ' + row.name
          });
        });
        /// console.log(data.data.scannedLocations);
        if ( data.data.scannedLocations ) {
          data.data.scannedLocations.forEach((row: any) => {
            this.scannedLocations.push({
              id: row.floor.zone.id
            });
          });
        }
      }, () => {
      }, () => {
        const locIcon = L.icon({ iconUrl: 'assets/warehouse.png', shadowUrl: 'assets/warehouse.png' });
        const scannedLocIcon = L.icon({ iconUrl: 'assets/warehouse-check.png', shadowUrl: 'assets/warehouse-check.png' });
        let icon = '';
        this.locations.forEach( (location) => {
          const locFound = this.scannedLocations.filter( loc => loc.id === location.id );
          if ( locFound.length ) {
            icon = scannedLocIcon;
          } else {
            icon = locIcon;
          }
          const marker = L.marker(
            new L.LatLng(location.lat, location.lng),
            { icon: icon, title: location.name }
          ).bindPopup(location.name);
          this.markers.push(marker);
        });
        // console.log(this.markers.length)
        this.featureGroup = L.featureGroup(this.markers).addTo(this.map);
        this.map.fitBounds(this.featureGroup.getBounds());
      });
    }
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  // show current point
  ifCurrentLocation () {
    if ( parseFloat(this.latitude)  && parseFloat(this.longitude) ) {
      return true;
    } else {
      return false;
    }
  }

  ngOnDestroy() {
  }

  initializeMap() {
    const showCurrentLocation = this.ifCurrentLocation();
    if ( showCurrentLocation ) {
      this.defaultLat = this.latitude;
      this.defaultLng = this.longitude;
    }
    this.map = L.map('map').setView(L.latLng(this.defaultLat, this.defaultLng), 14);

    if ( showCurrentLocation ) {
      const curLocIcon = L.icon({ iconUrl: 'assets/icon-location.png', shadowUrl: 'assets/icon-location.png' });
      const curMarker = L.marker(
        new L.LatLng(this.defaultLat, this.defaultLng),
        { icon: curLocIcon, title: 'Current location' }
      ).bindPopup('Current location');
      this.map.addLayer(
        curMarker
      );
      this.markers.push(curMarker);
    }

    const legend = L.control({position: 'topleft'});
    legend.onAdd = function (map: any) {
        map;
        const div = L.DomUtil.create('div', 'info legend');
        const locations = ['Current Location', 'Check Points'];
        const labels = [
          'assets/icon-location.png',
          'assets/warehouse.png'
        ];
        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < locations.length; i++) {
            div.innerHTML += (' <img src=' + labels[i] + '> ') + '<span>' + locations[i] + '</span><br>';
        }
        return div;
    };
    legend.addTo(this.map);

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(this.map);
  }

    /**
     * Refresh map after change in map data
     *
     * @memberof TourLocatorMapComponent
     */
    refreshMap() {
      // set fitBounds here
      this.map.fitBounds(this.featureGroup.getBounds());
    }

}

