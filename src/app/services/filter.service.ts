import { Injectable } from '@angular/core';
import {Filter, Screen} from '../models/index';
import {SessionService} from './session.service';
import {ObjectFunctions} from '../common/object.functions';
//import * as momentTimezone from 'moment-timezone';

@Injectable({
    providedIn: 'root'
  })
export class FilterService  {
    public DefaultPageSize = 50;

    public Filters: Filter[] = [];

    constructor(
        private sessionService: SessionService
       ) {

    }
    public addFilter( filter: Filter): boolean {

        const index = this.getFilterIndex( filter.ViewType);
        if (index > 0) {
            return false;
        }

        this.Filters.push(filter);
    }

    public addScreen(viewType: string, screen: Screen) {
        const index = this.getFilterIndex(viewType);
        if (index < 0) {
            let filter = new Filter();
            filter.ViewType = viewType;
            filter = this.initializeFilterLocation(filter);
            filter.SortBy = this.getDefaultSortBy(viewType);
            this.Filters.push(filter);
            this.addScreen(viewType, screen);
            return;
        }
        this.Filters[index].Screens.push(screen);
    }

    public getFilter(viewType: string): Filter {
        const index = this.getFilterIndex(viewType);

        if (index < 0) {
            const filter = new Filter();
            filter.ViewType = viewType;
            filter.SortBy = this.getDefaultSortBy(viewType);
            this.Filters.push(filter);
            this.resetFilter(viewType);
            return this.getFilter(viewType);
        }
        return this.Filters[index];
    }

    private getDefaultSortBy(viewType: string): string {
        console.log('filter.service.ts getDefaultSortBy viewType:', viewType);
        if (ObjectFunctions.isNullOrWhitespace(viewType)) {
            return 'name';
        }
        let sortBy = 'name';
        const type = viewType.toLowerCase();
        switch (type) {
            case 'profile':
                sortBy = 'distance';
                break;
            case 'post':
                sortBy = 'publishdate';
                break;
            case 'event':
                sortBy = 'startdate';
                break;
            case 'host':
                sortBy = 'name';
                break;

        }
        return sortBy;
    }

    getFilterIndex(viewType: string): number {
        for (let i = 0; i < this.Filters.length; i++) {
            if (this.Filters[i].ViewType === viewType) {
                return i;
            }
        }
        return -1;
    }



    public initializeFilterLocation(filter: Filter): Filter {
        console.log('filter.service.ts initializeFilterLocation');

      if (this.sessionService.validSession() === true) {
        console.log('filter.service.ts initializeFilterLocation (this.sessionService.validSession() === true');
        if (   ObjectFunctions.isValid(this.sessionService.CurrentSession.Profile ) === true &&
            ObjectFunctions.isValid(this.sessionService.CurrentSession.Profile.LocationDetail) === true &&
          ( this.sessionService.CurrentSession.Profile.LocationDetail.Latitude !== '0' &&
            this.sessionService.CurrentSession.Profile.LocationDetail.Longitude !== '0' )) {

              console.log('filter.service.ts initializeFilterLocation SETTING LOCATION');

          filter.Latitude = parseFloat(this.sessionService.CurrentSession.Profile.LocationDetail.Latitude);
          filter.Longitude = parseFloat( this.sessionService.CurrentSession.Profile.LocationDetail.Longitude);
          // tslint:disable-next-line:max-line-length
          console.log('filter.service.ts initializeFilterLocation SETTING LOCATION this.filter.Latitude:', filter.Latitude);
          // tslint:disable-next-line:max-line-length
          console.log('filter.service.ts initializeFilterLocation SETTING LOCATION this.filter.Longitude:', filter.Longitude);
          return filter;
        }
      }


      filter.Latitude = 0;
      filter.Longitude = 0;

      return filter;
    }

    resetFilter(viewType: string) {
        const index = this.getFilterIndex(viewType);

        if (index < 0) {
            const filter = new Filter();
            filter.ViewType = viewType;
            filter.SortBy = this.getDefaultSortBy(viewType);
            this.Filters.push(filter);
            this.resetFilter(viewType); // callback and it should go to below instead of in here
            return;
        }

        this.Filters[index] = new Filter();
        this.Filters[index].ViewType = viewType;
       // this.Filters[index] = this.initializeFilterLocation( this.Filters[index]);
        this.Filters[index].Page = 1;
        this.Filters[index].SortBy = this.getDefaultSortBy(viewType);
        this.Filters[index].SortDirection = 'ASC';
        this.Filters[index].PageSize = 50;
        this.Filters[index].StartIndex = 0;
        this.Filters[index].PageResults = true;
      //  this.Filters[index].TimeZone =   momentTimezone.tz.guess();
        this.Filters[index] = this.initializeFilterLocation(this.Filters[index]);

        if (viewType === 'POST' &&
            this.sessionService.validSession() === true) {
            this.Filters[index].IncludePrivate = true;
        }
    }

    logOut() {
        this.Filters  = [];
    }

    public setFilter( filter: Filter) {
        const index = this.getFilterIndex(filter.ViewType);
        if (index < 0) {
            this.Filters.push(filter);
            return;
        }
        filter = this.initializeFilterLocation(filter);
        this.Filters[index] = filter;
    }
}
