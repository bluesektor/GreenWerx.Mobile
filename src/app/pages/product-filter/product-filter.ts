import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { EventService } from '../../services/events/event.service';
import { ServiceResult} from '../../models/serviceresult';
import { Events } from '@ionic/angular';
import { ObjectFunctions } from '../../common/object.functions';
import { SessionService} from '../../services/session.service';
import { AccountService} from '../../services/user/account.service';
import { Filter, Screen } from '../../models/index';
import { environment } from '../../../environments/environment';
import {FilterService} from '../../services/filter.service';
import {Api} from '../../services/api/api';
// todo refactor the screens and filters in the services to be in a singular class.
@Component({
  selector: 'page-product-filter',
  templateUrl: 'product-filter.html',
  styleUrls: ['./product-filter.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductFilterPage implements AfterViewInit {

  loading = false;

  public sortByScreens:  Screen[] = []; // cache th

  constructor(
    private filterService: FilterService,
    private http: HttpClient,
    public modalCtrl: ModalController,
    public eventService: EventService,
    private sessionService: SessionService,
    private accountService: AccountService,
    public messages: Events,
      ) {

      }

    public type: string;

  applyFilters() {
    // this.filterService.resetFilter(this.type);
    const index = this.filterService.getFilterIndex(this.type);
    if (index < 0) {
      console.log('product-filter.ts applyFilters NO FILTER FOUND');
      return;
    }
    this.filterService.Filters[index].StartIndex = 0;
    let screens = null;

    switch ( this.type) {
        case 'PRODUCT':
           screens = this.eventService.AvailableScreens.filter( c => c.Selected === true).map(function(c) {
            console.log('product-filter.ts applyFilters this.eventService.AvailableScreens.filter:', c);
            return c;
            });
        break;
        case 'HOST':
            screens =
                this.accountService.AvailableScreens.filter( c => c.Selected === true).map(function(c) {
                console.log('product-filter.ts applyFilters this.accountService.AvailableScreens.filter:', c);
                return c;
            });
        break;
      }
      this.filterService.Filters[index].PageSize = 50;
      this.filterService.Filters[index].Page = 1;
      this.filterService.Filters[index].Screens = screens;

      if ( 'distance' === this.filterService.Filters[index].SortBy.toLowerCase() ){
     // this.type
         // TODO recalculate the distance for cached items. Do it when 'done' or 'ok' button is selected.
      }
      // Pass back filter. NOTE not working reliably.
      this.dismiss(this.filterService.Filters[index]);
  }

close() {
  this.dismiss(this.filterService.getFilter(this.type));
}

dismiss(filter: Filter) {
  // using the injected ModalController this page
  // can "dismiss" itself and pass back data
  this.modalCtrl.dismiss(filter);
}


  initializeView() {
    console.log('A. product-filter.ts initializeView');
    this.loading = true;
    let sortBy =  'Name';
    let sortDir = 'ASC';

    console.log('C product-filter.ts initializeView this.type:', this.type);
    const index = this.filterService.getFilterIndex(this.type);
    if (index >= 0) {
      switch ( this.type) {
        case 'PRODUCT':
            console.log('C.1 product-filter.ts initializeView index:', index);
            console.log('C.1 product-filter.ts initializeView this.filterService:', this.filterService);
            console.log('C.1 product-filter.ts initializeView  this.filterService.Filters[index].:', this.filterService.Filters[index]);
          sortBy = 'StartDate';
          this.filterService.Filters[index].Screens.forEach(screen => {    // loop through selected screens
            const idx = this.eventService.AvailableScreens.findIndex( asc => asc.Caption === screen.Caption );
            if (idx < 0 ) { return; }
            // find the selected in the available and set the Value field in available to selected
               this.eventService.AvailableScreens[idx].Value =   screen.Value;
           });
        break;
        case 'HOST':

            this.filterService.Filters[index].Screens.forEach(screen => {    // loop through selected screens
            const idx = this.accountService.AvailableScreens.findIndex( asc => asc.Caption === screen.Caption );
            if (idx < 0 ) { return; }
            // find the selected in the available and set the Value field in available to selected
               this.accountService.AvailableScreens[idx].Value =   screen.Value;
           });
        break;
      }
      if (ObjectFunctions.isNullOrWhitespace( this.filterService.Filters[index].SortBy) === false) {
        sortBy =   this.filterService.Filters[index].SortBy;
        sortDir =  this.filterService.Filters[index].SortDirection;
      }
    }
    console.log('D product-filter.ts initializeView sortBy:', sortBy);

    this.sortByScreens.forEach( prop => {
          prop.Selected = false;
          console.log('D product-filter.ts initializeView prop.Value :', prop.Value );
          if (prop.Value.toLowerCase() === sortBy.toLowerCase()) {
            prop.Selected = true;
            console.log('E. product-filter.ts initializeView sortBy selected:', sortBy);
          }
        });
    this.loading = false;
  }

  ionViewDidEnter() {
    console.log('product-filter.ts ionViewDidEnter type:',  this.type);


    switch ( this.type) {
        case 'PRODUCT':
            this.sortByScreens = [];
            const sort = new Screen();
            sort.Command = 'OrderBy';
            sort.Field =  'Distance';
            sort.Selected = false;
            sort.Caption = 'Distance';
            sort.Value = 'Distance';
            // sort.Type = res[i].Type;
            this.sortByScreens.push(sort);

            const sortName = new Screen();
            sortName.Command = 'OrderBy';
            sortName.Field =  'Name';
            sortName.Selected = false;
            sortName.Caption = 'Name';
            sortName.Value = 'Name';
            // sort.Type = res[i].Type;
            this.sortByScreens.push(sortName);

            const sortStart = new Screen();
            sortStart.Command = 'OrderBy';
            sortStart.Field =  'StartDate';
            sortStart.Selected = false;
            sortStart.Caption = 'Start Date';
            sortStart.Value = 'StartDate';
            // sort.Type = res[i].Type;
            this.sortByScreens.push(sortStart);
            this.loadEventCategories();
        break;
        case 'HOST':
            this.sortByScreens = [];

            const asort = new Screen();
            asort.Command = 'OrderBy';
            asort.Field =  'Distance';
            asort.Selected = false;
            asort.Caption = 'Distance';
            asort.Value = 'Distance';
            // sort.Type = res[i].Type;
            this.sortByScreens.push(asort);

            const asortName = new Screen();
            asortName.Command = 'OrderBy';
            asortName.Field =  'Name';
            asortName.Selected = false;
            asortName.Caption = 'Name';
            asortName.Value = 'Name';
            // sort.Type = res[i].Type;
            this.sortByScreens.push(asortName);

            this.loadAccountCategories();
        break;
        default:

        break;
      }
      this.initializeView();
  }

  isUserInrole(roleName: string): boolean {
    console.log('isUserInRole  product-filter.ts ');
    return this.sessionService.isUserInRole(roleName);
  }


  async loadAccountCategories() {

    // NOTE: Name must match the property name
        // because we're going to create a filter based on the name
        // todo if there are selected screens (EventScreens)
        // then initialize the view to toggle them on..
        //
        const accountFilter = this.filterService.getFilter('ACCOUNT');
        if (accountFilter.Screens !== undefined && accountFilter.Screens.length > 0) {
          console.log('product-filter.ts cached screens  this.accountService.AvailableScreens:',  this.accountService.AvailableScreens);

          this.initializeView();
        } else {
          console.log('product-filter.ts loadAccountCategories');

          this.loading = true;
         await this.http.get( Api.url + 'Content/filters/account.web.json').subscribe(res => {
           if (res) {
             console.log('product-filter.ts loadAccountCategories res:', res);
             this.accountService.AvailableScreens = [];
             this.accountService.Categories = [];

             if (!Array.isArray(res)) {
               console.log('product-filter.ts loadAccountCategories !Array.isArray(res) returning');
               this.loading = false;
               return;
             }

             for (let i = 0; i < res.length; i++) {
               const screen = new Screen();
               screen.Command = res[i].Command;
               screen.Field = res[i].Field;
               screen.Selected = res[i].Selected;
               screen.Caption = res[i].Caption;
                screen.Value = res[i].Value;
               screen.Type = res[i].Type;
               screen.ParserType = res[i].ParserType;
          screen.Junction = res[i].Junction;
               // "Icon" : "assets/icon/promoter-200.png"
               this.accountService.AvailableScreens.push(screen);
               this.accountService.Categories.push(screen.Caption);
             }
             this.accountService.AvailableScreens.sort((a, b) => (a.Caption > b.Caption) ? 1 : ((b.Caption > a.Caption) ? -1 : 0));
             this.initializeView();
             this.loading = false;
           }
         }, (err)  => {
           this.messages.publish('service:err', err);
           return;
         });
        }
      }

  async loadEventCategories() {
    const eventFilter = this.filterService.getFilter('EVENT');
    console.log('product-filter.ts loadEventCategories  eventFilter:', eventFilter);

    if (eventFilter.Screens !== undefined && eventFilter.Screens.length > 0) {
      // tslint:disable-next-line:max-line-length
      console.log('product-filter.ts loadEventCategories cached screens  this.eventService.AvailableScreens:',  this.eventService.AvailableScreens);
      // we want to use the cached screens so we can keep track when the user reloads this screen.
      this.initializeView();
    } else {
    console.log('product-filter.ts loadEventCategories');
   
    const file =  Api.url + 'Content/filters/event.web.json';
    console.log('product-filter.ts loadEventCategories file:', file);

    this.http.get(file)
    .subscribe(res => {
      if (res) {
        console.log('product-filter.ts loadEventCategories res:', res);
        this.eventService.AvailableScreens = [];
        this.eventService.Categories = [];

        if (!Array.isArray(res)) {
          console.log('product-filter.ts loadEventCategories !Array.isArray(res) returning');
          return;
        }

        for (let i = 0; i < res.length; i++) {
          const screen = new Screen();
          screen.Command = res[i].Command;
          screen.Field = res[i].Field;
          screen.Selected = res[i].Selected;
          screen.Caption = res[i].Caption;
           screen.Value = res[i].Value;
          screen.Type = res[i].Type;
          screen.ParserType = res[i].ParserType;
          screen.Junction = res[i].Junction;
          // "Icon" : "assets/icon/promoter-200.png"
          this.eventService.AvailableScreens.push(screen);
          this.eventService.Categories.push(screen.Caption);
        }



        this.eventService.AvailableScreens.sort((a, b) => (a.Caption > b.Caption) ? 1 : ((b.Caption > a.Caption) ? -1 : 0));
        this.initializeView();
      }
    }, (err)  => {
      this.messages.publish('service:err', err);
      return;
    });
  }

/*

  // NOTE: Name must match the property name
      // because we're going to create a filter based on the name
      // todo if there are selected screens (EventScreens)
      // then initialize the view to toggle them on..
      //
      if (this.eventService.EventFilter.Screens !== undefined && this.eventService.EventFilter.Screens.length > 0) {
        console.log('product-filter.ts cached screens  this.eventService.AvailableScreens:',  this.eventService.AvailableScreens);

        this.initializeView();
      } else {
        console.log('product-filter.ts loadEventCategories getEventCategories');
        this.loading = true;
        await this.eventService.getEventCategories().subscribe((response) => {
          console.log('product-filter.ts loadEventCategories getEventCategories response:', response);
          this.loading = false;
          const data = response as ServiceResult;
          if (data.Code !== 200) {
            this.messages.publish('api:err', data);
            return;
          }
          this.eventService.AvailableScreens = [];
          this.eventService.Categories = [];
          console.log('product-filter.ts data.Result:', data.Result);
          if (ObjectFunctions.isValid(data.Result) === true) {
            data.Result.forEach(name => {
              if (!name) {
                return;
              }
              console.log('product-filter.ts data.Result.foreach:', name);
               // Category matches to these screen fields
              const screen = new Screen();
              screen.Command = 'SEARCHBY';
              screen.Field = 'CATEGORY';
              //  screen.ParserType = 'sql';
              screen.Selected = false;
              screen.Caption = name;
               screen.Value = name; // 'false';
              screen.Type = 'category';
              this.eventService.AvailableScreens.push(screen);
              this.eventService.Categories.push(name); });
          }
        });
      }
      */
  }

  ngAfterViewInit() { }

  onChangeRadioGroupSortBy(event: any) {
    console.log('product-filter.ts onChangeRadioGroupSortBy event:', event.detail.value);
    const index = this.filterService.getFilterIndex(this.type);
    console.log('product-filter.ts onChangeRadioGroupSortBy index:', index);
    if (index < 0) {
      return;
    }
    this.filterService.Filters[index].SortBy = event.detail.value;
  }

  onToggleSortBy(event: any, sortby: any) {
    console.log('product-filter.ts onToggleSortBy ');
    if (this.loading === true ) {
      console.log('product-filter.ts onToggleSortBy EVENT sortby loading is true, returing');
      return false;
    }
  
    let index = -1;

    for (let i = 0; i < this.sortByScreens.length; i++) {
      this.sortByScreens[i].Selected = false;
      if ( this.sortByScreens[i].Value.toLowerCase() === sortby.Value.toLowerCase() ) {
        index = i;
      }
    }
    if ( index > -1) {
      this.sortByScreens[index].Selected = true;
    }

    const filterIndex = this.filterService.getFilterIndex(this.type);
    if (filterIndex < 0) {
      return;
    }
    this.filterService.Filters[filterIndex].SortBy = sortby.Value;
    if ( 'distance' === sortby.Value.toLowerCase() ) {
      if (!navigator.geolocation ) {
        console.log('product-filter.ts getCurrentLocation returning');
        return;
      }

    // this.processing = true;
    navigator.geolocation.getCurrentPosition((resp) => {
    console.log('product-filter.ts.ts getCurrentLocation position:', resp);
    console.log('product-filter.ts.ts getCurrentLocation this.sessionService.CurrentSession:', this.sessionService.CurrentSession);
        this.sessionService.CurrentSession.Profile.Latitude = resp.coords.latitude.toString();
        this.sessionService.CurrentSession.Profile.Longitude = resp.coords.longitude.toString();
        console.log('product-filter.ts.ts getCurrentLocation setting filter location');
        this.filterService.Filters[filterIndex].Latitude = resp.coords.latitude;
        this.filterService.Filters[filterIndex].Longitude = resp.coords.longitude;
      });
    }

    // tslint:disable-next-line:max-line-length
    console.log('product-filter.ts onToggleSortBy  this.filterService.Filters[filterIndex].SortBy :',  this.filterService.Filters[filterIndex].SortBy );
    return (false);
  }

  radioBlur() {
    console.log('product-filter.ts radioBlur ');
  }

  radioFocus() {
    console.log('product-filter.ts radioFocus ');
  }

  resetFilters() {
    this.loading = true;
    this.sortByScreens.forEach( prop => {
      prop.Selected = false;
    });
    const index = this.filterService.getFilterIndex(this.type);
    if (index < 0) {
      return;
    }
    this.filterService.Filters[index].Screens = [];
    this.filterService.Filters[index].IncludeDeleted = false;
    this.filterService.Filters[index].IncludePrivate = false;
    this.filterService.Filters[index].SortDirection = 'ASC';

    switch ( this.type) {
        case 'EVENT':
            // reset all of the toggles to be checked
            this.eventService.AvailableScreens.forEach(prop => {
                // prop.Value = 'false';
                prop.Selected = false;
            });

            this.filterService.Filters[index].SortBy = 'StartDate';

            // this.eventService.EventFilter.TimeZone = '';
        break;
        case 'HOST':
            // reset all of the toggles to be checked
            this.accountService.AvailableScreens.forEach(prop => {
                // prop.Value = 'false';
                prop.Selected = false;
            });
            this.filterService.Filters[index].SortBy = 'Name';
        break;
        default:

        break;
      }
      this.loading = false;
  }
}
