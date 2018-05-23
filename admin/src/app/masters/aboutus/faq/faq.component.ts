import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class FaqComponent implements OnInit {
  innerHeight: any;
  helpToShow = 'help1';

  constructor() { }

  public ngOnInit() {
    this.heightCalc();
  }

  public heightCalc() {
    this.innerHeight = window.screen.height;
    this.innerHeight = this.innerHeight - 400 + 'px';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.innerHeight = event.target.innerHeight - 290 + 'px';
  }

  show(helpToShow) {
    this.helpToShow = helpToShow;
  }
}
