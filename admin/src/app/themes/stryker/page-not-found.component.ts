import { Component } from '@angular/core';
@Component({
  template: '<div class="page-not-found">' +
            '<img src="./assets/error-404.png">' +
            '<br/><a style="color:#1E88E5" [routerLink]="[\'/dashboard\']">Go back to the home page</a></div>'
})
export class PageNotFoundComponent { }
