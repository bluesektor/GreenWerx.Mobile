// tslint:disable-next-line:max-line-length
import {
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  NgZone
} from '@angular/core';


import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  Events,
  IonInfiniteScroll,
  IonVirtualScroll,
  LoadingController,
  ModalController
} from '@ionic/angular';
import { Refresher } from 'ionic-angular';
import { ConsoleColors } from '../../../common/console';
import { ObjectFunctions } from '../../../common/object.functions';
import { ProfileFunctions } from '../../../common/profile.functions';
import { Favorite } from '../../../models/favorite';
import { EventLocation, Filter, Screen } from '../../../models/index';
import { Node } from '../../../models/node';
import { ServiceResult } from '../../../models/serviceresult';
import { ProfileUI } from '../../../models/UI/profile.ui';
import { FavoritesService } from '../../../services/common/favorites.service';
import { EventService } from '../../../services/events/event.service';
import { SessionService } from '../../../services/session.service';
import { LocalSettings } from '../../../services/settings/local.settings';
import { AccountService } from '../../../services/user/account.service';
import { ProfileService } from '../../../services/user/profile.service';
import { FilterService} from '../../../services/filter.service';
import {CachedItems} from '../../../services/cached.items';
import {GeoHelperFunctions} from '../../../components/geo/geo.helper.functions';
import {GetColorPipe} from '../../../common/pipes/getcolor.pipe';
import {Api} from '../../../services/api/api';
import { HttpClient } from '@angular/common/http';
import {Timer} from '../../../common/timer';
// ADMIN PAGES
// import {EventModalPage} from '../../../pages/admin/event-modal/event-modal';
// import {AccountModalPage} from '../../../pages/admin/account-modal/account-modal';
// ADMIN PAGES END

@Component({
  selector: 'app-store-page-lists',
  templateUrl: './store.page.lists.component.html',
  styleUrls: ['./store.page.lists.component.scss']
  
})
export class StorePageListsComponent implements OnInit, OnChanges {

  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll, {static: false}) virtualScroll: IonVirtualScroll;

  infinitListEvent: any;

  isAdmin = false;
  showDistance = false;
  // listItems: any;

  segment = 'all';
  queryText = '';
  viewType = 'EVENT';

  @ViewChild('refresherRef', { static: false }) refresherRef: Refresher;
  bottomSpacerAdded = false;
  itemCount = 0; // total # of items in query.
  @Output() listUpdate = new EventEmitter();
  pageSize = 50; // number of items to load
  hideEvents = false;
  fabIcon = 'calendar';

  // distance = 25;
  isLoggedIn = false;
  noDataMessage = '';
  isLoading = false;

  constructor(
    private http: HttpClient,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    public alertController: AlertController,
    public cache: CachedItems,
    public accountService: AccountService,
    public eventService: EventService,
    public loadingController: LoadingController,
    public sessionService: SessionService,
    public profileService: ProfileService,
    public router: Router,
    public route: ActivatedRoute,
    public modalCtrl: ModalController,
    public filterService: FilterService,
    public messages: Events,
    private localSettings: LocalSettings,
    private favoritesService: FavoritesService,
    public viewContainerRef: ViewContainerRef
    ) {
        this.showDistance = this.sessionService.isLocationSet();
      const self = this;
     this.router.routeReuseStrategy.shouldReuseRoute = function() {
          // tslint:disable-next-line:max-line-length
          console.log('store.page.lists.component.ts constructor  this.router.routeReuseStrategy.shouldReuseRoute this.virtualScroll:', self.virtualScroll );
          // Re-render Virtual Scroll List After Adding New Data
         if (ObjectFunctions.isValid(this.virtualScroll) === true) {
          this.virtualScroll.checkEnd();
        }
      return false;
    };
    console.log('store.page.lists.component.ts constructor');
    ConsoleColors.colorLog('store.page.lists.component.ts constructor', 'info');
  }

  public async accountAdd() {
      /* ADMIN
    console.log('Clicked to addeEvent');

    const modal = await this.modalCtrl.create({
      component: AccountModalPage
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    // todo add to list
      */
 }
 /*
public async accountEdit(item) {
    console.log('accountEdit item:', item);
    const modal = await this.modalCtrl.create({
      component: AccountModalPage,
      componentProps: {
        account: item,
        newAccount: false,
        accountUUID: item.UUID
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();
  }
*/
  // Adds a couple black rows to the bottom so we can access the
  // edit, favorites tab ( the fab button in in the way).
  addBottomSpacer() {
    if (this.bottomSpacerAdded === true) {
      return;
    }
    if ( this.itemCount === 0  || this.itemCount > this.cache.products.length
      ) {
      console.log('store.page.lists.component.ts addBottomSpacer return without adding');
      return;
    }
    const blankNode = new Node();
    blankNode.Name = '';
    blankNode.IsBlank = true;
    blankNode.UUIDType = 'blank';
    this.cache.products.push(blankNode);

    const blankNode2 = new Node();
    blankNode2.Name = '';
    blankNode2.IsBlank = true;
    blankNode2.UUIDType = 'blank';
    this.cache.products.push(blankNode2);
    this.bottomSpacerAdded = true;
    console.log('store.page.lists.component.ts addBottomSpacer added');
  }

  async addFavoriteItem(slidingItem: HTMLIonItemSlidingElement, item: any) {
    if (slidingItem !== undefined) {
      slidingItem.close(); // close the sliding item
    }
      let fav = new Favorite();
      fav = item;
      fav.AccountUUID = this.sessionService.CurrentSession.AccountUUID;
      fav.UserUUID = this.sessionService.CurrentSession.UserUUID;
      fav.CreatedBy = fav.UserUUID;
      fav.ItemType = item.UUIDType;
      fav.ItemUUID = item.UUID;
      const svc = this.favoritesService.addFavorite(fav);
      await svc.subscribe((response) => {
          const data = response as ServiceResult;
          if ( data === null || data.hasOwnProperty('Code') === false ) {
            console.log('already added.');
            return;
          }
          if (data.Code !== 200) {
            this.messages.publish('api:err', data);
            return;
          }
          this.messages.publish('api:ok', 'Favorite Added');
        }, (err) => {
          this.messages.publish('service:err', err);
      });
    }

  async deleteItem(slidingItem: HTMLIonItemSlidingElement, item: any, title: string) {
    console.log('store.page.lists.component.ts deleteItem');

     const alert = await this.alertController.create({
       header: title,
       message: 'Would you like to delete this event?',
       buttons: [
         {
           text: 'Cancel',
           handler: () => {
             // they clicked the cancel button, do not remove the session
             // close the sliding item and hide the option buttons
             slidingItem.close();
           }
         },
         {
           text: 'Remove',
           handler: () => {

             if ( ObjectFunctions.isValid( this.eventService.Dashboard  ) === true ) {
               for (let i = 0; i < this.eventService.Dashboard.Events.length; i++) {
                 console.log('store.page.lists.component.ts remove favorite searching x:', this.eventService.Dashboard.Events[i]);
                 if ( this.eventService.Dashboard.Events[i].UUID === item.UUID) {
                   this.eventService.Dashboard.Events.splice( i, 1);

                   break;
                 }
               }
             }
              // close the sliding item
              slidingItem.close();
              console.log('store.page.lists.component.ts deleteItem item.UUIDType:', item.UUIDType);
              switch (item.UUIDType.toUpperCase() ) {
                case 'ACCOUNT':
                    this.accountService.deleteAccount(item.UUID).subscribe((response) => {
                      const data = response as ServiceResult;
                      if (data.Code !== 200) {
                        this.messages.publish('api:err', data);
                        return;
                      }
                      const filter = new Filter();
                      this.updateList(true, this.segment, this.viewType, this.queryText);
                      this.messages.publish('api:ok', 'Account Removed');
                    }, (err) => {
                      this.messages.publish('service:err', err);
                   });
                  break;
                case 'EVENT':
                    this.eventService.deleteEvent(item.UUID).subscribe((response) => {
                      const data = response as ServiceResult;
                      if (data.Code !== 200) {
                        this.messages.publish('api:err', data);
                        return;
                      }
                      const filter = new Filter();
                      this.updateList(true, this.segment, this.viewType, this.queryText);
                      this.messages.publish('api:ok', 'Event Removed');
                    }, (err) => {
                      this.messages.publish('service:err', err);
                   });
                  break;

              }
           }
         }
       ]
     });
     // now present the alert on top of all other content
     await alert.present();

  }

  doRefresh(event: Refresher) {
    console.log('store.page.lists.component.ts doRefresh  updateList');
    this.itemCount = 0;
    this.filterService.resetFilter(this.viewType);
    this.updateList(true, this.segment, this.viewType, this.queryText);
  }

  editItem(slidingItem: HTMLIonItemSlidingElement, item: any) {
    console.log('editItem item:', item);
    // todo call modal based on type
    if (ObjectFunctions.isValid(slidingItem) === true) {
      slidingItem.close();
    }

    switch (item.UUIDType.toUpperCase()) {
      case 'EVENT':
        this.eventEdit(slidingItem, item);
        break;
      case 'ACCOUNT':
      case 'HOST':
        console.log('editItem item:', item);
       // this.accountEdit(item);
        break;
      case 'PROFILE':
        break;
    }
  }

    public async eventAdd() {
      /* ADMIN
      console.log('Clicked to addeEvent');

        const modal = await this.modalCtrl.create({
          component: EventModalPage
        });
        await modal.present();

        const { data } = await modal.onWillDismiss();
        // todo add to list
        */
    }

    async eventEdit(slidingItem: HTMLIonItemSlidingElement, item: any) {
      /* ADMIN
      console.log('events.page.ts editEvent item:', item);
     // this.router.navigateByUrl(`tabs/edit/${item.UUID}`);  // cant load angular/core
      // this.router.navigateByUrl(`./tabs/edit/${item.UUID}`); //can't match route
      const modal = await this.modalCtrl.create({
        component: EventModalPage ,
        componentProps: {
          eventUUID: item.UUID
        }
      });
      await modal.present();

      const { data } = await modal.onWillDismiss();
     // this.updateList(true);
       }
     */
  
      }

  goToItemDetail(item: any) {
    if (item.UUID === '' || item.UUID === undefined) {
      return;
    }
    console.log('goToItemDetail item:', item);
    this.router.navigateByUrl(`tabs/details/${item.UUIDType}/${item.UUID}`); //
  }

  listUpdated() {
   //  this.cdr.detectChanges(); // turn on change detection so list is updated
    this.listUpdate.emit(this.itemCount.toString());
  }

  async loadEvents() {
      console.log('store.page.lists.component.ts loadEvents    sessionService.CurrentSession :', this.sessionService.CurrentSession );
      const tidx = Timer.start('store.page.lists.component.ts loadEvents');
      const filter = this.filterService.getFilter(this.viewType);
    //  if (   this.isAdmin === true) {
     //   filter.IncludePrivate = true;
     // }
      console.log('store.page.lists.component.ts loadEvents filter :', filter);
      this.isLoading = true;

      this.noDataMessage = '';

      await this.eventService.getEvents(filter)
        .subscribe(response => {

          this.noDataMessage = '';
          console.log('store.page.lists.component.ts loadEvents   response:', response);
        if (ObjectFunctions.isValid(this.refresherRef) === true) {
          this.refresherRef.complete();
        }
        if (ObjectFunctions.isValid(this.infinitListEvent)) {
          // Hide Infinite List Loader on Complete
          this.infinitListEvent.target.complete(); //  event.target.complete();
        }

        const data = response as ServiceResult;
        console.log('store.page.lists.component.ts loadEvents   data:', data);
        if (data.Code !== 200) {
          this.isLoading = false;
          this.messages.publish('api:err', data);
          return;
        }
        this.itemCount = data.TotalRecordCount;

        const userLocation = null;

        for ( let i = 0; i < data.Result.length; i++) {
          this.cache.products.push(data.Result[i]);
        }
      // this.cache.products = this.cache.products.concat(data.Result); // optimization_change

       console.log('store.page.lists.component.ts loadEvents   this.cache.products:', this.cache.products);

       console.log('storepage.TS loadEvents test distance this.sessionService.CurrentSession.Profile.:' ,
       this.sessionService.CurrentSession.Profile);

        // Re-render Virtual Scroll List After Adding New Data
        if (ObjectFunctions.isValid(this.virtualScroll) === true) {
          this.virtualScroll.checkEnd();
        }

        //  this.itemCount = data.TotalRecordCount;
        this.listUpdated();
        if (this.itemCount === 0) {
          this.noDataMessage = 'No results.';
        }
        console.log('storepage.TS loadEvents    this.cache.products:',  this.cache.products);

           // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (
          ObjectFunctions.isValid(this.infinitListEvent) &&
          this.cache.products.length >= this.itemCount
        ) {
          this.infinitListEvent.target.disabled = true; // event.target.disabled = true;
        }
        console.log('listItems.ts loadEvents segment:', this.segment);
        this.addBottomSpacer();
        Timer.stop(tidx);
        this.isLoading = false;
      },
      err => {
        this.isLoading = false;
        this.noDataMessage = '';
        console.log('storepage.TS loadEvents  err:', err);

        if (ObjectFunctions.isValid(this.refresherRef) === true) {
          this.refresherRef.complete();
        }
        if (ObjectFunctions.isValid(this.infinitListEvent)) {
          // Hide Infinite List Loader on Complete
          this.infinitListEvent.target.complete(); //  event.target.complete();
        }

        this.messages.publish('service:err', err);
      }
    );
  }

  async loadFavorites() {
    console.log('store.page.lists.component.ts onLogin loadFavorites :');
    this.cache.products = [];
    let type = this.viewType;
    this.isLoading = true;
    this.noDataMessage = '';
    if (this.viewType === 'HOST') {
      type = 'ACCOUNT';
    }

    this.favoritesService.getFavorites(type, null).subscribe(sessionResponse => {
      // this.loadingControl.dismiss();
      this.isLoading = false;
      this.noDataMessage = '';
      if (ObjectFunctions.isValid(this.refresherRef) === true) {
        this.refresherRef.complete();
      }
      if (ObjectFunctions.isValid(this.infinitListEvent)) {
        // Hide Infinite List Loader on Complete
        this.infinitListEvent.target.complete(); //  event.target.complete();
      }
      const data = sessionResponse as ServiceResult;
      console.log('store.page.lists.component.ts  loadFavorites.data :', data);
      if (data.Code !== 200) {
        this.messages.publish('api:err', data);
        return false;
      }
      this.itemCount = data.TotalRecordCount;
      if (this.itemCount === 0) {
        this.noDataMessage = 'No results.';
      }
      for (let i = 0; i < data.Result.length; i++) {
        data.Result[i].IsBlank = false;
        this.cache.products.push(data.Result[i].Item);
      }
      // this.cache.products = this.cache.products.concat(data.Result);
      console.log('store.page.lists.component.ts loadFavorites this.events:', this.cache.products);
      // Re-render Virtual Scroll List After Adding New Data
      if (ObjectFunctions.isValid(this.virtualScroll) === true) {
        this.virtualScroll.checkEnd();
      }
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (ObjectFunctions.isValid(this.infinitListEvent) &&
        this.cache.products.length >= this.itemCount) {
        this.infinitListEvent.target.disabled = true; // event.target.disabled = true;
      }
      this.listUpdated();
      this.addBottomSpacer();
    }, err => {
      this.isLoading = false;
      this.noDataMessage = '';
      if (ObjectFunctions.isValid(this.infinitListEvent)) {
        // Hide Infinite List Loader on Complete
        this.infinitListEvent.target.complete(); //  event.target.complete();
      }
      this.messages.publish('service:err', err);
    });
  }

  async loadVendors() {
    console.log('store.page.lists.component.ts loadVendors    sessionService.CurrentSession :', this.sessionService.CurrentSession );
    const tidx = Timer.start('store.page.lists.component.ts loadEvents');
    const filter = this.filterService.getFilter(this.viewType);
  //  if (   this.isAdmin === true) {
   //   filter.IncludePrivate = true;
   // }

    console.log('store.page.lists.component.ts loadVendors filter :', filter);
    this.isLoading = true;
    this.noDataMessage = '';
    await this.accountService.getAllAccounts(filter).subscribe(response => {
        this.noDataMessage = '';
        console.log('store.page.lists.component.ts loadVendors   response:', response);
      if (ObjectFunctions.isValid(this.refresherRef) === true) {
        this.refresherRef.complete();
      }
      if (ObjectFunctions.isValid(this.infinitListEvent)) {
        // Hide Infinite List Loader on Complete
        this.infinitListEvent.target.complete(); //  event.target.complete();
      }

        const data = response as ServiceResult;
      console.log('store.page.lists.component.ts loadVendors   data:', data);
        if (data.Code !== 200) {
        this.isLoading = false;
          this.messages.publish('api:err', data);
          return;
        }
      this.itemCount = data.TotalRecordCount;

      const userLocation = null;

      for ( let i = 0; i < data.Result.length; i++) {
        this.cache.products.push(data.Result[i]);
      }
    // this.cache.products = this.cache.products.concat(data.Result); // optimization_change
      console.log('host-list.ts this.accountService.getAllAccounts   this.cache.products:',  this.cache.products   );
     // tslint:disable-next-line:max-line-length
     console.log('storepage.TS loadEvents test distance this.sessionService.CurrentSession.Profile.:' , this.sessionService.CurrentSession.Profile);
      // Re-render Virtual Scroll List After Adding New Data
      if (ObjectFunctions.isValid(this.virtualScroll) === true) {
        this.virtualScroll.checkEnd();
      }
      //  this.itemCount = data.TotalRecordCount;
      this.listUpdated();
      if (this.itemCount === 0) {
        this.noDataMessage = 'No results.';
      }
      console.log('storepage.TS loadVendors    this.cache.products:',  this.cache.products);
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if (
        ObjectFunctions.isValid(this.infinitListEvent) &&
        this.cache.products.length >= this.itemCount
      ) {
        this.infinitListEvent.target.disabled = true; // event.target.disabled = true;
      }
      console.log('listItems.ts loadVendors segment:', this.segment);
      this.addBottomSpacer();
      Timer.stop(tidx);
      this.isLoading = false;
    },
    err => {
      this.isLoading = false;
      this.noDataMessage = '';
      console.log('storepage.TS loadVendors  err:', err);

      if (ObjectFunctions.isValid(this.refresherRef) === true) {
        this.refresherRef.complete();
      }
      if (ObjectFunctions.isValid(this.infinitListEvent)) {
        // Hide Infinite List Loader on Complete
        this.infinitListEvent.target.complete(); //  event.target.complete();
      }

      this.messages.publish('service:err', err);
    }
  );
}


  loadMoreInViewPort(event: any) {
    console.log('posts.component.ts loadMoreInViewPort alpha ');
    this.infinitListEvent = event;
    const index = this.filterService.getFilterIndex(this.viewType);
    let filter = new Filter();
    if (index >= 0) {
      filter = this.filterService.Filters[index];
    }
    filter.PageSize = this.pageSize;
    filter.StartIndex = this.cache.products.length;
    filter.PageResults = true;
    filter.Page++;
    filter.ViewType = this.viewType;
    if (index < 0) {
      this.filterService.addFilter(filter);
    } else {
      this.filterService.setFilter(filter);
    }

        console.log('10. store.page.lists.component.ts loadMoreInViewPort  updateList');
        this.updateList(false, this.segment, this.viewType, this.queryText);

    }

    public ngOnChanges(changes: SimpleChanges) {
      console.log('datetime.component.ts ngOnChanges  changes:', changes);

      if ('queryText' in changes) {
        this.searchEvents();
      }
    }

  ngOnInit() {
    console.log('store.page.lists.component.ts ngOnInit started');

    this.isLoggedIn = this.sessionService.validSession();
    if (this.isLoggedIn === true) {
      if (
        this.sessionService.isUserInRole('OWNER') ||
        this.sessionService.isUserInRole('ADMIN')
      ) {
        this.isAdmin = true;
      }
    }

    console.log('store.page.lists.component.ts ngOnInit this.isLoggedIn', this.isLoggedIn);
    console.log('store.page.lists.component.ts ngOnInit this.sessionService', this.sessionService);
     // Screen by clients time and timezone.
    // If no timezone all event will be returned.
     const self = this;
    this.localSettings.getValue(LocalSettings.ViewType, 'EVENT').then(typeRes => {
      console.log('store.page.lists.component.ts localSettings res:', typeRes);
      this.viewType = typeRes;
    });
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit(): void {
    console.log('store.page.lists.component.ts ngAfterViewInit update list ');
  }

  initializeView() {
    console.log('store.page.lists.component.ts initializeView');
  }

  ionViewDidEnter() {
    console.log('store.page.lists.component.ts ionViewDidEnter');
  }

  async removeFavoriteItem(slidingItem: HTMLIonItemSlidingElement, item: any, title: string) {

    console.log('store.page.lists.component.ts removeFavoriteItem slidingItem:' ,  slidingItem);

    const alert = await this.alertController.create({
      header: title,
      message: 'Would you like to remove this item from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the item
            // close the sliding item and hide the option buttons
            if (slidingItem !== undefined) {
              slidingItem.close();
            }
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // close the sliding item
            if (slidingItem !== undefined) {
              slidingItem.close();
            }
            // this.listControl.closeSlidingItems();

            this.favoritesService.removeFavorite(item.UUID).subscribe(
              response => {
                const data = response as ServiceResult;
                if (data.Code !== 200) {
                  this.messages.publish('api:err', data);
                  return;
                }
                console.log(
                  'store.page.lists.component.ts removeFavoriteItem  updateList'
                );
                this.updateList(
                  true,
                  this.segment,
                  this.viewType,
                  this.queryText
                );
                this.messages.publish('api:ok', 'Favorite Removed');
              },
              err => {
                this.messages.publish('service:err', err, '');
              }
            );
          }
        }
      ]
    });
    // now present the alert on top of all other content
    await alert.present();
  }

  async searchEvents() {
    this.filterService.resetFilter(this.viewType);
    this.itemCount = 0;
    if (!this.queryText || this.queryText === '') {
      return;
    }
    this.cache.products = [];
    this.itemCount = 0;
    const screen = new Screen();
    screen.Field = 'NAME';
    screen.Command = 'SearchBy';
    screen.Operator = 'CONTAINS';
    //  screen.ParserType = 'sql';
    screen.Value = this.queryText;
    this.filterService.addScreen(this.viewType, screen);
    this.updateList(true, this.segment, this.viewType, this.queryText);
  }



  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  public updateList(
    resetArray: boolean,
    segment: string,
    viewType: string,
    queryText: string  ) {
      console.log('store.page.lists.component.ts updateList A this.segment:', segment); 
    this.showDistance = this.sessionService.isLocationSet();
    console.log('store.page.lists.component.ts  updateList B this.segment:', segment);
    // reset before assigning parameters. If not the filters from store filter won't work
    if (resetArray === true) {
      this.cache.products = [];
      this.itemCount = 0;
      this.bottomSpacerAdded = false;
      // this.filterService.resetFilter(viewType);
      console.log('store.page.lists.component.ts updateList C this.segment:', segment);
    }
    // Close any open sliding items when the listItems updates
    console.log('store.page.lists.component.ts updateList D this.segment:', segment);
    this.segment = segment;
    this.viewType = viewType;
    this.queryText = queryText; // todo could change query text by viewType i.e. eventQueryText, profilesQueryText...

    console.log('store.page.lists.TS updateEvents  this.viewType:', this.viewType);
    this.isLoading = true;

   // this.cdr.detach(); // detach change detection so the list doesn't flicker or keep adding one at a time

    this.noDataMessage = '';


    if (this.segment === 'favorites') {
      this.loadFavorites();
      return;
    }

    switch (this.viewType) {
      case 'EVENT':
        this.loadEvents();
        break;
      case 'ACCOUNT':
      case 'HOST':
        this.loadVendors();
        break;
      default:
        this.loadEvents();
        break;
    }
  }
}
