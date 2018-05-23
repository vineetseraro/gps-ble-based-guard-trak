import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { GlobalService } from '../../core/global.service';
import { LocatortypeFactory } from '../../core/widget/maps/locatormap/locators/locatortype.factory';
import { LocationService } from '../../masters/locations/shared/location.service';
import { LocatormapService } from '../../masters/map/shared/leaflet/locatormap.service';
import { RoutemapService } from '../../masters/map/shared/leaflet/routemap.service';
// import { ProductService } from '../../masters/products/shared/product.service';
// import { ReportService } from '../shared/report.service';
// import * as moment from 'moment';

const L = require('leaflet');
require('leaflet-realtime');
require('leaflet-routing-machine');

@Component({
    selector: 'app-tourincident-map',
    templateUrl: './report-incident-details-map.component.html',
    providers: [GlobalService, LocationService, LocatormapService, LocatortypeFactory, RoutemapService],
})
export class ReportIncidentDetailsMapComponent implements OnInit, OnDestroy {

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

    @Input('locationData') locationData;
    @Output() onMapLoad: EventEmitter<any> = new EventEmitter();

    constructor(
        private routemapService: RoutemapService,
        private globalService: GlobalService,
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
                console.log(a);
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

        const oldLocations: any = [];
        const maprow = {
            location: this.locationData
        };
        let location = '';
        let loctype = '';
        let lockey = '';
        if (maprow.location.id === null || maprow.location.id === '') {
            location = maprow.location.address;
            loctype = 'unkonwn';
            lockey = maprow.location.pointCoordinates.coordinates[1] + '-'
                + maprow.location.pointCoordinates.coordinates[0];
        } else {
            location = maprow.location.name;
            loctype = 'known';
            lockey = maprow.location.id;
        }
        oldLocations.push({
            'id': maprow.location.id,
            'key': lockey,
            'lat': maprow.location.pointCoordinates.coordinates[1],
            'lng': maprow.location.pointCoordinates.coordinates[0],
            'icon' : self.icons.unknown_items,
            'location': location,
            'type': loctype
        });
        this.locations = oldLocations;
        this.initializeMap();
    }

    ngOnDestroy() {
        this.routemapService.closeQueue();
    }

    initializeMap() {
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
        });
        this.map.locate({ setView: true, maxZoom: 18 });
        this.map.on('locationfound', (e: any) => {
            e;
            self.map.setView(L.latLng(cLat, cLon), 18)
        });
        this.map.on('locationerror', (e: any) => {
            e;
            self.map.setView(L.latLng(cLat, cLon), 18)
        });

        const legend = L.control({ position: 'topleft' });

        legend.onAdd = function (map: any) {
            map;
            const div = L.DomUtil.create('div', 'info legend');
            const locations = ['Incident Location'];
            const labels = [
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
                maxZoom: 18,
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
        this.map.fitBounds(this.realTime.getBounds(), { maxZoom: 18 });
    }


    getMapInstance() {
        return this;
    }

}

