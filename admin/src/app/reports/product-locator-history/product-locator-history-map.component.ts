import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { GlobalService } from '../../core/global.service';
import { LocatortypeFactory } from '../../core/widget/maps/locatormap/locators/locatortype.factory';
import { LocationService } from '../../masters/locations/shared/location.service';
import { LocatormapService } from '../../masters/map/shared/leaflet/locatormap.service';
import { RoutemapService } from '../../masters/map/shared/leaflet/routemap.service';
import { ProductService } from '../../masters/products/shared/product.service';
import { ReportService } from '../shared/report.service';
import * as moment from 'moment';

const L = require('leaflet');
require('leaflet-realtime');
require('leaflet-routing-machine');

@Component({
    selector: 'app-productlocatorhistory-map',
    templateUrl: './product-locator-history-map.component.html',
    providers: [GlobalService, ReportService, LocationService, LocatormapService, LocatortypeFactory, RoutemapService, ProductService],
})
export class ProductLocatorHistoryMapComponent implements OnInit, OnDestroy {

    lat = 28.6252;
    lng = 77.3732;
    zoom = 16;
    locations: any;
    isError = false;
    latlngbounds: any;
    knownLocations: any;
    unknownLocations: any;
    itemsMap: any;
    icons: any;
    map: any;
    productData: any;
    realTime: any;
    fromLocationCoords: any;
    toLocationCoords: any;
    fromLocation: any;
    toLocation: any;
    locationCenter: any;
    layers: any;
    checkedRoute: boolean;
    checkedKnownLoc: boolean;
    checkedRoutePoints: boolean;
    refinedWaypoints: any;
    pastMapFeatures: any;
    loader: boolean;
    currLocationLegend: any;

    @Input('productId') productId: string;
    @Input('mapHeight') mapHeight = '800';
    @Output() onMapLoad: EventEmitter<any> = new EventEmitter();

    constructor(
        private locationService: LocationService,
        private productService: ProductService,
        private routemapService: RoutemapService,
        private globalService: GlobalService,
        private reportService: ReportService

    ) {
        this.locations = [];
        this.locationCenter = null;
        this.checkedRoute = this.checkedKnownLoc = this.checkedRoutePoints = true;
        this.refinedWaypoints = [];
        this.pastMapFeatures = [];
    }

    renderKnownPoints() {
        const self = this;
        let myIcon;
        console.log('Render Known Locations');
        if (self.map) {
            for (let i = 0; i < this.locations.length; i++) {
                const a = this.locations[i];

                myIcon = L.icon({ iconUrl: a.icon, shadowUrl: a.icon });

                const title = a.location;
                const marker = L.marker(new L.LatLng(a.lat, a.lng), { icon: myIcon, title: title, id: a.id });
                let info = '';
                info += '<div style="margin-bottom: -12px;"><div>' + title + '</div>';
                if (typeof a.address !== 'undefined') {
                    info += (a.address);
                }
                info += '</div></br>';

                marker.bindPopup(L.popup({ maxHeight: 300 }).setContent(info));
                self.layers.knownLocations.push(marker);
                self.map.addLayer(marker);

                if (a.id !== null && a.geojsonFeature) {
                    const geoJsonFeature = L.geoJSON(a.geojsonFeature, {
                        onEachFeature: self.onEachFeature,
                        style: function (feature: any) {
                            feature;
                            return { color: '#FF6666', 'weight': 0.5 };
                        }
                    }).addTo(self.map);
                    self.layers.geoJson.push(geoJsonFeature);
                }
            }
        }
    }

    onEachFeature(feature: any, layer: any) {
        if (feature.properties && feature.properties.name) {
            layer.bindPopup(feature.properties.name);
        }
    }

    ngOnInit() {
        this.icons = this.globalService.getIconList();
        const self = this;

        // get known locations
        this.locationService.getAll('/list').subscribe((data: any) => {
            this.knownLocations = [];
            this.unknownLocations = [];

            data.data.forEach((row: any) => {
                this.knownLocations.push({
                    id: row.id,
                    key: row.id,
                    lat: row.coordinates.latitude,
                    lng: row.coordinates.longitude,
                    location: row.name,
                    address: self.globalService.formatCommaSeperatedData([row.address, row.city, row.state, row.country]),
                    items: [],
                    lastTracked: 0,
                    icon: self.icons.known_noitems,
                    geojsonFeature: [
                        {
                            'type': 'Feature',
                            'properties': {
                                'name': row.name,
                                'id': row.id
                            },
                            'geometry': row.perimeter
                        }
                    ]
                });
            });

            const tlocations: any = [];

            this.knownLocations.forEach((row: any) => {
                tlocations.push(row);
            });
            this.locations = tlocations;
        }, () => {
            // No Handling
            this.loader = false;
        }, () => {
            this.loader = false;
        });

        this.productService.get(this.productId).subscribe((data: any) => {
            this.productData = data.data;
            const oldLocations: any = [];
            const trackedFrom = moment().startOf('day').utc().format();
            const trackedTo = moment().utc().format();
            this.reportService.productLocatorHistoryMap(
                this.productId,
                '?trackedFrom=' + trackedFrom + '&trackedTo=' + trackedTo
            ).subscribe(mapdata => {
                // console.log(mapdata.data);
                mapdata.data.forEach((maprow) => {
                    let location = '';
                    let loctype = '';
                    let lockey = '';
                    if (maprow.location.addresses.id === null || maprow.location.addresses.id === '') {
                        location = this.globalService.formatCommaSeperatedData([
                            maprow.location.addresses.address,
                            maprow.location.addresses.city,
                            maprow.location.addresses.state,
                            maprow.location.addresses.country
                        ]);
                        loctype = 'unkonwn';
                        lockey = maprow.location.addresses.pointCoordinates.coordinates[1] + '-'
                            + maprow.location.addresses.pointCoordinates.coordinates[0];
                    } else {
                        location = maprow.location.addresses.name;
                        loctype = 'known';
                        lockey = maprow.location.addresses.id;
                    }
                    oldLocations.push({
                        'id': maprow.location.addresses.id,
                        'key': lockey,
                        'lat': maprow.location.addresses.pointCoordinates.coordinates[1],
                        'lng': maprow.location.addresses.pointCoordinates.coordinates[0],
                        'location': location,
                        'type': loctype,
                        'dt': this.globalService.formatUserDate(maprow.trackedAt)
                    });

                });
                this.initializeMap(oldLocations, true);
            });
        });
    }

    ngOnDestroy() {
        this.routemapService.closeQueue();
    }

    initializeMap(pastLocations: any, enableLiveTracking: any) {
        this.layers = {};
        this.layers.geoJson = [];
        this.layers.knownLocations = [];
        this.layers.routePoints = [];
        const self = this;

        // console.log("IN MAP");
        let cLat = 28.6252;
        let cLon = 77.3732;

        if (this.locationCenter !== null) {
            cLat = this.locationCenter.latitude;
            cLon = this.locationCenter.longitude;
        }

        this.map = L.map('map').on('load', function () {
            self.onMapLoad.emit(self.getMapInstance());
            self.renderKnownPoints();
            self.pastMapFeatures = {
                'type': 'FeatureCollection',
                'features': []
            };
            self.pastMapFeatures.features = pastLocations.map((row: any) => {
                self.refinedWaypoints.push(L.latLng(row.lat, row.lng));
                return {
                    'geometry': { 'type': 'Point', 'coordinates': [row.lng, row.lat] },
                    'type': 'Feature',
                    'properties': {
                        'lName': row.location,
                        'lId': row.key,
                        'lType': row.type,
                        'lTracked': row.dt
                    }
                }
            });
            if (self.pastMapFeatures.features.length > 0) {
                const realTimeCallBack = self.realTime.update(self.pastMapFeatures);
                if ( realTimeCallBack.hasOwnProperty('_features') ) {
                    self.refreshMap();
                }
            }

            self.addRouteLayer();
            if ( pastLocations ) {
                // update points order in api
                // const lastCapturedLocObj = pastLocations.slice(-1)[0];
                const lastCapturedLocObj = pastLocations[0];
                if ( lastCapturedLocObj && lastCapturedLocObj.location ) {
                    self.setCurrentLocationText(lastCapturedLocObj.location);
                }
            }

            if (enableLiveTracking === true) {
                self.routemapService.initQueue(self.productId, 'product', self.locations, (realTimeLocation: any) => {
                    if ( realTimeLocation ) {
                        const mapFeatures: any = {
                            'type': 'FeatureCollection',
                            'features': []
                        };
                        if (realTimeLocation.lng && realTimeLocation.lat) {
                            mapFeatures.features =
                                [{
                                    'geometry': { 'type': 'Point', 'coordinates': [realTimeLocation.lng, realTimeLocation.lat] },
                                    'type': 'Feature',
                                    'properties': {
                                        'lName': realTimeLocation.location,
                                        'lId': realTimeLocation.key,
                                        'lType': (realTimeLocation.id === '' || realTimeLocation.id === null) ? 'unknown' : 'known',
                                        'lTracked': realTimeLocation.dt,
                                        'lLocationEntry': '',
                                        'lLocationExit' : ''
                                    }
                                }];
                            if (mapFeatures.features.length > 0) {
                                self.realTime.update(mapFeatures);
                            }
                        }
                        self.setCurrentLocationText(realTimeLocation.location);
                    }
                });
            }
        });
        this.map.locate({ setView: true, maxZoom: 14 });
        this.map.on('locationfound', (e: any) => {
            e;
        });
        this.map.on('locationerror', (e: any) => {
            e;
            self.map.setView(L.latLng(cLat, cLon), 14)
        });

        const legend = L.control({ position: 'topleft' });

        legend.onAdd = function (map: any) {
            map;
            const div = L.DomUtil.create('div', 'info legend');
            const locations = ['Known Location', 'In-transit Location'];
            const labels = [
                self.icons.known_items,
                self.icons.unknown_items];

            // loop through our density intervals and generate a label with a colored square for each interval
            for (let i = 0; i < locations.length; i++) {
                div.innerHTML +=
                    (' <img src=' + labels[i] + '> ') + '<span>' + locations[i] + '</span><br>';
            }

            return div;
        };

        legend.addTo(this.map);

        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 16,
            }).addTo(this.map);

        this.realTime = L.realtime(
            undefined, {
                start: false,
                getFeatureId: function (feature: any) { return feature.properties.lId; },
                pointToLayer: function (feature: any, latlng: any) {
                    const markerAttrs = self.getMarkerAttrs(feature);
                    const iconUrl = markerAttrs.iconUrl;
                    const info = markerAttrs.info;
                    const marker = L.marker(latlng, {
                        'icon': L.icon({
                            iconUrl: iconUrl,
                            shadowUrl: 'assets/marker-shadow.png'
                        })
                    }).bindPopup(info);
                    self.layers.routePoints.push(marker);
                    return marker;
                }
            }).addTo(this.map);

        this.realTime.on('update', function (e: any) {
            const popupContent = function (fId: any) {
                const feature = e.features[fId];
                const markerAttrs = self.getMarkerAttrs(feature);
                const info = markerAttrs.info;
                return info;
            };
            const bindFeaturePopup = function (fId: any) {
                self.realTime.getLayer(fId).bindPopup(popupContent(fId));
            };
            const updateFeaturePopup = function (fId: any) {
                self.realTime.getLayer(fId).getPopup().setContent(popupContent(fId));
            };

            Object.keys(e.enter).forEach(bindFeaturePopup);
            Object.keys(e.update).forEach(updateFeaturePopup);
        });
    }

    getMarkerAttrs(feature: any) {
        const self = this;
        let info = '';
        let iconUrl = '';
        // console.log(feature.properties.lType);
        info = '<div><strong>Location : </strong>' + feature.properties.lName + '<br/>';
        info += '<strong>Last Tracked : </strong>' + feature.properties.lTracked + '</div>';
        if (feature.properties.lType === 'known') {
            iconUrl = self.icons.known_items;
            self.map.eachLayer(function(layer) {
                if ( layer.options && layer.options.id && layer.options.id === feature.properties.lId ) {
                    // show checked icon marker
                    self.map.removeLayer(layer);
                }
            });
        } else {
            iconUrl = self.icons.unknown_items;
        }
        return { info: info, iconUrl: iconUrl };
    }

    /**
     * Refresh map after change in map data
     *
     * @memberof LocatormapComponent
     */
    refreshMap() {
        // set fitBounds here
        this.map.fitBounds(this.realTime.getBounds(), { maxZoom: 16 });
    }


    getMapInstance() {
        return this;
    }

    // add a route based on way points
    addRouteLayer() {
        const self = this;
        if ( this.refinedWaypoints ) {
            const control = L.Routing.control({
                serviceUrl: 'https://router.project-osrm.org/route/v1',
                waypoints: self.refinedWaypoints,
                lineOptions : {
                    addWaypoints: false,
                    altLineOptions: false
                },
                draggableWaypoints: false,
                createMarker: function(i, waypoint, n) {
                    // show only first and last way points on map
                    if ( i === 0 || i === (n - 1) ) {
                        const feature = self.pastMapFeatures.features[i];
                        if ( feature.properties.lType === 'known' ) {
                            return null;
                        } else {
                        const markerAttrs = self.getMarkerAttrs(feature);
                            return L.marker(waypoint.latLng, {
                                'icon': L.icon({
                                    iconUrl: markerAttrs.iconUrl,
                                    shadowUrl: 'assets/marker-shadow.png'
                                })
                            }).bindPopup(markerAttrs.info);
                        }
                    } else {
                        return null;
                    }
                },
                showAlternatives: false,
                useZoomParameter: false,
                show: false // hide route itinerary
            }).addTo(this.map);
            this.layers.routing = control;
        }
    }

    // toggle route from map
    toggleRoute(e) {
        if ( e ) {
            this.addRouteLayer();
        } else {
            this.map.removeControl(this.layers.routing);
        }
    }

    toggleKnownLocations (e) {
        const self = this;
        if ( e ) {
            this.renderKnownPoints();
        } else {
            if ( this.layers.geoJson ) {
                this.layers.geoJson.forEach( (feature) => {
                    self.map.removeLayer(feature);
                })
            }
            if ( this.layers.knownLocations ) {
                this.layers.knownLocations.forEach( (feature) => {
                    self.map.removeLayer(feature);
                })
            }
        }
    }

    toggleRoutePoints (e) {
        const self = this;
        if ( e ) {
            if ( this.layers.routePoints ) {
                this.layers.routePoints.forEach( (feature) => {
                    self.map.addLayer(feature);
                })
            }
        } else {
            if ( this.layers.routePoints ) {
                this.layers.routePoints.forEach( (feature) => {
                    self.map.removeLayer(feature);
                })
            }
        }
    }

    setCurrentLocationText(locationName) {
        if ( locationName ) {
            if ( this.currLocationLegend ) {
                this.currLocationLegend.remove();
            }
            this.currLocationLegend = L.control({ position: 'bottomleft' });
            this.currLocationLegend.onAdd = function () {
                const div = L.DomUtil.create('div', 'Last Location');
                div.innerHTML = '<strong>Last Location : </strong><span>' + locationName + '</span>';
                return div;
            };
            this.currLocationLegend.addTo(this.map);
        }
    }

}

