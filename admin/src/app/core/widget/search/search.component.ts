import { Component, OnInit, DoCheck } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, DoCheck {
  product = false;
  simplesearch = false;
  location = false;
  order = false;
  shipment = false;
  casespersurgery = false;
  casespercity = false;
  casesperhospital = false;
  casesnotclosed = false;
  casespersurgeon = false;
  unshippedproducts = false;
  itemsnotdelivered = false;
  diagn_producttracking = false;
  diagn_pointsensortracking = false;
  diagn_pointlocationtracking = false;
  diagn_rawlocationtracking = false;
  shipmentdeliverytimecarrier = false;
  shipmentsdue = false;
  locationzones = false;
  shipmentharddelivered = false;
  shipmentsinjeopardy = false;
  productsordered = false;
  stationaryshipment = false;
  partialshipments = false;
  appstatus = false;
  productlocator = false;
  productlocatorhistory = false;
  sensorstatus = false;
  devicelocator = false;
  devicelocatorhistory = false;
  thingsSearch = false;
  appSearch = false;
  productsreadytodispatch = false;
  skusensor = false;
  skusensorhistory = false;
  shipmentdeliverytime = false;
  shipmentscountbylocation = false;
  mobilelogs = false;
  mostusedequipmentpersurgeon = false;
  notifications = false;
  isShow = false;
  grouplist = false;
  userlist = false;
  tempTaglist = false;
  search = false;
  routeName: any;
  router: any;
  userlocator = false;
  userlocatorhistory = false;
  loginhistory = false;
  userentrance = false;
  userentrancehistory = false;
  task = false;
  sensorlocator = false;
  sensorlocatorhistory = false;
  tours = false;
  tourevents = false;
  tourincidents = false;
  devicetourstats = false;
  guardtourstats = false;
  constructor(_router: Router) {
    this.router = _router;
  }

  ngOnInit() {
    // console.log("Hello 2"+this.router.url);
    this.routeName = this.router.url;

    // console.log(this.routeName);
    this.set_variables();
  }

  set_variables() {
    this.casespersurgery = false;
    this.casespercity = false;
    this.casesperhospital = false;
    this.casesnotclosed = false;
    this.casespersurgeon = false;
    this.unshippedproducts = false;
    this.itemsnotdelivered = false;
    this.diagn_producttracking = false;
    this.diagn_pointsensortracking = false;
    this.diagn_pointlocationtracking = false;
    this.diagn_rawlocationtracking = false;
    this.shipmentdeliverytimecarrier = false;
    this.shipmentsdue = false;
    this.locationzones = false;
    this.shipmentharddelivered = false;
    this.shipmentsinjeopardy = false;
    this.productsordered = false;
    this.stationaryshipment = false;
    this.partialshipments = false;
    this.appstatus = false;
    this.sensorstatus = false;
    this.devicelocator = false;
    this.devicelocatorhistory = false;
    this.productlocator = false;
    this.productlocatorhistory = false;
    this.productsreadytodispatch = false;
    this.skusensor = false;
    this.skusensorhistory = false;
    this.shipmentdeliverytime = false;
    this.shipmentscountbylocation = false;
    this.mobilelogs = false;
    this.mostusedequipmentpersurgeon = false;
    this.userlist = false;
    this.tempTaglist = false;
    this.grouplist = false;
    this.userlocator = false;
    this.userlocatorhistory = false;
    this.loginhistory = false;
    this.userentrance = false;
    this.userentrancehistory = false;
    this.task = false;
    this.sensorlocator = false;
    this.sensorlocatorhistory = false;
    this.tours = false;
    this.tourevents = false;
    this.tourincidents = false;
    this.devicetourstats = false;
    this.guardtourstats = false;
  }

  ngDoCheck() {
    this.set_variables();
    this.routeName = this.router.url;
    // console.log(window.location.pathname); //  /routename

    this.simplesearch = false;
    if (
      this.routeName === '/attributes' ||
      this.routeName === '/categories' ||
      this.routeName === '/collections' ||
      this.routeName === '/tags' ||
      this.routeName === '/zones' ||
      this.routeName === '/floors'
    ) {
      this.simplesearch = true;
      this.search = true;
    }

    this.thingsSearch = false;
    if (this.routeName === '/things/gateways') {
      console.log(this.routeName);
      this.thingsSearch = true;
      this.search = true;
    }
    this.appSearch = false;
    if (this.routeName === '/things/apps') {
      console.log(this.routeName);
      this.appSearch = true;
      this.search = true;
    }

    this.product = false;
    if (this.routeName === '/products') {
      this.product = true;
      this.search = true;
    }

    this.location = false;
    if (this.routeName === '/locations') {
      this.location = true;
      this.search = true;
    }

    this.order = false;
    if (this.routeName === '/orders') {
      this.order = true;
      this.search = true;
    }

    this.shipment = false;
    if (this.routeName === '/shipments') {
      this.shipment = true;
      this.search = true;
    }

    if (this.routeName.match(/^\/reports\/orderspersurgery/)) {
      this.casespersurgery = true;
      this.search = true;
    }

    if (this.routeName === '/reports/orderspercity') {
      this.casespercity = true;
      this.search = true;
    }

    if (this.routeName === '/reports/ordersperhospital') {
      this.casesperhospital = true;
      this.search = true;
    }

    if (this.routeName === '/reports/ordersnotclosed') {
      this.casesnotclosed = true;
      this.search = true;
    }
    if (this.routeName === '/reports/orderspersurgeon') {
      this.casespersurgeon = true;
      this.search = true;
    }
    if (this.routeName === '/reports/unshippedproducts') {
      this.unshippedproducts = true;
      this.search = true;
    }
    if (this.routeName === '/reports/productsnotdelivered') {
      this.itemsnotdelivered = true;
      this.search = true;
    }

    if (this.router.url === '/diagnostics/product-tracking') {
      this.diagn_producttracking = true;
      this.search = true;
    }

    if (this.router.url === '/diagnostics/rawsensors-tracking') {
      this.diagn_pointsensortracking = true;
      this.search = true;
    }

    if (this.router.url === '/diagnostics/pointstatus-tracking') {
      this.diagn_pointlocationtracking = true;
      this.search = true;
    }

    if (this.routeName === '/reports/shipmentsdue') {
      this.shipmentsdue = true;
      this.search = true;
    }
    if (this.routeName === '/reports/shipmentdeliverytimecarrier') {
      this.shipmentdeliverytimecarrier = true;
      this.search = true;
    }
    if (this.routeName === '/reports/locationzones') {
      this.locationzones = true;
      this.search = true;
    }
    if (this.routeName === '/reports/shipmentharddelivered') {
      this.shipmentharddelivered = true;
      this.search = true;
    }
    if (this.routeName === '/reports/shipmentsinjeopardy') {
      this.shipmentsinjeopardy = true;
      this.search = true;
    }
    if (this.routeName === '/reports/productsordered') {
      this.productsordered = true;
      this.search = true;
    }
    if (this.routeName === '/reports/stationaryshipment') {
      this.stationaryshipment = true;
      this.search = true;
    }
    if (this.routeName === '/reports/partialshipments') {
      this.partialshipments = true;
      this.search = true;
    }
    if (this.routeName === '/reports/productlocator') {
      this.productlocator = true;
      this.search = true;
    }
    if (this.routeName === '/reports/appstatus') {
      this.appstatus = true;
      this.search = true;
    }
    if (this.routeName === '/reports/sensorstatus') {
      this.sensorstatus = true;
      this.search = true;
    }
    if (this.routeName.match(/^\/reports\/productlocatorhistory/)) {
      this.productlocatorhistory = true;
      this.search = true;
    }
    if (this.routeName === '/reports/devicelocator') {
      this.devicelocator = true;
      this.search = true;
    }

    if (this.routeName === '/reports/sensorlocator') {
      this.sensorlocator = true;
      this.search = true;
    }

    if (this.routeName.match(/^\/reports\/sensorlocatorhistory/)) {
      this.sensorlocatorhistory = true;
      this.search = true;
    }

    if (this.routeName.match(/^\/reports\/devicelocatorhistory/)) {
      this.devicelocatorhistory = true;
      this.search = true;
    }
    if (this.router.url === '/diagnostics/rawlocation-tracking') {
      this.diagn_rawlocationtracking = true;
      this.search = true;
    }
    if (this.routeName === '/reports/productsreadytodispatch') {
      this.productsreadytodispatch = true;
      this.search = true;
    }
    if (this.routeName === '/reports/productsensor') {
      this.skusensor = true;
      this.search = true;
    }
    if (this.routeName.indexOf('productsensorhistory') !== -1) {
      this.skusensorhistory = true;
      this.search = true;
    }
    if (this.routeName === '/reports/shipmentdeliverytime') {
      this.shipmentdeliverytime = true;
      this.search = true;
    }
    if (this.routeName === '/reports/shipmentscountbylocation') {
      this.shipmentscountbylocation = true;
      this.search = true;
    }
    if (this.routeName === '/diagnostics/mobilelogs-tracking') {
      this.mobilelogs = true;
      this.search = true;
    }
    if (this.routeName === '/reports/mostusedequipmentpersurgeon') {
      this.mostusedequipmentpersurgeon = true;
      this.search = true;
    }

    if (this.routeName === '/notifications') {
      this.notifications = true;
      this.search = true;
    }
    if (this.routeName === '/userpools/users') {
      this.userlist = true;
      this.search = true;
    }
    if (this.routeName === '/things/temptags') {
      this.tempTaglist = true;
      this.search = true;
    }
    if (this.routeName === '/userpools/groups') {
      this.grouplist = true;
      this.search = true;
    }
    if (this.routeName === '/reports/userlocator') {
      this.userlocator = true;
      this.search = true;
    }
    if (this.routeName.match(/^\/reports\/userlocatorhistory/)) {
      this.userlocatorhistory = true;
      this.search = true;
    }
    if (this.routeName === '/reports/loginhistory') {
      this.loginhistory = true;
      this.search = true;
    }
    if (this.routeName === '/reports/entrance') {
      this.userentrance = true;
      this.search = true;
    }
    if (this.routeName.match(/^\/reports\/entrancehistory/)) {
      this.userentrancehistory = true;
      this.search = true;
    }
    if (this.routeName === '/tasks') {
      this.task = true;
      this.search = true;
    }
    if (this.routeName.match(/^\/reports\/tourreport/)) {
      this.tours = true;
      this.search = true;
    }
    if (this.routeName.match(/^\/reports\/tourevents/)) {
      this.tourevents = true;
      this.search = true;
    }
    if (this.routeName.match(/^\/reports\/tourincidents/)) {
      this.tourincidents = true;
      this.search = true;
    }
    if (this.routeName.match(/^\/reports\/device-tour-stats/)) {
      this.devicetourstats = true;
      this.search = true;
    }
    if (this.routeName.match(/^\/reports\/guard-tour-stats/)) {
      this.guardtourstats = true;
      this.search = true;
    }
  }
}
