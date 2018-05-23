import { DashboardService } from '../services/dashboard.service';
import { ScreenService } from '../services/screen.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  isSecBarVisible = false;
  drop = false;
  date: Date;
  date1: Date;
  cities: SelectItem[];
  searchForm;

  cars: SelectItem[];

  selectedCar: string;

  selectedCar2: string = 'BMW';

  constructor(
    public DashboardService: DashboardService,
    public Router: Router,
    public ScreenService: ScreenService,
    private fb: FormBuilder,

  ) {

  }

  toggleDrop(event) {
    this.drop = !this.drop;
    event.preventDefault();
  }

  resetForm() {
    this.searchForm.reset();
  }

  ngOnInit() {
     this.cities = [];
    this.cities.push({ label: 'New York', value: 'New York' });
    this.cities.push({ label: 'Rome', value: 'Rome' });
    this.cities.push({ label: 'London', value: 'London' });
    this.cities.push({ label: 'Istanbul', value: 'Istanbul' });
    this.cities.push({ label: 'Paris', value: 'Paris' });
    this.cities.push({ label: 'New York', value: 'New York' });
    this.cities.push({ label: 'Rome', value: 'Rome' });
    this.cities.push({ label: 'London', value: 'London' });
    this.cities.push({ label: 'Istanbul', value: 'Istanbul' });
    this.cities.push({ label: 'Paris', value: 'Paris' });

    this.searchForm = this.fb.group({
      tag: '',
      name: '',
      fromdate: '',
      todate: ''
    });

  }
  onSubmit() {
    debugger;
    console.log('this.searchForm', this.searchForm.value);
  }
  toggleMenu() {
    this.DashboardService.isMenuExpanded = !this.DashboardService.isMenuExpanded;
  }

  triggerLogout() {
    this.Router.navigate(['/logout']);
  }

  togglePrimeNav() {
    this.DashboardService.isMenuVisible = !this.DashboardService.isMenuVisible;
  }

  toggleNotif() {
    this.DashboardService.isNotifVisible = !this.DashboardService.isNotifVisible;
  }
}




