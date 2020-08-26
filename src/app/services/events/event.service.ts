// Copyright 2015, 2017 Greenwerx.org.
// Licensed under CPAL 1.0,  See license.txt  or go to https://greenwerx.org/docs/license.txt  for full license details.

import {  Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Api } from '../api/api';
import { Account, EventLocation , Favorite, Filter,  Screen} from '../../models/index';
import { Observable, of as observableOf} from 'rxjs';
import {EventsDashboard} from '../../models/index';
import {ServiceResult} from '../../models/serviceresult';

@Injectable({
  providedIn: 'root'
})
export class EventService  {

   public Dashboard: EventsDashboard;

   public Categories: string[] = [];

   public Properties: {name: string, caption: string, isChecked: boolean}[] = [];

   public Accounts: Account[] = [];

   // These are selected screens by user in the event-filter.ts
   // NOTE: in the filter dialog this only supports boolean fields i.e. private, active..
   // public EventScreens: Screen[] = [];
  //  public EventFilter: Filter = new Filter();

   public AvailableScreens:  Screen[] = []; // cache this


    constructor(private api: Api ) {
      /*
      this.EventFilter.SortBy = 'StartDate';
      this.EventFilter.SortDirection = 'asc';
      this.EventFilter.PageSize = 50;
      this.EventFilter.StartIndex = 0;
      this.EventFilter.PageResults = true;
      */

        this.Properties.push({
            name:  'private',
            caption: 'Include Private',
            isChecked: false
          });
    }

    addEvent(event) {
      return this.api.invokeRequest('POST', 'api/Events/Add', event);
    }

    addEventLocation(eventLocation: EventLocation) {
      return this.api.invokeRequest('POST', 'api/Events/Location/Insert',  eventLocation );
    }

    deleteEvent(eventUUID) {
      return this.api.invokeRequest('POST', 'api/Events/Delete/' + eventUUID, ''    );
    }

    getDashboard(view: string, filter?: Filter) {
        return this.api.invokeRequest('POST', 'api/Apps/Dashboard/' + view , filter );
    }

    getEvent(eventId) {
      if (this.Dashboard !== undefined && this.Dashboard.Events !== undefined) {
        for (let i = 0; i < this.Dashboard.Events.length; i++) {
            if ( this.Dashboard.Events[i].UUID === eventId ) {
              const res = new ServiceResult();
              res.Code = 200;
              res.Result = this.Dashboard.Events[i];
                return observableOf( res);
            }
        }
      }
      return this.api.invokeRequest('GET', 'api/EventBy/' + eventId, ''    );
        }

    getEventCategories() {
        return this.api.invokeRequest('GET', 'api/Events/Categories' );
    }

    getEventLocation(eventUUID) {
        if (this.Dashboard !== undefined && this.Dashboard.Locations !== undefined) {
            for (let i = 0; i < this.Dashboard.Locations.length; i++) {
                if ( this.Dashboard.Locations[i].EventUUID === eventUUID ) {
                  const res = new ServiceResult();
                  res.Code = 200;
                  res.Result = this.Dashboard.Locations[i] ;
                    return observableOf(res);
                }
            }
        }
        return this.api.invokeRequest('GET', 'api/Events/Locations/' + eventUUID, ''    );
    }

    getEvents(filter?: Filter):  Observable<Object> {
      return this.api.invokeRequest('POST', 'api/Events'  , filter );
    }

    // Returns reminders flagged as favorite
    getFavorites(filter: Filter) {
        return this.api.invokeRequest('POST', 'api/Events/Favorites', filter );
    }

    getHostEvents(accountUUID: string , filter?: Filter):  Observable<Object> {
        return this.api.invokeRequest('POST', 'api/Events/Hosts/' + accountUUID  , filter);
      }

    getPreviousLocations() {
        return this.api.invokeRequest('GET', 'api/Events/Locations/Account' );
    }

    public logOut() {
      this.Dashboard = null;
      this.Dashboard = new EventsDashboard();
      this.Categories = [];
      this.Properties = [];
      this.Accounts = [];
    }
    saveEventLocation(eventLocation: EventLocation ) {
       return this.api.invokeRequest('POST', 'api/Events/Location/Save',   eventLocation    );
    }

    updateEvent(event) {
      return this.api.invokeRequest('PATCH', 'api/Events/Update', event);
    }
    updateEventLocation(eventLocation: EventLocation  ) {
       return this.api.invokeRequest('POST', 'api/Events/Location/Update',  eventLocation  );
    }
}
