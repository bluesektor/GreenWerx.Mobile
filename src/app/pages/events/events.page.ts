import { Component, OnInit, ViewChild,  ViewEncapsulation, AfterViewInit, ComponentFactoryResolver,
  ChangeDetectionStrategy,
  ViewContainerRef } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import {Api} from '../../services/api/api';
import { HttpClient } from '@angular/common/http';
import { EventsFilterPage } from '../events-filter/events-filter';
import { Filter, Screen, Event, EventGroup, EventLocation } from '../../models/index';
import { ObjectFunctions } from 'src/app/common/object.functions';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { AccountService} from '../../services/user/account.service';
import { EventService } from '../../services/events/event.service';
import { SessionService } from '../../services/session.service';
import {  Router } from '@angular/router';
import { ConsoleColors } from 'src/app/common/console';
import {FilterService} from '../../services/filter.service';
import {UiFunctions} from '../../common/uifunctions';
import { Events } from '@ionic/angular';
import * as _ from 'lodash';
import {CachedItems} from '../../services/cached.items';
import {Timer} from '../../common/timer';
import {ServiceResult} from '../../models';
import {Echo} from '../../models/echo';
@Component({
  selector: 'app-events',
  templateUrl: 'events.page.html',
  encapsulation: ViewEncapsulation.None

})
export class EventsPage implements  AfterViewInit, OnInit {
  showSearch = false;
  viewType = 'EVENT';
  pluralType = 'EVENTS';
  segment = 'all';

  @ViewChild('lstItems', {static: false}) lstItems: any;
  @ViewChild('lstAccounts', {static: false}) accountsList: any;
  @ViewChild('txtSearchMenu', {static: false}) txtSearch: any;
  hideAccounts = false;

  accountsQuery = '';
  itemCount = 0; // total # of items in query.
  queryText = '';
  ActiveColor  = 'black';
  inActiveColor  = 'white';
  echoText: string;
  echoResult: string;
  status = -1;
  loading = false;

  constructor(
    private cache: CachedItems,
    private http: HttpClient,
     public modalCtrl: ModalController,
    private componentFactoryResolver: ComponentFactoryResolver,
    public eventService: EventService,
    private events: Events,
    public sessionService: SessionService,
    private accountService: AccountService,
    private filterService: FilterService,
    public messages: Events,
    public router: Router   ) {

      ConsoleColors.colorLog('events.page.ts constructor', 'info');
    }

  addItem(type: string) {
    switch ( type ) {
      case 'EVENT':
        this.lstItems.eventAdd();
        break;
      case 'HOST':
        this.lstItems.accountAdd();
        break;
    }
  }

  getColor(isActivated: boolean): string {
     if (isActivated === true) {
       return this.ActiveColor;
     }
     return this.inActiveColor;
   }

  listUpdated(event) {
    console.log('events.page.ts listUpdated event:', event);
    this.itemCount = parseInt(event, 10);
    if (this.segment === 'favorites') {
      UiFunctions.setInnerHtml('lblFavoriteParties', 'Favorites (' + this.itemCount.toString() + ')');
      UiFunctions.setInnerHtml('lblAll',  this.pluralType);
    } else {
      UiFunctions.setInnerHtml('lblFavoriteParties', 'Favorites');
      UiFunctions.setInnerHtml('lblAll',   this.pluralType + ' (' + this.itemCount.toString() + ')');
    }
  }

  loadTypes(type: string, fab: HTMLIonFabElement) {
    this.itemCount = 0;
    this.filterService.resetFilter(this.viewType);
      let title = 'Events';
      if (type !== 'ADD' ) {
        this.viewType = type;
      }
      console.log('events.page.ts loadTypes this.viewType:', this.viewType);
      fab.close();
      switch ( type ) {
          case 'ADD':
            this.addItem(this.viewType);
            return;
          break;
          case 'EVENT':
            this.viewType = type;
            title = 'Events';
            this.pluralType = title;
            break;
          case 'HOST':
            this.viewType = type;
            title = 'Hosts';
            this.pluralType = title;
            break;
        }
        console.log('events.page.ts loadTypes this.lstItems.updateList this.viewType:', this.viewType);
        this.lstItems.updateList(true, this.segment, this.viewType, this.queryText);
  }

  ngAfterViewInit(): void {
    console.log('events.page.ts ngAfterViewInit update list');
   // const tidx = Timer.start('events.page.ts ngAfterViewInit update list');
    this.updateList(true);
   // Timer.stop(tidx);
  }

  ngOnInit() {
    console.log('events.page.ts ngOnInit');
    this.events.subscribe('content:refresh', () => {
      console.log('events.page.ts content:refresh' );
      this.updateList(true);
    });
    const tidx = Timer.start('events.page.ts ngAfterViewInit load cache');
    // initial page load, load cache for fast initial view.
     /*
    this.http.get( Api.url + 'Content/Cache/events.json').subscribe(res => {
      if (res) {
        console.log('events.page.ts  ngOnInit cache.events.json res:', res);

        if (!Array.isArray(res)) {
          console.log('events.page.ts ngOnInit returned bad data');
          return;
        }
        for (let i = 0; i < res.length; i++) {
                    this.cache.eventsItems.push(res[i]);
                  }
                // this.cache.eventsItems = res;
                console.log('events.page.ts  ngOnInit cache.events.json this.cache.eventsItems:', this.cache.eventsItems);
              }
              Timer.stop(tidx);
            }, (err)  => {
              this.events.publish('service:err', err);
              return;
            });


  ADMIN - if not logged in reroute
    if ( this.sessionService.validSession() === false) {
      this.router.navigateByUrl('/login');
      return;
    }
    */ // ADMIN

  }

  // tslint:disable-next-line:member-ordering
  onSearchData = _.debounce( function() {
    this.itemCount = 0;
    this.filterService.resetFilter(this.viewType);

    if (!this.queryText || this.queryText === '') {
        console.log('events.page.ts onSearchData updateList empty query');
        this.updateList(true);
        return;
    }
    console.log('events.page.lists.component.ts onSearchData  this.queryText:',  this.queryText);

    const screen = new Screen();
    screen.Field = 'NAME';
    screen.Command = 'SearchBy';
    screen.Operator = 'CONTAINS';
    screen.ParserType = 'sql';
    screen.Value = this.queryText;
    this.filterService.addScreen(this.viewType, screen);
    console.log('events.page.lists.component.ts onSearchData  updateList');
     this.updateList(true);
    }, 400);

  onEcho() {
    console.log('events.page.ts onEcho text:', this.echoText);
    this.loading = true;
    this.status = -1;
    const e = new Echo();
    e.StringValue = this.echoText;

    this.sessionService.echo(e).subscribe(response => {
        this.loading = false;
        console.log('events.page.ts onEcho response:', response);
 
        const data = response as ServiceResult;
        console.log('events.page.ts onEcho data:', data);
        this.echoResult = data.Message;

         if (data.Code !== 200) {
           this.status = 2;
            this.messages.publish('api:err', data);
            return false;
        }
        this.status  = 1;
        this.messages.publish('api:ok');
      }, err => {
        this.status = 2;
        this.loading = false;
        this.loading = false;
        this.loading = false;
        console.log('---------------------------------------------------------------------------------------------------events.page.ts onEcho err:', err);
       console.log('events.page.ts onEcho err:', err);
        this.echoResult = err.statusText;
       this.messages.publish('service:err', err.statusText, 4);
    });

    }

  async presentFilter() {

    const modal = await this.modalCtrl.create({
      component: EventsFilterPage,
      componentProps: {
        type: this.viewType
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    console.log('events.page.ts presentFilter EVENT sortby data:',  data);
    this.lstItems.updateList(true,  this.segment, this.viewType, this.queryText);
  }

  segmentClicked( ) {
    console.log('events.page.ts this.segment:', this.segment);
    if (this.segment === 'favorites') {
      const all = document.getElementById('lblAll');
      if (ObjectFunctions.isValid(all) === true ) {
        all.setAttribute('style', 'color:' + this.inActiveColor  + ';');
      }

      const favs = document.getElementById('btnFavorites');
      if (ObjectFunctions.isValid(favs) === true ) {
        favs.setAttribute('style', 'color:' + this.ActiveColor  + ';');
      }
    } else {
      const all = document.getElementById('lblAll');
      if (ObjectFunctions.isValid(all) === true ) {
        all.setAttribute('style', 'color:' + this.ActiveColor  + ';');
      }

      const favs = document.getElementById('btnFavorites');
      if (ObjectFunctions.isValid(favs) === true ) {
        favs.setAttribute('style', 'color:' + this.inActiveColor  + ';');
      }
      // const currentTab = document.getElementById(this.currentTab);
      // currentTab.setAttribute('style', 'background-color:' + this.inActiveBkgColor + ';color:' + this.inActiveColor  + ';');
    }
    console.log('events.page.ts segmentClicked pre-resetFilter list this.segment:', this.segment);
    this.itemCount = 0;
    this.filterService.resetFilter(this.viewType);
    console.log('events.page.ts segmentClicked pre-update list this.segment:', this.segment);
    console.log('events.page.ts segmentClicked  updateList');
     this.updateList(true);
  }

  toggleList(fabButton: HTMLIonFabButtonElement, fabList: HTMLIonFabListElement) {
    fabButton.activated = !fabButton.activated;
    fabList.activated = !fabList.activated;
  }

  toggleSearch(event) {
    this.showSearch = !this.showSearch;
   // this.listUpdated(this.itemCount);
    if (this.showSearch === true ) {
      setTimeout(() => {
        this.txtSearch.setFocus();
      }, 500);
    } else {
     // this.queryText = '';
     // this.updatelist(true);
    }
  }


   updateList(resetArray: boolean) {
      console.log('events.page.ts updateList this.viewType:', this.viewType);
      this.lstItems.updateList(resetArray, this.segment, this.viewType, this.queryText );
  }
}
