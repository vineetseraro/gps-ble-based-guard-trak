import { DashboardService } from '../services/dashboard.service';
import { ScreenService } from '../services/screen.service';
import { Directive, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs/Rx';

@Directive({ selector: '[screenLarge]' })
export class ScreenLarge implements OnDestroy {
  private hasView = false;
  private screenSubscription: Subscription;

  constructor(private viewContainer: ViewContainerRef,
    private template: TemplateRef<Object>,
    private screenService: ScreenService,
    private DashboardService: DashboardService
  ) {

    this.screenSubscription = screenService.resize$.subscribe(() => this.onResize());

  }

  @Input()
  set screenLarge(condition) {
    // ignore the passed condition and set it based on screen size
    condition = this.screenService.screenWidth >= this.screenService.largeBreakpoint;

    if (condition && !this.hasView) {
      this.hasView = true;
      this.viewContainer.createEmbeddedView(this.template);
      this.DashboardService.isMenuVisible = true;
    } else if (!condition && this.hasView) {
      this.hasView = false;
      this.viewContainer.clear();
      this.DashboardService.isMenuVisible = false;
    }
  }

  ngOnDestroy() {
    this.screenSubscription.unsubscribe();
  }

  onResize() {
    // trigger the setter
    this.screenLarge = false;
  }
}
