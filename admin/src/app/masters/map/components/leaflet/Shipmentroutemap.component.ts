import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { environment } from '../../../../../environments/environment';
import { GlobalService } from '../../../../core/global.service';
import { LocatortypeFactory } from '../../../../core/widget/maps/locatormap/locators/locatortype.factory';
import { LocationService } from './../../../locations/shared/location.service';
import { ShipmentService } from './../../../shipments/shared/shipment.service';
import { LocatormapService } from './../../shared/leaflet/locatormap.service';
import { ShippingmapService } from './../../shared/leaflet/shippingmap.service';

// import { RoutemapService } from './../../shared/leaflet/routemap.service';
const L = require('leaflet');
require('leaflet-realtime');
require('leaflet-routing-machine');
//
@Component({
    selector: 'app-shipmentroute-map',
    templateUrl: './Shipmentroutemap.component.html',
    styleUrls: ['./leaflet.component.css'],
    providers: [GlobalService, LocationService, LocatormapService,
        LocatortypeFactory, ShippingmapService, ShipmentService],
})
export class ShipmentroutemapComponent implements OnInit, OnDestroy {

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
    // shipmentId: string;
    shipmentData: any;
    realTime: any;
    fromLocationCoords: any;
    toLocationCoords: any;
    fromLocation: any;
    toLocation: any;
    locationCenter: any;
    remainingDistance: any;
    remainingTime: any;
    rlat: any;
    rlon: any;
    currLocationLegend: any;

    @Input('shipmentId') shipmentId: string;
    @Input('mapHeight') mapHeight = '800';
    @Output() onMapLoad: EventEmitter<any> = new EventEmitter();

    constructor(
        private locationService: LocationService,
        private shipmentService: ShipmentService,
        private routemapService: ShippingmapService,
        private globalService: GlobalService
    ) {
        this.locations = [];
        this.locationCenter = null;
    }

    ngOnInit() {
        const self = this;
        this.icons = this.globalService.getIconList();

        this.shipmentService.getPublic(this.shipmentId).subscribe((data: any) => {
            this.shipmentData = data.data;

            // console.log(this.shipmentData);
            const fromLocationId = this.shipmentData.addresses[0].location.id;
            const toLocationId = this.shipmentData.addresses[1].location.id;

            const addressesApiHits = [];

            addressesApiHits.push(this.locationService.getPublic(fromLocationId));
            addressesApiHits.push(this.locationService.getPublic(toLocationId));

            Observable.forkJoin(addressesApiHits).subscribe(results => {
                // console.log(results);

                let resultRow1: any;
                let resultRow2: any;

                resultRow1 = results[0];
                resultRow2 = results[1];

                self.fromLocationCoords = resultRow1.data.coordinates;
                self.toLocationCoords = resultRow2.data.coordinates;

                self.fromLocation = resultRow1.data;
                self.toLocation = resultRow2.data;

                const shipStatusMap = environment.shipmentStatus;
                const trackingStatuses = [
                    shipStatusMap.Scheduled,
                    shipStatusMap.PartialShipped,
                    shipStatusMap.SoftShipped,
                    shipStatusMap.Shipped,
                    shipStatusMap.PartialDelivered
                ];

                const dLocation = this.shipmentData.currentLocation;
                if (trackingStatuses.includes(this.shipmentData.shipmentStatus)) {
                    this.initializeMap(dLocation, true);
                } else {
                    this.initializeMap(dLocation, false);
                }
            });
        }, () => {
            // console.log("in error");
            // this.initializeMap();
        }, () => {
            // console.log("in final");
        });

    }

    ngOnDestroy() {
        this.routemapService.closeQueue();
    }

    initializeMap(currentLocation, enableLiveTracking) {
        const self = this;
        // console.log("IN MAP");
        let cLat = 28.6252;
        let cLon = 77.3732;

        if (this.locationCenter !== null) {
            cLat = this.locationCenter.latitude;
            cLon = this.locationCenter.longitude;
        }
        this.rlat = Number(currentLocation.coordinates.latitude).toFixed(4);
        this.rlon = Number(currentLocation.coordinates.longitude).toFixed(4);

        let lName = currentLocation.name;

        if (lName !== null) {
            console.log('KNOWN LOCATION');
        } else {
            console.log('IN UNKNOWN LOCATION');
            lName = '';
            lName = self.getLocationName(currentLocation);
        }
        const datePipe = new DatePipe('en-US');
        const lTracked = datePipe.transform(this.shipmentData.updatedOn, environment.mapDateTimeFormat);
        const mapFeatures = this.routemapService.getFeatures(
            {
                'id': self.fromLocation.id,
                'name': 'From Location',
                'lat': self.fromLocationCoords.latitude,
                'lon': self.fromLocationCoords.longitude,
                'tracked': '--'
            },
            {
                'id': self.toLocation.id,
                'name': 'To Location',
                'lat': self.toLocationCoords.latitude,
                'lon': self.toLocationCoords.longitude,
                'tracked': '--'
            },
            {
                'id': currentLocation.id,
                'name': lName,
                'lat': self.rlat,
                'lon': self.rlon,
                'tracked': lTracked,
                'status': self.shipmentData.shipmentStatus,
                'statusLabel': self.shipmentData.shipmentStatusLabel
            }
        );
        const wayPoints: any = [];
        let fromLocWayPointFound = false;
        this.map = L.map('map').on('load', function () {
            self.onMapLoad.emit(self.getMapInstance());
            if (enableLiveTracking === true) {
                self.routemapService.initQueue(
                    self.shipmentId,
                    'shipment',
                    self.fromLocation,
                    self.toLocation,
                    self.locations,
                    (locations: any) => {
                    self.realTime.update(locations);
                });
            }
            self.setCurrentLocationText(lName);

            // get estimated time for remaining route
            // self.setRemainingTime();

            self.remainingDistance = self.getDistance(
                L.latLng(self.rlat, self.rlon),
                L.latLng(self.toLocationCoords.latitude, self.toLocationCoords.longitude)
            );
            self.remainingDistance = self.getMiles(self.remainingDistance);

            /**  calculate route way points start **/
            self.shipmentService.getWayPoints(self.shipmentId).subscribe((mapdata: any) => {
                mapdata.data.forEach((maprow: any) => {
                    if ( maprow.location.addresses.id === self.fromLocation.id ) {
                        fromLocWayPointFound = true;
                    }
                    wayPoints.push(
                        L.latLng(
                            maprow.location.addresses.pointCoordinates.coordinates[1],
                            maprow.location.addresses.pointCoordinates.coordinates[0]
                        )
                    );
                });
            }, () => {
                // error
                self.refreshMap();
            }, () => {
                // console.log('completed');
                if ( wayPoints.length > 0 ) {
                    console.log(wayPoints);
                    if ( !fromLocWayPointFound ) {
                        // add from loc way point
                        wayPoints.unshift(
                            L.latLng(
                                self.fromLocationCoords.latitude,
                                self.fromLocationCoords.longitude
                            )
                        );
                    }
                    console.log(wayPoints);
                    L.Routing.control({
                        serviceUrl: 'https://router.project-osrm.org/route/v1',
                        waypoints: wayPoints,
                        lineOptions: {
                            addWaypoints: false,
                            altLineOptions: false,
                        },
                        draggableWaypoints: false,
                        createMarker: function (i, waypoint, n) {
                            n;
                            // show only last location and current location
                            let featureToFind = '';
                            if ( i === (wayPoints.length - 1) ) { // current location
                                featureToFind = 'CurrLocation';
                                console.log('here');
                                let feature = <any>'';
                                mapFeatures.features.forEach((loc) => {
                                    if (loc.properties.lId === featureToFind) {
                                        feature = loc;
                                    }
                                });
                                // plot way points initially on map
                                if (feature) {
                                    const markerAttrs = self.getMarkerAttrs(feature);
                                    const otherDetails = self.getOtherDetailsForMarker(feature);
                                    markerAttrs.info += otherDetails;

                                    return L.marker(waypoint.latLng, {
                                        'icon': L.icon({
                                            iconUrl: markerAttrs.iconUrl,
                                            shadowUrl: 'assets/marker-shadow.png'
                                        })
                                    }).bindPopup(markerAttrs.info);
                                } else {
                                    return null;
                                }
                            } else {
                                return null;
                            }
                        },
                        showAlternatives: false,
                        useZoomParameter: false,
                        show: false // hide route itinerary
                    }).addTo(self.map);

                    // const shipmentMoved = self.ifShipmentMoved(mapFeatures);
                    // if (!shipmentMoved) {
                    //     routeControl.spliceWaypoints(0, 2);
                    // }
                }
            });
            /**  calculate route way points start **/

            L.tileLayer(
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 16,
                }).addTo(self.map);

            self.realTime = L.realtime(
                undefined, {
                    start: false,
                    getFeatureId: function (feature: any) { return feature.properties.lId; },
                    pointToLayer: function (feature: any, latlng: any) {
                        const markerAttrs = self.getMarkerAttrs(feature);
                        const otherDetails = self.getOtherDetailsForMarker(feature);
                        markerAttrs.info += otherDetails;

                        const iconUrl = markerAttrs.iconUrl;
                        const info = markerAttrs.info;
                        return L.marker(latlng, {
                            'icon': L.icon({
                                iconUrl: iconUrl,
                                shadowUrl: 'assets/marker-shadow.png'
                            })
                        }).bindPopup(info);
                    }
                }).addTo(self.map);

            const knownMapFeatures = { 'features': <any>'' };
            knownMapFeatures.features = mapFeatures.features.filter(function (loc) { return loc.properties.lId !== 'CurrLocation' });

            self.realTime.update(knownMapFeatures.features);

            self.realTime.on('update', function (e: any) {
                const popupContent = function (fId: any) {
                    const feature = e.features[fId];
                    const markerAttrs = self.getMarkerAttrs(feature);
                    const otherDetails = self.getOtherDetailsForMarker(feature);
                    markerAttrs.info += otherDetails;
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
            const locations = ['In Transit', 'To Location', 'From Location'];
            const labels = [self.icons.shipment_shipped, self.icons.to_location, self.icons.from_location];

            // loop through our density intervals and generate a label with a colored square for each interval
            for (let i = 0; i < locations.length; i++) {
                div.innerHTML +=
                    (' <img src=' + labels[i] + '> ') + '<span>' + locations[i] + '</span><br>';
            }

            return div;
        };

        legend.addTo(this.map);
    }

    getMarkerAttrs(feature: any) {
        const self = this;
        let addrArray = [];
        let info = '';
        let iconUrl = '';

        switch (feature.properties.lId) {
            case 'FromLocation':
                addrArray = [self.fromLocation.address, self.fromLocation.city,
                self.fromLocation.state, self.fromLocation.country];

                info = '<div><div><strong>Location : </strong>' + self.fromLocation.name + '</div>';
                info += addrArray.join(', ') + '</div>';

                if (feature.properties.shipmentExists === true) {
                    info += '<div>';
                    info += '<strong>Last Tracked : </strong>' + feature.properties.lTracked + '<br/>';
                    info += '<strong>Shipment No : </strong>' + self.shipmentData.code + '<br/>';
                    info += '<strong>To : </strong>' + self.toLocation.name + '<br/>';
                    info += '<strong>Status : </strong>' +
                        feature.properties.lStatusLabel;
                    info += '</div>';
                }

                info += '</div>';
                iconUrl = this.icons.from_location;
                break;
            case 'ToLocation':
                addrArray = [self.toLocation.address, self.toLocation.city, self.toLocation.state, self.toLocation.country];
                info = '<div><div><strong>Location : </strong>' + self.toLocation.name + '</div>';
                info += addrArray.join(', ') + '</div>';

                if (feature.properties.shipmentExists === true) {
                    info += '<div>';
                    info += '<strong>Last Tracked : </strong>' + feature.properties.lTracked + '<br/>';
                    info += '<strong>Shipment No : </strong>' + self.shipmentData.code + '<br/>';
                    info += '<strong>To : </strong>' + self.toLocation.name + '<br/>';
                    info += '<strong>Status : </strong>' +
                        feature.properties.lStatusLabel;
                    info += '</div>';
                }

                iconUrl = this.icons.to_location;
                break;
            default:
                info = '<div><div><strong>Location : </strong>' + feature.properties.lName + '</div></div>';
                info += '<div>';
                info += '<strong>Last Tracked : </strong>' + feature.properties.lTracked + '<br/>';

                info += '<strong>Shipment No : </strong>' + self.shipmentData.code + '<br/>';
                info += '<strong>To : </strong>' + self.toLocation.name + '<br/>';
                info += '<strong>Status : </strong>' +
                    feature.properties.lStatusLabel + '</div>';

                iconUrl = this.icons.shipment_shipped;
                break;
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

    getDistance(latlng1, latlng2) {
        return this.map.distance(latlng1, latlng2).toFixed(2);
    }

    getMiles(i) {
        return (i * 0.000621371).toFixed(2);
    }

    getOtherDetailsForMarker(feature) {
        const self = this;
        let otherDetails = '';
        if (feature.properties.lId === 'FromLocation' || feature.properties.lId === 'CurrLocation') {
            if ( feature.properties.lId === 'CurrLocation' ) {
                self.setCurrentLocationText(feature.properties.lName);
            }
            if (feature.properties.shipmentExists && this.remainingDistance > 0) {
                otherDetails += '<div><div><strong>Remaining Distance (Miles) : </strong>' + this.remainingDistance + '</div></div>';
            }
            if (feature.properties.shipmentExists && this.remainingTime > 0) {
                otherDetails += '<div><div><strong>Remaining Time : </strong>' + this.remainingTime + '</div></div>';
            }
        }
        return otherDetails;
    }

    // ifShipmentMoved(mapFeatures) {
    //     let shipmentMoved = true;
    //     mapFeatures.features.forEach((feature) => {
    //         if (feature.properties.lId === 'FromLocation' && feature.properties.shipmentExists) {
    //             shipmentMoved = false;
    //         }
    //     });
    //     return shipmentMoved;
    // }

    // setRemainingTime() {
    //     const formatter = new L.Routing.Formatter({});
    //     this.remainingTime = '';
    //     const self = this;
    //     const destRouteControl = L.Routing.control({
    //         serviceUrl: 'https://router.project-osrm.org/route/v1',
    //         waypoints: [
    //             L.latLng(self.rlat, self.rlon),
    //             L.latLng(self.toLocationCoords.latitude, self.toLocationCoords.longitude)
    //         ],
    //         draggableWaypoints: false,
    //         createMarker: function () {
    //             return null;
    //         },
    //         showAlternatives: false,
    //         useZoomParameter: false,
    //         show: false // hide route itinerary
    //     });
    //     destRouteControl.on('routesfound', (e: any) => {
    //         if ( e.routes.length ) {
    //             console.log('hhhhhheehe');
    //             self.remainingTime = formatter.formatTime(e.routes[0].summary.totalTime);
    //             destRouteControl.spliceWaypoints(0, 2);
    //         }
    //     });
    // }

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

    getLocationName(currentLocation) {
        console.log(currentLocation);
        let lName = '';
        if (currentLocation.address !== '') {
            lName += currentLocation.address + ', ';
        }
        if (currentLocation.city !== '') {
            lName += currentLocation.city + ', ';
        }
        if (currentLocation.state !== '') {
            lName += currentLocation.state + ', ';
        }
        if (currentLocation.country !== '') {
            lName += currentLocation.country + ', ';
        }
        lName = lName.substring(0, lName.length - 2);
        return lName;
    }

}

