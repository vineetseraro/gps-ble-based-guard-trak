import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula/ng2-dragula';

import { BarChart } from '../shared/barchart.model';
import { Gadget } from '../shared/gadget.model';
import { GadgetService } from '../shared/gadget.service';
import { Report } from '../shared/report.model';
import { ReportService } from '../shared/report.service';
import { UserGadgetModel } from '../shared/user-gadget.model';
import { UserGadgetService } from '../shared/user-gadget.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [DragulaService, GadgetService, UserGadgetService, ReportService]
})
export class DashboardComponent implements OnInit {

  blankItem: any;
  loader = false;
  loaderadd = false;
  addWidgetDialog = false;
  editDashboardLayout = false;
  dvalue: any;
  layoutClass = 'width-50-50';
  availableGadget: Gadget[];
  routeName: any;
  router: any;
  userGadgets: UserGadgetModel;
  public isDivShow = true;
  public divShow = true;
  openHelpText=false;
  //// Graph Data //////////////////
  graphData: Report[];
  caseStatusGraphData: Report[];
  upcomingCaseStatusGraphData: Report[];
  upcomingShipmentStatusGraphData: Report[];
  shipmentStatusGraphData: Report[];
  casesBySurgeryType: BarChart[];
  casesBySurgeon: BarChart[];
  casesPerSalesRep: BarChart[];
  shipmentPerCarrier: BarChart[];
  casesPerHospital: BarChart[];


  constructor(
    dragulaService: DragulaService,
    private gadgetService: GadgetService,
    private userGadgetService: UserGadgetService) {
    // TODO
    dragulaService.drag.subscribe((value: any) => {
      // console.log(`drag: ${value[0]}`); // value[0] will always be bag name
      this.onDrag(value.slice(1));
    });
    dragulaService.drop.subscribe((value: any) => {
      // this.dvalue = value;
      this.onDrop(value.slice(1));
    });
    dragulaService.over.subscribe((value: any) => {
      // console.log(`over: ${value[0]}`);
      this.onOver(value.slice(1));
    });
    dragulaService.out.subscribe((value: any) => {
      // console.log(`out: ${value[0]}`);
      this.onOut(value.slice(1));
    });

    dragulaService.setOptions('first-bag', {
      revertOnSpill: true
    });

    dragulaService.dropModel.subscribe((value:any) => {
      console.log("Value");
      console.log(value.slice(1));
      //this.onDropModel(value.slice(1));
    });

  }

  ngOnInit() {
    ///// Get all Available Gadgets /////
    this.loader = true;
    this.gadgetService.getAll().subscribe((data:any) => {
      this.availableGadget = data.data;
      this.loader = false;
    });
    ///// Get all Users Gadgets /////
    this.loader = true;
    this.userGadgetService.getAll().subscribe((data:any) => {
      this.userGadgets = data.data;
      this.loader = false;
    });
  }

  private onDrag(args: any): void {
    let [e] = args;
    this.removeClass(e, 'ex-moved');
  }

  private onDrop(args: any): void {
    args;
    this.loader = true;
    setTimeout(()=>{    //<<<---    using ()=> syntax
      this.userGadgetService.update(this.userGadgets).subscribe((data:any) => {
        data;
        data = this.userGadgets;
        this.loader = false;
      })
    },2000);
    console.log(this.userGadgets);
  }

  private onOver(args: any): void {
    let [el] = args;
    this.addClass(el, ' ex-over');
  }

  private onOut(args: any): void {
    let [el] = args;
    this.removeClass(el, 'ex-over');
  }

  private removeClass(el: any, name: string): void {
    if (this.hasClass(el, name)) {
      el.className = el.className.replace(new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)', 'g'), '');
    }
  }

  private hasClass(el: any, name: string): any {
    return new RegExp('(?:^|\\s+)' + name + '(?:\\s+|$)').test(el.className);
  }

  private addClass(el: any, name: string): void {
    if (!this.hasClass(el, name)) {
      el.className = el.className ? [el.className, name].join(' ') : name;
    }
  }

  addGadgetDialog() {
    this.addWidgetDialog = true;
  }

  editLayoutDialog() {
    this.editDashboardLayout = true;
  }

  addGadget(gadget: any) {
    this.loaderadd = true;
    //this.addWidgetDialog = false;
    const gadgets = [...this.userGadgets.position.leftSection];
    let gadgetData = {
      "gadgetId": gadget._id,
      "type": gadget.type,
      "gadgetCode": gadget.code,
      "visible": true,
      "name": gadget.name,
      "helpText": gadget.description,
      "position": {
        "section": "right-section",
        "orderPosition": 1
      },
      "params": {}
    };
    console.log("Gadget Add");
    console.log(gadget);
    gadgets.push(gadgetData);
    this.userGadgets.position.leftSection = gadgets;
    /// Save the Users Gadgets ////
    this.userGadgetService.update(this.userGadgets).subscribe((data:any) => {
      data;
      data = this.userGadgets;
      this.loaderadd = false;
    }
    );
  }

  deleteGadget(position:any, gadgetData: any) {
    this.loader = true;
    if(position == "left") {
      const index = this.userGadgets.position.leftSection.indexOf(gadgetData);
      this.userGadgets.position.leftSection = this.userGadgets.position.leftSection.filter((val: any, i: any) => { val = val; return i !== index; });
      /// Delete the Users Gadgets ////
      this.userGadgetService.update(this.userGadgets).subscribe((data:any) => {
        data;
        data = this.userGadgets;
        this.loader = false;
      }
      );
    }
    else if(position == "right") {
      const index = this.userGadgets.position.rightSection.indexOf(gadgetData);
      this.userGadgets.position.rightSection = this.userGadgets.position.rightSection.filter((val: any, i: any) => { val = val; return i !== index; });
      /// Delete the Users Gadgets ////
      this.userGadgetService.update(this.userGadgets).subscribe((data:any) => {
        data;
        data = this.userGadgets;
        this.loader = false;
      }
      );
    }
  }



  public showDiv(position:any, x:any): void {
    console.log(x)
    if(position == "left") {
      for (var i = 0; i < this.userGadgets.position.leftSection.length; i++) {
        if (x == this.userGadgets.position.leftSection[i].gadgetId) {
          this.userGadgets.position.leftSection[i].visible = true;
          console.log(this.userGadgets.position.leftSection[i]);
        }
        this.divShow = true;
      }
    }
    else if(position == "right") {
      for (var i = 0; i < this.userGadgets.position.rightSection.length; i++) {
        if (x == this.userGadgets.position.rightSection[i].gadgetId) {
          this.userGadgets.position.rightSection[i].visible = true;
          console.log(this.userGadgets.position.rightSection[i]);
        }
        this.divShow = true;
      }
    }
  }

  public hideDiv(position:any, x:any): void {
    if(position == "left") {
      for (var i = 0; i < this.userGadgets.position.leftSection.length; i++) {
        if (x == this.userGadgets.position.leftSection[i].gadgetId) {
          this.userGadgets.position.leftSection[i].visible = false;
          console.log(this.userGadgets.position.leftSection[i]);
        }

        // x.removeClass("show");
        this.divShow = false;
      }
    }
    else if(position == "right") {
      for (var i = 0; i < this.userGadgets.position.rightSection.length; i++) {
        if (x == this.userGadgets.position.rightSection[i].gadgetId) {
          this.userGadgets.position.rightSection[i].visible = false;
          console.log(this.userGadgets.position.rightSection[i]);
        }

        // x.removeClass("show");
        this.divShow = false;
      }
    }
  }

  changeLayout(layoutClass: any) {
    this.layoutClass = layoutClass;
    this.editDashboardLayout = false;
  }
   setFlagForHelptext(flag: boolean) {
        this.openHelpText = flag;
    }

}
