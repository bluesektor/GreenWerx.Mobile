import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ProfileService } from '../../services/user/profile.service';
import { ServiceResult} from '../../models/serviceresult';
import { Events } from '@ionic/angular';
import { ObjectFunctions } from '../../common/object.functions';
import { SessionService} from '../../services/session.service';
import { Filter, Screen } from '../../models/index';
import { environment } from '../../../environments/environment';
 import {PostService } from '../../services/documents/post.service';
import {FilterService} from '../../services/filter.service';
import {Api} from '../../services/api/api';
import { HttpClient } from '@angular/common/http';
// todo events  =-> profiles and hosts ==> posts
@Component({
  selector: 'page-community-filter',
  templateUrl: 'community-filter.html',
  styleUrls: ['./community-filter.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CommunityFilterPage implements AfterViewInit {

  loading = false;

  public sortByScreens:  Screen[] = [];

  constructor(
    private filterService: FilterService,
    private http: HttpClient,
    public modalCtrl: ModalController,
    public profileService: ProfileService,
    public postService: PostService,
    private sessionService: SessionService,
    public messages: Events  ) {

      }

    public type: string;

  applyFilters() {
    console.log('community-filter.ts applyFilters');
   // this.filterService.resetFilter(this.type);
    const index = this.filterService.getFilterIndex(this.type);
    if (index < 0) {
      console.log('community-filter.ts applyFilters NO FILTER FOUND');
      return;
    }
    this.filterService.Filters[index].StartIndex = 0;
    let screens = null;
    switch ( this.type) {
        case 'PROFILE':
             screens =  this.profileService.AvailableScreens.filter( c => c.Selected === true).map(function(c) {
                console.log('community-filter.ts applyFilters this.profileService.AvailableScreens.filter:', c);
                return c;
                });
        break;
        case 'POST':
            screens = this.postService.AvailableScreens.filter( c => c.Selected === true).map(function(c) {
                console.log('community-filter.ts applyFilters this.postService.AvailableScreens.filter:', c);
                return c;
            });
        break;
      }
      this.filterService.Filters[index].PageSize = 50;
      this.filterService.Filters[index].Page = 1;
      this.filterService.Filters[index].Screens = screens;
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
    console.log('A. community-filter.ts initializeView');
    this.loading = true;
    let sortBy =  'Name';
    let sortDir = 'ASC';

    const index = this.filterService.getFilterIndex(this.type);
    if (index >= 0) {
      console.log('C community-filter.ts initializeView this.type:', this.type);
      switch ( this.type) {
        case 'PROFILE':
            sortBy = 'distance'; // set default sort by for the type. if its different in the service it will be updated below.
            this.filterService.Filters[index].Screens.forEach(screen => {    // loop through selected screens
            const idx = this.profileService.AvailableScreens.findIndex( asc => asc.Caption.toLowerCase() === screen.Caption.toLowerCase() );
            if (idx < 0 ) { return; }
            // find the selected in the available and set the Value field in available to selected
               this.profileService.AvailableScreens[idx].Value =   screen.Value;
           });

        break;
        case 'POST':
              sortBy = 'PublishDate';
              this.filterService.Filters[index].Screens.forEach(screen => {    // loop through selected screens
            const idx = this.postService.AvailableScreens.findIndex( asc => asc.Caption.toLowerCase() === screen.Caption.toLowerCase() );
            if (idx < 0 ) { return; }
            // find the selected in the available and set the Value field in available to selected
               this.postService.AvailableScreens[idx].Value =   screen.Value;
           });
        break;
      }

      if (ObjectFunctions.isNullOrWhitespace( this.filterService.Filters[index].SortBy) === false) {
        sortBy =   this.filterService.Filters[index].SortBy;
        sortDir =  this.filterService.Filters[index].SortDirection;
      }


      console.log('D community-filter.ts initializeView sortBy:', sortBy);
      console.log('D community-filter.ts initializeView  this.sortByScreens:',  this.sortByScreens);
      this.sortByScreens.forEach( prop => {
          prop.Selected = false;
          if (prop.Value.toLowerCase() === sortBy.toLowerCase()) {
            prop.Selected = true;
            console.log('E. community-filter.ts initializeView sortBy selected:', sortBy);
          }
        });
        this.loading = false;
        console.log('F. community-filter.ts initializeView end');
    }
  }

  ionViewDidEnter() {
    console.log('community-filter.ts ionViewDidEnter type:',  this.type);

    switch ( this.type) {
        case 'PROFILE':
            this.sortByScreens = [];
            const sort = new Screen();
            sort.Command = 'OrderBy';
            sort.Field =  'Distance';
            sort.Selected = false;
            sort.Caption = 'Distance';
            sort.Value = 'Distance';
            this.sortByScreens.push(sort);
/* todo: this needs to be fixed on server since we would need to sort by
user.Name and not profile.name
            const sortName = new Screen();
            sortName.Command = 'OrderBy';
            sortName.Field =  'Name';
            sortName.Selected = false;
            sortName.Caption = 'Name';
            sortName.Value = 'Name';
            this.sortByScreens.push(sortName);
            */
            const sortStart = new Screen();
            sortStart.Command = 'OrderBy';
            sortStart.Field =  '';
            sortStart.Selected = false;
            sortStart.Caption = 'Random';
            sortStart.Value = 'random';
            this.sortByScreens.push(sortStart);
            this.loadProfileCategories();
        break;
        case 'POST':
            this.sortByScreens = [];

            const asort = new Screen();
            asort.Command = 'OrderBy';
            asort.Field =  'PublishDate';
            asort.Selected = false;
            asort.Caption = 'Publish Date';
            asort.Value = 'PublishDate';
            this.sortByScreens.push(asort);

            const asortName = new Screen();
            asortName.Command = 'OrderBy';
            asortName.Field =  'Name';
            asortName.Selected = false;
            asortName.Caption = 'Name';
            asortName.Value = 'Name';
            this.sortByScreens.push(asortName);

            this.loadPostCategories();
        break;
        default:

        break;
      }
  }

  isUserInrole(roleName: string): boolean {
    console.log('isUserInRole  community-filter.ts ');
    return this.sessionService.isUserInRole(roleName);
  }

  async loadPostCategories() {

    // NOTE: Name must match the property name
        // because we're going to create a filter based on the name
        // todo if there are selected screens (ProfileScreens)
        // then initialize the view to toggle them on..
        //
        const postFilter = this.filterService.getFilter('POST');
        if (postFilter.Screens !== undefined && postFilter.Screens.length > 0) {
          console.log('community-filter.ts cached screens  this.postService.AvailableScreens:',  this.postService.AvailableScreens);

          this.initializeView();
        } else {
          console.log('community-filter.ts loadPostCategories');

          this.loading = true;
         await this.http.get( Api.url + 'Content/filters/posts.web.json').subscribe(res => {
           if (res) {
             console.log('community-filter.ts loadPostCategories res:', res);
             this.postService.AvailableScreens = [];
             this.postService.Categories = [];

             if (!Array.isArray(res)) {
               console.log('community-filter.ts loadPostCategories !Array.isArray(res) returning');
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
               // "Icon" : "assets/icon/promoter-200.png"
               this.postService.AvailableScreens.push(screen);
               this.postService.Categories.push(screen.Caption);
             }
             this.postService.AvailableScreens.sort((a, b) => (a.Caption > b.Caption) ? 1 : ((b.Caption > a.Caption) ? -1 : 0));
             this.initializeView();
             this.loading = false;
           }
         }, (err)  => {
           this.messages.publish('service:err', err);
           return;
         });
        }
      }

  async loadProfileCategories() {
    const profileFilter = this.filterService.getFilter('POST');
    if (profileFilter.Screens !== undefined && profileFilter.Screens.length > 0) {
      console.log('community-filter.ts cached screens  this.profileService.AvailableScreens:',  this.profileService.AvailableScreens);
      // we want to use the cached screens so we can keep track when the user reloads this screen.
      this.initializeView();
    } else {
    console.log('community-filter.ts loadProfileCategories');


    this.http.get( Api.url + 'Content/filters/profile.web.json')
    .subscribe(res => {
      if (res) {
        console.log('community-filter.ts loadProfileCategories res:', res);
        this.profileService.AvailableScreens = [];
        this.profileService.Categories = [];

        if (!Array.isArray(res)) {
          console.log('community-filter.ts loadProfileCategories !Array.isArray(res) returning');
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
          // "Icon" : "assets/icon/promoter-200.png"
          this.profileService.AvailableScreens.push(screen);
          this.profileService.Categories.push(screen.Caption);
        }
        this.profileService.AvailableScreens.sort((a, b) => (a.Caption > b.Caption) ? 1 : ((b.Caption > a.Caption) ? -1 : 0));
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
      // todo if there are selected screens (ProfileScreens)
      // then initialize the view to toggle them on..
      //
      if (this.profileService.ProfileFilter.Screens !== undefined && this.profileService.ProfileFilter.Screens.length > 0) {
        console.log('community-filter.ts cached screens  this.profileService.AvailableScreens:',  this.profileService.AvailableScreens);

        this.initializeView();
      } else {
        console.log('community-filter.ts loadProfileCategories getProfileCategories');
        this.loading = true;
        await this.profileService.getProfileCategories().subscribe((response) => {
          console.log('community-filter.ts loadProfileCategories getProfileCategories response:', response);
          this.loading = false;
          const data = response as ServiceResult;
          if (data.Code !== 200) {
            this.messages.publish('api:err', data);
            return;
          }
          this.profileService.AvailableScreens = [];
          this.profileService.Categories = [];
          console.log('community-filter.ts data.Result:', data.Result);
          if (ObjectFunctions.isValid(data.Result) === true) {
            data.Result.forEach(name => {
              if (!name) {
                return;
              }
              console.log('community-filter.ts data.Result.foreach:', name);
               // Category matches to these screen fields
              const screen = new Screen();
              screen.Command = 'SEARCHBY';
              screen.Field = 'CATEGORY';
             //   screen.ParserType = 'sql';
              screen.Selected = false;
              screen.Caption = name;
               screen.Value = name; // 'false';
              screen.Type = 'category';
              this.profileService.AvailableScreens.push(screen);
              this.profileService.Categories.push(name); });
          }
        });
      }
      */
  }

  ngAfterViewInit() { }

  onChangeRadioGroupSortBy(event: any) {
    console.log('community-filter.ts onChangeRadioGroupSortBy event:', event.detail.value);
    const index = this.filterService.getFilterIndex(this.type);
    console.log('community-filter.ts onChangeRadioGroupSortBy index:', index);
    if (index < 0) {
      return;
    }
    this.filterService.Filters[index].SortBy = event.detail.value;
  }

  onToggleSortBy(profile: any, sortby: any) {
    if (this.loading === true ) {
      console.log('community-filter.ts onToggleSortBy  sortby loading is true, returing');
      return false;
    }
    console.log('community-filter.ts onToggleSortBy sortby:', sortby);
    const index = this.filterService.getFilterIndex(this.type);
    if (index < 0) {
      return;
    }
   this.filterService.Filters[index].SortBy = sortby.Value;
   if ( 'distance' === sortby.Value.toLowerCase() ) {
      if (!navigator.geolocation ) {
        console.log('community-filter.ts getCurrentLocation returning');
        return;
      }

      // this.processing = true;
      navigator.geolocation.getCurrentPosition((resp) => {
      console.log('community-filter.ts.ts getCurrentLocation position:', resp);
          this.sessionService.CurrentSession.Profile.Latitude = resp.coords.latitude.toString();
          this.sessionService.CurrentSession.Profile.Longitude = resp.coords.longitude.toString();
          this.filterService.Filters[index].Latitude = resp.coords.latitude;
          this.filterService.Filters[index].Longitude = resp.coords.longitude;
        });
    }
  }

  radioBlur() {
    console.log('community-filter.ts radioBlur ');
  }

  radioFocus() {
    console.log('community-filter.ts radioFocus ');
  }
}
