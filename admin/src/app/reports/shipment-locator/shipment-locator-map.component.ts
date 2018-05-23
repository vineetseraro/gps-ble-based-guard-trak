import 'leaflet.markercluster';

import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';

import { environment } from '../../../environments/environment';
import { GlobalService } from '../../core/global.service';
import { LocatortypeFactory } from '../../core/widget/maps/locatormap/locators/locatortype.factory';
import { LocationService } from '../../masters/locations/shared/location.service';
import { LocatormapService } from '../../masters/map/shared/leaflet/locatormap.service';
import { ReportService } from '../shared/report.service';

// ChangeDetectionStrategy
const L = require('leaflet');
@Component({
  selector: 'app-shipmentlocator-map',
  templateUrl: './shipment-locator-map.component.html',
  // styleUrls: ['./shipment-locator.component.css'],
  providers: [GlobalService, LocationService, LocatormapService, LocatortypeFactory, ReportService, DatePipe],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShipmentLocatorMapComponent implements OnInit, OnDestroy, AfterViewInit {

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

  constructor(
    private globalService: GlobalService,
    private locationService: LocationService,
    private locatormapService: LocatormapService,
    private reportService: ReportService
  ) {
    this.liveUpdate = true;
    this.toggleLiveLabel = 'Stop Live Updates';
      this.cluster = L.markerClusterGroup();
      this.locations = [];

      this.icons = this.globalService.getIconList();
      this.knownLocations = [];
      this.unknownLocations = [];
      const self = this;
      this.locationService.getAll('').finally(()=>{
        this.itemsMap = {};
        
        this.reportService.shipmentLocatorMap('').subscribe(mapdata => {
          // console.log(mapdata.data);
          mapdata.data.forEach((maprow) => {
            if (maprow.type === 'unknown' ) {
              const coordsArray = maprow.key.split('-');
              const rlat = Number(coordsArray[0]).toFixed(4);
              const rlon = Number(coordsArray[1]).toFixed(4);

              const locrow:any = {
                id: null,
                key: Number(rlat) + '/' + Number(rlon),
                lat: Number(rlat),
                lng: Number(rlon),
                location: maprow.location,
                // animation: google.maps.Animation.DROP,
                // itemCount: this.mapService.getIconText(''),
                items: [],
                // lastTracked: 0,
                icon: self.icons.unknown_items
              };
              maprow.shipments.forEach( (mapprodrow:any) => {

                locrow.items.push({
                  itemId: mapprodrow.id,
                  detailsUrl: '/shipments/' + mapprodrow.id + '/edit',
                  fields: [
                    {
                      label : 'Shipment No',
                      name : 'code',
                      value : mapprodrow.code
                    },
                    {
                      label : '--',
                      name : 'status',
                      value : mapprodrow.status
                    },
                    {
                      label : 'Status',
                      name : 'statusLabel',
                      value : mapprodrow.statusLabel
                    },
                    {
                      label : 'Scheduled Delivery Date',
                      name : 'etd',
                      value : this.globalService.formatUserDate(mapprodrow.etd)
                    },
                    {
                      label : 'To Address',
                      name : 'toaddress',
                      value : mapprodrow.toaddress.name
                    },
                    {
                      label : 'Last Tracked',
                      name : 'dt',
                      value : this.globalService.formatUserDate(mapprodrow.trackedAt)
                    }
                  ]
                });
                
              });
              this.unknownLocations.push(locrow);
            } else {
              this.knownLocations = this.knownLocations.map((locrow:any) => {
                
                if (locrow.key === maprow.key ) {
                  maprow.shipments.forEach( (mapprodrow:any) => {
                    // if( mapprodrow.statusLabel !== 'Delivered') {
                      locrow.items.push({
                        itemId: mapprodrow.id,
                        detailsUrl: '/shipments/' + mapprodrow.id + '/edit',
                        fields: [
                          {
                            label : 'Shipment No',
                            name : 'code',
                            value : mapprodrow.code
                          },
                          {
                            label : '--',
                            name : 'status',
                            value : mapprodrow.status
                          },
                          {
                            label : 'Status',
                            name : 'statusLabel',
                            value : mapprodrow.statusLabel
                          },
                          {
                            label : 'Scheduled Delivery Date',
                            name : 'etd',
                            value : this.globalService.formatUserDate(mapprodrow.etd)
                          },
                          {
                            label : 'To Address',
                            name : 'toaddress',
                            value : mapprodrow.toaddress.name
                          },
                          {
                            label : 'Last Tracked',
                            name : 'dt',
                            value : this.globalService.formatUserDate(mapprodrow.trackedAt)
                          }
                        ]
                      });
                    // }
                  });
                  if (maprow.type === 'known') {
                    locrow.icon = this.icons.known_items;
                  } else {
                    locrow.icon = this.icons.unknown_items;
                  }

                  return locrow;
                } else {
                  return locrow;
                }
              })
            }

          });
          
          // this.locations = this.knownLocations.concat(this.unknownLocations);
          let tlocations:any = [];
          this.knownLocations.forEach( (row:any) => {
            tlocations.push(row);
          });
          
          this.unknownLocations.forEach( (row:any) => {
            tlocations.push(row);
          });
          this.locations = tlocations;
          this.renderPoints();

          locatormapService.initQueue('shipment', this.locations, (locations:any) => {
              self.locations = locations;
              this.renderPoints();
          });
        });
        
      }).subscribe((data:any) => {
          
          data.data.forEach((row:any) => {

            this.knownLocations.push({
                id: row.id,
                key : row.id,
                lat: row.coordinates.latitude,
                lng: row.coordinates.longitude,
                location: row.name,
                address: this.globalService.formatCommaSeperatedData([ row.address, row.city, row.state, row.country ]) ,
                // itemCount : this.mapService.getIconText(''),
                items: [],
                lastTracked: 0,
                icon: this.icons.known_noitems
            });
          });

        
      }, () => {
          // No Handling
      }, () => {

      });

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

      const legend = L.control({position: 'topleft'});

      legend.onAdd = function (map:any) {
        map;
        const div = L.DomUtil.create('div', 'info legend');
        const locations = [ 
          'Scheduled',
          'Partial Shipped',
          'Soft Shipped',
          'In-Transit',
          'Partial Delivered',
          'Soft Delivered',
          'Delivered',
          'Multiple',
          'Location',
          'Location with shipments'
        ];
        const labels = [
          self.icons.shipment_scheduled,
          self.icons.shipment_partialshipped,
          self.icons.shipment_softshipped,
          self.icons.shipment_shipped,
          self.icons.shipment_partialdelivered,
          self.icons.shipment_softdelivered,
          self.icons.shipment_delivered,
          self.icons.shipment_multiple,
          self.icons.known_noitems,
          self.icons.known_items
        ];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (let i = 0; i < locations.length; i++) {
            div.innerHTML +=
                (' <img src=' + labels[i] + '> ') + '<span>' + locations[i] + '</span>' + '<br>';
        }

        return div;
      };
  
      legend.addTo(this.map);
  }

  renderPoints () {
    // let myIcon =  L.icon( { iconUrl: 'assets/marker-icon.png', shadowUrl: 'assets/marker-shadow.png' } );
    let myIcon =  L.icon( { iconUrl: this.icons.known_noitems, shadowUrl: this.icons.known_noitems } );
    this.cluster.clearLayers();
    console.log('IN RENDER');

    for (let i = 0; i < this.locations.length; i++) {
      const a = this.locations[i];

      // console.log(a);

      if (a.id === null) {
        if (a.items.length > 1 ) {
          myIcon =  L.icon( { iconUrl: this.icons.shipment_multiple, shadowUrl: this.icons.shipment_multiple } );
        } else if (a.items.length === 1 ) {
          // console.log(a.items[0].fields);
          const shipStatusArr = a.items[0].fields.filter((row:any) => {
            if (row.name === 'status') {
              return true;
            }
          });
          const shipStatus = shipStatusArr[0].value;
          const shipKeys:any = Object.keys(environment.shipmentStatus);
          let shipStatusName:any = null;
          shipKeys.forEach((keyrow:any) => {
            if (shipStatus === environment.shipmentStatus[keyrow]) {
              shipStatusName = keyrow;
            }
          });

          switch (shipStatusName ) {
            case 'Scheduled': 
              myIcon =  L.icon( { iconUrl: this.icons.shipment_scheduled, shadowUrl: this.icons.shipment_scheduled } );
              break;
            case 'SoftShipped': 
              myIcon =  L.icon( { iconUrl: this.icons.shipment_softshipped, shadowUrl: this.icons.shipment_softshipped } );
              break;
            case 'PartialShipped': 
              myIcon =  L.icon( { iconUrl: this.icons.shipment_partialshipped, shadowUrl: this.icons.shipment_partialshipped } );
              break;
            case 'Shipped': 
              myIcon =  L.icon( { iconUrl: this.icons.shipment_shipped, shadowUrl: this.icons.shipment_shipped } );
              break;
            case 'SoftDelivered': 
              myIcon =  L.icon( { iconUrl: this.icons.shipment_softdelivered, shadowUrl: this.icons.shipment_softdelivered } );
              break;
            case 'PartialDelivered': 
              myIcon =  L.icon( { iconUrl: this.icons.shipment_partialdelivered, shadowUrl: this.icons.shipment_partialdelivered } );
              break;
            case 'Delivered': 
              myIcon =  L.icon( { iconUrl: this.icons.shipment_delivered, shadowUrl: this.icons.shipment_delivered } );
              break;
            default:
              myIcon =  L.icon( { iconUrl: this.icons.shipment_multiple, shadowUrl: this.icons.shipment_multiple } );
          }
        } else {
          myIcon =  L.icon( { iconUrl: a.icon, shadowUrl: a.icon } );  
        }
      } else {
        myIcon =  L.icon( { iconUrl: a.icon, shadowUrl: a.icon } );
        /*if (a.items.length >= 1 ) {
          myIcon =  L.icon( { iconUrl: this.icons.shipment_multiple .icon, shadowUrl: this.icons.shipment_multiple } );
        } else {
        }*/
      }

      const title = a.location;
      /*if ( a.icon !== null ) {
        myIcon =  L.icon( { iconUrl: a.icon, shadowUrl: a.icon } );
      }*/
      const marker = L.marker(new L.LatLng(a.lat, a.lng), {icon: myIcon, title: title });
      let info = '';
      info += '<div style="margin-bottom: -12px;"><div>' + title + '</div>';
      if (typeof a.address !== 'undefined') {
        info += (a.address);
      }

      info += '</div></br>';
      if ( a.items ) {
        for (let j = 0; j < a.items.length; j++ ) {
          if ( a.items[j].fields ) {
            info += '<div>';
            for (let k = 0; k < a.items[j].fields.length; k++ ) {
              if (a.items[j].fields[k].name !== 'status') {
                if (a.items[j].fields[k].name === 'code') {
                  info += '<strong>' + a.items[j].fields[k].label + 
                    ': </strong> <a href="' + a.items[j].detailsUrl + '">' + 
                    a.items[j].fields[k].value + '</a><br/>';
                } else {
                  info += '<strong>' + a.items[j].fields[k].label + ': </strong>' + a.items[j].fields[k].value + '<br/>';
                }
              }
            }
            info += '</div>';
          }
          // info += '<br />';
          // info += '<div><a href=' + a.items[j].detailsUrl + '>Go To Details</a></div>';
        }
        // info += '<br />';
      }
      marker.bindPopup(L.popup({maxHeight: 300}).setContent(info));
      this.cluster.addLayer(marker);
    }

    this.map.addLayer(this.cluster);
  }

   /**
   * Refresh map after change in map data
   *
   * @memberof ShipmentLocatorMapComponent
   */
  refreshMap( ) {
    // set fitBounds here
    this.map.fitBounds(this.cluster.getBounds(), {maxZoom: 5});
  }

  toggleLiveUpdates() {
    const self = this;
    if ( this.liveUpdate === false ) {
      this.liveUpdate = true;
      this.toggleLiveLabel = 'Stop Live Updates';
      this.locatormapService.initQueue('shipment', this.locations, (locations:any) => {
        self.locations = locations;
        self.renderPoints();
    });
    } else {
      this.liveUpdate = false;
      this.toggleLiveLabel = 'Start Live Updates';
      this.locatormapService.closeQueue();
    }
  }
}

