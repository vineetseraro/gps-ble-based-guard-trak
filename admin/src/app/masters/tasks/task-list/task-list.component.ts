import { ViewChild } from '@angular/core';
import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTable } from 'primeng/components/datatable/datatable';
import { LazyLoadEvent, MenuItem, SelectItem } from 'primeng/primeng';
import { Observable } from 'rxjs/Rx';

import { GlobalService } from '../../../core/global.service';
import { StringUtil } from '../../../core/string.util';
import { Task, TaskModel } from '../shared/task.model';
import { TaskService } from '../shared/task.service';
import { SearchService } from './../../../core/search.service';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css'],
  providers: [TaskService]
})
export class TaskListComponent implements OnInit {
  @ViewChild('dt') public dataTable: DataTable;
  //// Variable Declaration ////
  taskModel: Observable<TaskModel>;
  dataList: Task[];
  dataRow: Task;
  display = false;
  id = '';
  title = '';
  totalRecords = 0;
  activeStatus: SelectItem[];
  previousQuery: string;
  items: MenuItem[];
  loader = false;
  pagingmessage = '';
  startPageIndex = 1;
  endPageIndex = 10;
  innerHeight: any;
  rows = '';
  emptyMessage = '';
  currentQuery: string;
  searchQuery = '';
  // private subscription: Subscription;
  eventObj: any;
  displayExport = false;
  exportMessage = '';


  /**
   * Creates an instance of TaskListComponent.
   * @param {TaskService} taskService
   * @param {Router} router
   * @param {GlobalService} globalService
   * @param {ActivatedRoute} route
   * @memberof TaskListComponent
   */
  constructor(
    private taskService: TaskService,
    private router: Router,
    private globalService: GlobalService,
    private route: ActivatedRoute,
    // private confirmationService: ConfirmationService,
    private searchService: SearchService) {
  }


  /**
   * Init Method
   * @memberof TaskListComponent
   */
  public ngOnInit() {
    this.loader = true;
    //// Search Service /////
    this.searchService.notifyObservable$.subscribe((res) => {
      if (res.hasOwnProperty('option') && res.option === 'task_search') {
        // reset offset here
        this.eventObj.first = 0;
        this.currentQuery = this.globalService.prepareQuery(this.eventObj);
        this.getTaskList(this.currentQuery + res.value);
        this.searchQuery = res.value;
        console.log(res.value);
        this.startPageIndex = 1;
        this.dataTable.onFilterKeyup('', '', 'Contains');
      }
    });
    this.getActiveStatus();
    this.items = [
      {
        label: 'PDF Export', icon: 'fa-refresh', command: () => {
          this.export();
        }
      },
      {
        label: 'Excel Export', icon: 'fa-close', command: () => {
          this.export();
        }
      },
    ];
    this.heightCalc();
    console.log('storage value ' + window.localStorage.getItem('numRows'));
    this.rows = window.localStorage.getItem('numRows');


  }

  public heightCalc() {
    this.innerHeight = (window.screen.height);
    this.innerHeight = (this.innerHeight - 400) + 'px';
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerHeight = ((event.target.innerHeight) - 290) + 'px';
  }

  /**
   * Function for exporting the records
   * @memberof TaskListComponent
   */
  public export() {
    let statusMessage;
    const self = this;
    this.loader = true;
    if (this.totalRecords > 0) {
      const format = 'csv', entity = 'tasks';
      const queryObject = this.globalService.queryStringToObject(this.currentQuery);

      this.globalService.export(format, entity, queryObject).subscribe(
        data => {
          console.log(data);
          self.exportStatus(data.description);
        },
        error => {
          console.log(error);
          self.exportStatus(error.description);
        }
      );
    } else {
      statusMessage = 'No records to export';
      self.exportStatus(statusMessage)
    }
  }

  /**
   * Function for opening the Task Add Form
   * @memberof TaskListComponent
   */
  public addData() {
    this.router.navigate(['tasks/add']);
  }

  /**
   * Task Edit Function
   * @param {Task} dataRow
   * @memberof TaskListComponent
   */
  public onEdit(dataRow: Task) {
    this.router.navigate([dataRow.id, 'edit'], { relativeTo: this.route });
  }

  /**
   * Task Delete Function
   * @param {Task} dataRow
   * @memberof TaskListComponent
   */
  public onDelete(dataRow: Task) {
    if (confirm('Are you sure you want to delete ' + dataRow.name + '?')) {
      this.taskService.remove(dataRow.id)
        .subscribe(
        (data: any) => {
          data;
          this.router.navigate(['/contacts']);
        },
        (err: any) => {
          err;
          alert('Error in delete !!!');
        });
    }
  }

  /**
   * Load the Task Data
   * @param {LazyLoadEvent} event
   * @memberof TaskListComponent
   */
  loadData(event: LazyLoadEvent) {
    // console.log(event);
    this.eventObj = event;
    this.startPageIndex = event.first + 1;
    this.endPageIndex = event.first + event.rows;
    this.currentQuery = this.globalService.prepareQuery(event) + this.searchQuery;
    if (this.currentQuery !== this.previousQuery) {
      this.getTaskList(this.currentQuery);
      this.previousQuery = this.currentQuery;
    }
  }

  /**
   * Get Listing
   * @param {string} query
   * @memberof TaskListComponent
   */
  public getTaskList(query: string) {
    this.loader = true;
    this.taskService.getAll(query).subscribe(data => {
      const result = data.data;
      this.totalRecords = data.totalRecords;
      this.setPageinationgMessage(data.data.length);
      this.emptyMessage = StringUtil.emptyMessage;
      this.dataList = result;
      this.loader = false;
      this.loader = false;
    },
      error => {
        this.emptyMessage = StringUtil.emptyMessage;
        if (error.code === 210 || error.code === 404) {
          this.dataList = [];
          this.previousQuery = '';
          this.setPageinationgMessage(0);
        }
        this.loader = false;
      });
  }
  /**
   * Set Pagination Message
   */
  setPageinationgMessage(listSize: number) {
    if (listSize !== 0) {
      this.endPageIndex = listSize + this.startPageIndex - 1;
    } else {
      this.startPageIndex = 0;
      this.endPageIndex = 0;
      this.totalRecords = 0;
    }
    this.pagingmessage = 'Showing ' + this.startPageIndex + ' to ' + this.endPageIndex + ' of ' + this.totalRecords + ' entries';
  }
  /**
   * Function for getting the status
   * @memberof TaskListComponent
   */
  public getActiveStatus() {
    this.activeStatus = [];
    this.activeStatus.push({ label: 'All', value: null });
    this.activeStatus.push({ label: 'Y', value: '1' });
    this.activeStatus.push({ label: 'N', value: '0' });
  }

  exportStatus(statusMessage) {
    this.loader = false;
    this.exportMessage = statusMessage;
    this.displayExport = true;
  }
}
