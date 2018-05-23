import 'rxjs/add/operator/map';
import { TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';
import { LazyLoadEvent } from 'primeng/primeng';
import { Configuration } from './ak.constants';
import { GlobalService } from './global.service';
import { HttpRestService } from './http-rest.service';

describe('Component: Login', () => {
    let globalService: GlobalService;
    let lazyLoadEvent: LazyLoadEvent={first:0,rows:10,multiSortMeta:null,globalFilter:null,filters:null};
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [GlobalService,HttpRestService,Configuration],
            imports:[HttpModule]
        });
        globalService = TestBed.get(GlobalService);
    });


    it('create  query base on event', () => {
        expect(globalService.prepareQuery(lazyLoadEvent)).toBe('?offset=0&limit=10');
    });
});