import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { Message } from 'primeng/primeng';

import { GlobalService } from '../../../core/global.service';
import { Audittrail } from '../shared/audittrail.model';
import { AudittrailService } from '../shared/audittrail.service';


@Component({
  selector: 'app-audittrail-details',
  templateUrl: './audittrail.component.html',
  styleUrls: ['./audittrail.component.scss'],
  providers: [AudittrailService, GlobalService]
})

export class AudittrailComponent implements OnInit {
  attributes: SelectItem[];
  code = '';
  name = '';
  msgs: Message[] = [];
  id = '';
  audittrail: Audittrail;
  title = '';
  display = false;
  tags: any = [];
  loader = false;
  editmessage = '';
  /**
   * Creates an instance of AudittrailComponent.
   * @param {audittrailService} AudittrailService
   * @param {Router} router
   * @param {FormBuilder} fb
   * @param {ActivatedRoute} route
   * @param {GlobalService} globalService
   * @memberof AudittrailComponent
   */
  constructor(
    private attributeService: AudittrailService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  /**
   * Function for closing the modal box
   * @memberof AudittrailComponent
   */

  /**
   * Init function
   * @memberof AudittrailComponent
   */
  ngOnInit() {
    this.route.params.subscribe(
      (params: any) => {
        if (params.hasOwnProperty('id')) {
          this.id = params['id'];
          this.loader = true;
          this.attributeService.getAudittrailDetails(this.id).subscribe((data:any) => {
            this.loader = false;
            this.audittrail = data.data;
          });
          this.title = 'Audit Trail Detail';
        }
      }
    );
  }

  /**
   * Function for showing the error
   * @memberof AudittrailComponent
   */
  public showError(error: any) {
    this.msgs = [];
    error.data.forEach((element: any) => {
      this.msgs.push({ severity: 'error', summary: 'Error Message', detail: element.message });
    });
  }

  onCancel() {
    this.navigateBack();
  }

  private navigateBack() {
    this.router.navigate(['/audittrails']);
  }

}

