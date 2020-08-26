import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  Input,
  SimpleChanges,
  OnChanges,
  EventEmitter,
  Output
} from '@angular/core';
import {
  AlertController,
  LoadingController,
  ModalController
} from '@ionic/angular';
import { Refresher } from 'ionic-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/events/event.service';
import { AccountService } from '../../../services/user/account.service';
import { ServiceResult } from '../../../models/serviceresult';
// import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Events } from '@ionic/angular';
import { LocalSettings } from '../../../services/settings/local.settings';
import { AttributesService } from '../../../services/common/attributes.service';
import { Attribute } from '../../../models/attribute';
import { ObjectFunctions } from '../../../common/object.functions';

import {
  Filter,
  Screen,
  Event,
  EventGroup,
  EventLocation
} from '../../../models/index';
import { SessionService } from '../../../services/session.service';
import { PostService } from '../../../services/documents/post.service';
import { FavoritesService } from '../../../services/common/favorites.service';
import { Favorite } from '../../../models/favorite';
import { Node } from '../../../models/node';
import { ProfileService } from '../../../services/user/profile.service';
import { ProfileFunctions } from '../../../common/profile.functions';
import { ProfileUI } from '../../../models/UI/profile.ui';
import { UserService } from '../../../services/user/user.service';
import { IonInfiniteScroll, IonVirtualScroll } from '@ionic/angular';
import { ConsoleColors } from '../../../common/console';
import { PostDialog } from '../../../components/dialogs/post/post.dialog';
import { FilterService } from '../../../services/filter.service';
import { CachedItems } from '../../../services/cached.items';
import {GetColorPipe} from '../../../common/pipes/getcolor.pipe';
// import { EventEmitter } from 'protractor';
// http://www.zombieipsum.com/ style on this page is cool
@Component({
  selector: 'app-community-lists',
  templateUrl: './community.page.lists.component.html',
  styleUrls: ['./community.page.lists.component.scss']
})
export class CommunityPageListsComponent implements OnInit, OnChanges {

  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll, {static: false}) virtualScroll: IonVirtualScroll;
  infinitListEvent: any;

  // @Input() listItems: any[] = [];
  @Input() segment = 'all';
  @Input() queryText = '';
  @ViewChild('refresherRef', { static: false }) refresherRef: Refresher;
  bottomSpacerAdded = false;
  itemCount = 0; // total # of items in query.
  @Output() listUpdate = new EventEmitter();

  pageSize = 50; // number of items to load

  fabIcon = 'calendar';
  viewType = 'POST';
  isLoggedIn = false;
  noDataMessage = '';
  isLoading = false;
  isAdmin = false;
  showDistance = false;

  constructor(
    public filterService: FilterService,
    public cache: CachedItems,
    public alertCtrl: AlertController,
    public attributeService: AttributesService,
    public accountService: AccountService,
    public eventService: EventService,
    public userService: UserService,
    public loadingController: LoadingController,
    public sessionService: SessionService,
    public postService: PostService,
    public router: Router,
    public route: ActivatedRoute,
    public modalCtrl: ModalController,
    public messages: Events,
    private localSettings: LocalSettings,
    private favoritesService: FavoritesService,
    public profileService: ProfileService
    ) {
      ConsoleColors.colorLog('community.page.lists.component.ts constructor', 'info');
    }

  // Adds a couple black rows to the bottom so we can access the
  // edit, favorites tab ( the fab button in in the way).
  addBottomSpacer() {
    if (this.bottomSpacerAdded === true) {
      return;
    }

    if ( this.itemCount === 0 || this.itemCount > this.cache.communityItems.length) {
      console.log('community.page.lists.component.ts addBottomSpacer return without adding');
      return;
    }
    const blankNode = new Node();
    blankNode.Name = '';
    blankNode.UUIDType = 'blank';
    this.cache.communityItems.push(blankNode);

    const blankNode2 = new Node();
    blankNode2.Name = '';
    blankNode2.UUIDType = 'blank';
    this.cache.communityItems.push(blankNode2);
    this.bottomSpacerAdded = true;
    console.log('community.page.lists.component.ts addBottomSpacer added');
  }

  async addFavoriteItem(slidingItem: HTMLIonItemSlidingElement, item: any) {
    slidingItem.close(); // close the sliding item
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
          console.log('community.page.lists.component.ts already added.');
          return;
        }
        if (data.Code !== 200) {
          this.messages.publish('api:err', data);
          return;
        }
        this.messages.publish('api:ok', 'Favorite Added' );
      }, (err) => {
        this.messages.publish('service:err', err);
      }
    );
  }

  toBool(value: number): boolean {
    if (value > 0) {
      return true;
    }
    return false;
  }

  doRefresh(event: Refresher) {
    console.log('community.page.lists.component.ts doRefresh  updateList');
    this.cache.communityItems = [];
    this.itemCount = 0;
    this.filterService.resetFilter(this.viewType);
    this.updateList(true, this.segment, this.viewType, this.queryText);
  }

  async editItem(slidingItem: HTMLIonItemSlidingElement, item: any) {
    console.log('community.page.lists.component.ts editItem item:', item);

    const modal = await this.modalCtrl.create({
      component: PostDialog,
      componentProps: {
        post: item,
        isNew: false
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (slidingItem !== undefined) {
      slidingItem.close();
    }

    if (data === undefined || data == null) {
      return;
    }

    const newPost = data as PostDialog;
  }

  findItemIndex(UUID: string): number {
    for (let i = 0; i < this.cache.communityItems.length; i++) {
      if (this.cache.communityItems[i].UUID === UUID) {
        return i;
      }
    }
    return -1;
  }


  getColor(isActivated: boolean): string {
    // console.log('community.page.lists.component.ts getColor isActivated:', isActivated);
    if (isActivated === true) {
      return '#green';
    }
    return '#8c8c8c';
  }

  getLocationCaption(selectedLocation: EventLocation): string {
    let locationCaption = '';
    if (ObjectFunctions.isValid(selectedLocation) === false) {
      return locationCaption;
    }

    // if (ObjectFunctions.isNullOrWhitespace(selectedLocation.Postal) === false) {       locationCaption = selectedLocation.Postal;    }

    if (ObjectFunctions.isNullOrWhitespace(selectedLocation.City) === false) {
      locationCaption = selectedLocation.City;
      if (
        ObjectFunctions.isNullOrWhitespace(selectedLocation.State) === false
      ) {
        locationCaption = selectedLocation.City + ',' + selectedLocation.State;

        if (
          ObjectFunctions.isNullOrWhitespace(selectedLocation.Country) === false
        ) {
          locationCaption =
            selectedLocation.City +
            ',' +
            selectedLocation.State +
            ',' +
            selectedLocation.Country;
        }
      }
    }
    return locationCaption;
  }

  getNsfwColor(nsfw: number): string {
    if (nsfw < 0) {
      // console.log('community.page.lists.component.ts getColor nsfw:', nsfw);
      return 'grey';
    }
    if (nsfw === 0) {
      // console.log('community.page.lists.component.ts getColor nsfw:', nsfw);
      return 'green';
    }
    // console.log('community.page.lists.component.ts getColor nsfw:', nsfw);
    return 'red';
  }

  getRelationshipIcon(item: any): string {
    if (ObjectFunctions.isValid(item) === false) {
      return '';
    }
    if (ObjectFunctions.isNullOrWhitespace(item.relationshipStatus) === true) {
      return item.relationshipStatus;
    }
    console.log('community.page.lists.component.ts getRelationshipIcon category:', item);
   item.relationshipStatus = item.relationshipStatus.toUpperCase();
    const icon = '';
    switch (item.relationshipStatus) {
      case 'SINGLE':
        break;
      case 'COUPLE':
        break;
      case 'POLY':
        break;
      case 'GROUP':
        break;
    }

    return icon;
  }

  getStatusColor(status: any) {
    console.log('community.page.lists.ts getStatusColor status:', status);
    let color = 'yellow';
    switch (status) {
      case 'publish':
        color = 'green';
        break;
      case 'publishmoderate':
        color = 'red';
        break;
    }
    return color;
  }

  goToItemDetail(item: any) {
    if (item.UUID === '' || item.UUID === undefined) {
      return;
    }
    console.log('community.page.lists.component.ts goToItemDetail item:', item);
    this.router.navigateByUrl(`tabs/details/${item.UUIDType}/${item.UUID}`); //
  }

  initializeProfile(item: any): ProfileUI {
    let profileUI = new ProfileUI();
    profileUI = item;
    profileUI.AgeGender = '';
    console.log('community.page.lists.component.ts initializeProfile  item:', item);

    // item.Distance = Math.ceil( item.Distance );

    if ( ObjectFunctions.isNullOrWhitespace( profileUI.Image ) === true ) {
      profileUI.Image = '/assets/img/blankprofile.png';
      profileUI.ImageThumb = '/assets/img/blankprofile.png';
    }
    const fileExt = '.' + profileUI.Image.split('.').pop();
    profileUI.ImageThumb =  profileUI.Image.replace( fileExt, '.tmb' + fileExt);

    if (ObjectFunctions.isValid(profileUI.Verifications) === true) {
      let count = 0;
      for (let i = 0; i < profileUI.Verifications.length; i++) {
        count++;
      }
      profileUI.VerificationCaption = count.toString();
    }
    console.log('community.page.lists.component.ts initializeProfile  a profileUI.Members:' ,  profileUI.Members);
    for ( let m = 0; m <  profileUI.Members.length; m++ ) {
      const age = ProfileFunctions.getAge( profileUI.Members[m].DOB );
      console.log('community.page.lists.component.ts age:', age);
      if (ObjectFunctions.isNullOrWhitespace(age.toString()) === true || age === 0) {
        continue;
      }
      let orientation = profileUI.Members[m].Orientation;

      if (ObjectFunctions.isNullOrWhitespace(orientation) || orientation === 'null') {
        orientation = '';
      }
      profileUI.AgeGender +=  age +  ProfileFunctions.getGenderIcon( profileUI.Members[m].Gender )
                          +  ' ' + orientation +  ' ';

      console.log('community.page.lists.component.ts initializeProfile  b profileUI.Members:' ,  profileUI.Members);
      if (  profileUI.Members.length > 1 && (m + 1) < profileUI.Members.length - 1) {
        const ageNext = ProfileFunctions.getAge( profileUI.Members[m + 1].DOB );
        console.log('community.page.lists.component.ts ageNext:', ageNext);
        // so we don't get a trailing slash on next member profile if its not valid.
        if (ObjectFunctions.isNullOrWhitespace(ageNext.toString()) === false || ageNext > 17) {
          profileUI.AgeGender += ' / ';
        }

      }
      console.log('community.page.lists.component.ts initializeProfile  d item.LocationDetail:', item.LocationDetail,
          ' isValid:', ObjectFunctions.isValid( item.LocationDetail));

      if ( ObjectFunctions.isValid( item.LocationDetail) === false) {
        console.log('community.page.lists.component.ts initializeProfile  d.1 ');
        profileUI.LocationDetail = new EventLocation();

      } else {
        console.log('community.page.lists.component.ts initializeProfile  d.2 ');
        profileUI.LocationDetail  = item.LocationDetail;
        profileUI.LocationCaption = this.getLocationCaption(item.LocationDetail);
      }
      // e. only show private
    }
    console.log('community.page.lists.component.ts initializeProfile  e ');
    return profileUI;
  }

  listUpdated() {
    this.listUpdate.emit(this.itemCount.toString());
  }

  async loadBannedUsers() {
    this.filterService.resetFilter(this.viewType);
    const screen = new Screen();
    screen.Field = 'LOCKEDOUT';
   // screen.Command = 'SearchBy';
    screen.ParserType = 'sql';
    screen.Value = 'true';
    this.filterService.addScreen(this.viewType, screen);

    const bscreen = new Screen();
    bscreen.Field = 'BANNED';
    bscreen.Command = 'SearchBy';
   // screen.ParserType = 'sql';
    bscreen.Value = 'true';
    this.filterService.addScreen(this.viewType, bscreen);

    this.cache.communityItems = null;
    this.cache.communityItems = [];
    this.isLoading = true;
    this.noDataMessage = '';
    this.userService.getAllUsers(this.filterService.getFilter(this.viewType))
      .subscribe(response => {
        this.isLoading = false;
        this.noDataMessage = '';
        console.log('community.page.lists.component.ts loadBannedUsers   response:', response);
      // this.loadingControl.dismiss();
      if (ObjectFunctions.isValid(this.refresherRef) === true) {
        this.refresherRef.complete();
      }
      if (ObjectFunctions.isValid(this.infinitListEvent)) {
        // Hide Infinite List Loader on Complete
        this.infinitListEvent.target.complete(); //  event.target.complete();

      }

      const data = response as ServiceResult;
      console.log('community.page.lists.component.ts loadBannedUsers   data:', data);
      if (data.Code !== 200) {
        this.messages.publish('api:err', data);
        return;
      }
      for (let i = 0; i < data.Result.length; i++) {
        this.cache.communityItems.push(data.Result[i]);
     }
      this.itemCount = data.TotalRecordCount;
      if (this.itemCount === 0 && this.cache.communityItems.length === 0) {
        this.noDataMessage = 'No results.';
      }
      console.log('community.page.lists.component.ts loadEvents   this.cache.communityItems:', this.cache.communityItems);


      console.log('community.page.lists.component.ts loadEvents segment:', this.segment);
      this.listUpdated();

      // Re-render Virtual Scroll List After Adding New Data
      if (ObjectFunctions.isValid(this.virtualScroll) === true) {
        this.virtualScroll.checkEnd();
      }


        if (this.itemCount === 0 && this.cache.communityItems.length === 0) {
          console.log('no results b ');
          this.noDataMessage = 'No results.';
        }

         // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if ( ObjectFunctions.isValid(this.infinitListEvent) && this.cache.communityItems.length >= this.itemCount ) {
          this.infinitListEvent.target.disabled = true; // event.target.disabled = true;
       }
      this.addBottomSpacer();
      });
  }

  async loadFavorites() {
    console.log('community.page.lists.component.ts loadFavorites loadFavorites :' , this.viewType);

    this.isLoading = true;
    this.noDataMessage = '';

    await this.favoritesService.getFavorites(this.viewType, null).subscribe(sessionResponse => {
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
        console.log('community.page.lists.component.ts  loadFavorites.data.Result:', data.Result);
        if (data.Code !== 200) {
          this.messages.publish('api:err', data);
            return false;
        }

        this.itemCount = data.TotalRecordCount;
        this.listUpdated();
        if (this.itemCount === 0 && this.cache.communityItems.length === 0) {
          console.log('no results c ');
          this.noDataMessage = 'No results.';
        }
        for (let i = 0; i < data.Result.length; i++ ) {
          if (this.viewType === 'PROFILE') {
            const profileUI = this.initializeProfile( data.Result[i].Item);
            this.cache.communityItems.push(profileUI);
          } else {
            this.cache.communityItems.push( data.Result[i].Item);
          }
        }
        console.log('community.page.lists.component.ts loadFavorites this.cache.communityItems:' , this.cache.communityItems);
        if (ObjectFunctions.isValid(this.virtualScroll) === true) {
          this.virtualScroll.checkEnd();
        }

        // App logic to determine if all data is loaded
   // and disable the infinite scroll
   if ( ObjectFunctions.isValid(this.infinitListEvent) && this.cache.communityItems.length >= this.itemCount ) {
     this.infinitListEvent.target.disabled = true; // event.target.disabled = true;
  }
        this. addBottomSpacer();
    }, (err) => {
        this.isLoading = false;
        this.noDataMessage = '';
        if (ObjectFunctions.isValid(this.infinitListEvent)) {
          // Hide Infinite List Loader on Complete
          this.infinitListEvent.target.complete(); //  event.target.complete();
        }
      this.messages.publish('service:err', err);
    });
  }

  loadMoreInViewPort(event ) {
    console.log('community.page.lists.component.ts loadMoreInViewPort alpha '  );
    this.infinitListEvent  = event;
    const index = this.filterService.getFilterIndex(this.viewType);
    let filter = new Filter();
    if (index >= 0) {
      filter = this.filterService.Filters[index];
    }
    filter.PageSize = this.pageSize;
    filter.StartIndex = this.cache.communityItems.length;
    filter.PageResults = true;
    filter.Page++;
    filter.ViewType = this.viewType;
    if (index < 0) {
      this.filterService.addFilter(filter);
    } else {
      this.filterService.setFilter(filter);
    }
    console.log('10. community.page.lists.component.ts loadMoreInViewPort  updateList');
    this.updateList(false, this.segment, this.viewType, this.queryText);
  }

  loadPosts(event ) {

    console.log('community.page.lists.component.ts  loadPosts this.queryText:', this.queryText);
    this.isLoading = true;
    this.noDataMessage = '';
    let svc = null;
    // the search in posts is different than other searches because
    // we display posts in the list, but the user name is in the users table
    // which is what we want to search by
    if (
      ObjectFunctions.isNullOrWhitespace(this.queryText) === false &&
      this.queryText.length > 0
    ) {
      // tslint:disable-next-line:max-line-length
      svc = this.postService.searchUserPosts(
        this.filterService.getFilter(this.viewType)
      ); // NOTE THE SERVICE NEEDS TO BE UPDATED IN ORDER TO SEARCH BY MORE THAN THE NAME FIELD
    } else {
      const filter =   this.filterService.getFilter(this.viewType);
      console.log(         'community.page.lists.component.ts  loadPosts filter:',        filter      );
      const screen = new Screen();
      screen.Field = 'STATUS';
      screen.Command = 'SearchBy';
      screen.Operator = 'EQUAL';
      screen.Value = 'publish';
      filter.Screens.push(screen);

      if (this.isAdmin === true) {
        // if addmin add screen status = 'publishmoderate'
        const modScreen = new Screen();
        modScreen.Field = 'STATUS';
        modScreen.Command = 'SearchBy';
        modScreen.Operator = 'EQUAL';
        modScreen.Value = 'publishmoderate';
        filter.Screens.push(modScreen);
      }

      svc = this.postService.getAllPosts(filter  );
    }

    svc.subscribe(
      response => {
        console.log('community.page.lists.component.ts loadPosts response:', response);
        if (ObjectFunctions.isValid(this.refresherRef) === true) {
          this.refresherRef.complete();
        }

        if (ObjectFunctions.isValid(this.infinitListEvent)) {
          // Hide Infinite List Loader on Complete
          this.infinitListEvent.target.complete(); //  event.target.complete();
        }

        this.isLoading = false;
        this.noDataMessage = '';
        const data = response as ServiceResult;
        if (data.Code !== 200) {
          console.log('community.page.lists.component.ts loadPosts data:', data);
          this.messages.publish('api:err', data);
          return;
        }

        for (let j = 0; j < data.Result.length; j++) {
          const postUI = data.Result[j];

          console.log('community.page.lists.component.ts this.postService.getAllPosts adding postUI:', postUI);
          this.cache.communityItems.push(postUI);
        }

        // tslint:disable-next-line:max-line-length
        console.log('community.page.lists.component.ts this.postService.getAllPosts  this.cache.communityItems:', this.cache.communityItems);
        this.itemCount = data.TotalRecordCount;

        console.log('community.page.lists.component.ts this.postService.getAllPosts  this.itemCount:', this.itemCount);
        this.listUpdated();

        // Re-render Virtual Scroll List After Adding New Data
        if (ObjectFunctions.isValid(this.virtualScroll) === true) {
          this.virtualScroll.checkEnd();
        }

        if (
          this.itemCount === 0 &&
          this.queryText !== ''
          //    && this.cache.communityItems.length === 0
        ) {
          console.log('no results e ');
          this.noDataMessage = 'No results.';
        }

        // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if (
          ObjectFunctions.isValid(this.infinitListEvent) &&
          this.cache.communityItems.length >= this.itemCount
        ) {
          this.infinitListEvent.target.disabled = true; // event.target.disabled = true;
        }
        this.addBottomSpacer();
      },
      err => {
        console.log('community.page.lists.component.ts loadPosts err:', err);
        this.isLoading = false;
        this.noDataMessage = '';
        if (ObjectFunctions.isValid(this.refresherRef) === true) {
          this.refresherRef.complete();
        }
        this.messages.publish('service:err', err);
      }
    );
  }

  loadProfiles( ) {

    console.log('community.page.lists.component.ts  loadProfiles this.queryText:', this.queryText);
    this.isLoading = true;
    this.noDataMessage = 'loading...';
    let svc = null;
       // the search in profiles is different than other searches because
          // we display profiles in the list, but the user name is in the users table
          // which is what we want to search by
        if ( this.queryText.length > 0) {
            svc =  this.profileService.searchUserProfiles(this.filterService.getFilter(this.viewType));
        } else {
          const profileFilter = this.filterService.getFilter(this.viewType);
          console.log('community.page.lists.component.ts loadProfiles profileFilter:', profileFilter);
          svc =  this.profileService.getAllProfiles(this.filterService.getFilter(this.viewType));
        }

    svc.subscribe((response) => {
        if (ObjectFunctions.isValid(this.refresherRef) === true) {
          this.refresherRef.complete();
        }

        if (ObjectFunctions.isValid(this.infinitListEvent)) {
          // Hide Infinite List Loader on Complete
          this.infinitListEvent.target.complete(); //  event.target.complete();

        }

        this.isLoading = false;
        this.noDataMessage = '';
        const data = response as ServiceResult;
        console.log('community.page.lists.component.ts loadProfiles response:', response);

        if (data.Code !== 200) {
          if (data.Code === 401) {
            console.log('community.page.lists.component.ts loadProfiles 401 not authorized data:', data);
            // this.messages.publish('user:logout');
            return false;
          }

          this.messages.publish('api:err', data);
          return;
        }
        console.log('community.page.lists.component.ts loadProfiles data.Result:', data.Result);

        for (let j = 0; j < data.Result.length; j++ ) {

          const profileUI = this.initializeProfile( data.Result[j]);

          console.log('community.page.lists.component.ts this.profileService.getAllProfiles adding profileUI:', profileUI);
          this.cache.communityItems.push(profileUI);
        }

        // tslint:disable-next-line:max-line-length
        console.log('community.page.lists.component.ts this.profileService.getAllProfiles  this.cache.communityItems:', this.cache.communityItems);
        this.itemCount = data.TotalRecordCount;

        console.log('community.page.lists.component.ts this.profileService.getAllProfiles  this.itemCount:', this.itemCount);
        this.listUpdated();

        // Re-render Virtual Scroll List After Adding New Data
        if (ObjectFunctions.isValid(this.virtualScroll) === true) {
          this.virtualScroll.checkEnd();
        }


        if (this.itemCount === 0  && this.cache.communityItems.length === 0) {
          if ( this.sessionService.validSession() === true) {
            console.log('no results d ');
            this.noDataMessage = 'No results.';
          } else {
            this.noDataMessage = 'No public profiles available. You must login to view member profiles.';
          }
        }

         // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if ( ObjectFunctions.isValid(this.infinitListEvent) && this.cache.communityItems.length >= this.itemCount ) {
          this.infinitListEvent.target.disabled = true; // event.target.disabled = true;
       }

        this. addBottomSpacer();
      }, (err) => {
        this.isLoading = false;
        this.noDataMessage = '';
        if ( ObjectFunctions.isValid(this.refresherRef) === true) {
         this.refresherRef.complete();
        }
         this.messages.publish('service:err', err);
      });


  }

  public ngOnChanges(changes: SimpleChanges) {
    console.log('community.page.lists.component.ts ngOnChanges  changes:', changes);

    if ('queryText' in changes) {
      this.searchEvents();
    }
  }

  ngOnInit() {
    this.isLoggedIn = this.sessionService.validSession();
    if (this.isLoggedIn === true) {
      if (
        this.sessionService.isUserInRole('OWNER') ||
        this.sessionService.isUserInRole('ADMIN')
      ) {
        this.isAdmin = true;
      }
    }
  }

  async removeFavoriteItem(slidingItem: HTMLIonItemSlidingElement, item: any, title: string) {

    const alert = await this.alertCtrl.create({
      header: title,
      message: 'Would you like to remove this item from your favorites?',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            // they clicked the cancel button, do not remove the item
            // close the sliding item and hide the option buttons
            slidingItem.close();
          }
        },
        {
          text: 'Remove',
          handler: () => {
            // close the sliding item
            if (slidingItem !== undefined) {
              slidingItem.close();
            }

            this.favoritesService.removeFavorite(item.UUID).subscribe(
              response => {
                const data = response as ServiceResult;
                if (data.Code !== 200) {
                  this.messages.publish('api:err', data);
                  return;
                }
                console.log(
                  'community.page.lists.component.ts removeFavoriteItem  updateList'
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

  async removeUserBan(slidingItem: HTMLIonItemSlidingElement, item: any) {
    this.userService.banUser(item.UUID, false).subscribe(
      response => {
        if (ObjectFunctions.isValid(this.refresherRef) === true) {
          this.refresherRef.complete();
        }
        const data = response as ServiceResult;
        if (data.Code !== 200) {
          this.messages.publish('api:err', data);
          return;
        }
        for (let i = 0; i < this.cache.communityItems.length; i++) {
          if (this.cache.communityItems[i].UUID === item.UUID) {
            this.cache.communityItems.splice(i, 1);
          }
        }
      },
      err => {
        this.isLoading = false;
        this.noDataMessage = '';
        // this.loadingControl.dismiss();
        if (ObjectFunctions.isValid(this.refresherRef) === true) {
          this.refresherRef.complete();
        }
        this.messages.publish('service:err', err);
      }
    );
  }

  async searchEvents() {
    this.cache.communityItems = [];
    this.itemCount = 0;
    this.filterService.resetFilter(this.viewType);
    if (!this.queryText || this.queryText === '') {
      return;
    }
    console.log(
      'community.page.lists.component.ts searchEvents  this.queryText:',
      this.queryText
    );
    const screen = new Screen();
    screen.Field = 'NAME';
    screen.Command = 'SearchBy';
    screen.Operator = 'CONTAINS';
    screen.ParserType = 'sql';
    screen.Value = this.queryText;
    this.filterService.addScreen(this.viewType, screen);
    console.log('community.page.lists.component.ts searchEvents  updateList');
    this.updateList(true, this.segment, this.viewType, this.queryText);
  }

  async setNsfwFlag(event, item: any) {
    console.log( 'community.page.lists.component.ts setNsfwFlag event:', event   );
    console.log( 'community.page.lists.component.ts setNsfwFlag item:', item  );


    if (ObjectFunctions.isNullOrWhitespace(item.UUID) === true) {
      return;
    }
    const itemIndex = this.findItemIndex(item.UUID);

    if (itemIndex < 0 || itemIndex > this.cache.communityItems.length - 1) {
      console.log( 'community.page.lists.component.ts setNsfwFlag returing without setting'   );
      return;
    }

    // tslint:disable-next-line:max-line-length
    console.log('community.page.lists.component.ts setNsfwFlag this.cache.communityItems[itemIndex].NSFW:', this.cache.communityItems[itemIndex].NSFW);

    let value = '0';
    if (item.NSFW === 0) {
       value = '99';
    }

    const tmpStatus = this.cache.communityItems[itemIndex].Status;
    this.cache.communityItems[itemIndex].Status = 'flagging';
    const svc = this.userService.flagItem( item.UUIDType
                                            , item.UUID
                                            , item.AccountUUID
                                            , 'NSFW'
                                            , value); // to set safe for x. set the nsfw field to 0.

       await svc.subscribe(data => {
         const response = data as ServiceResult;
         this.cache.communityItems[itemIndex].Status = tmpStatus;
         if (response.Code !== 200) {
             this.messages.publish('api:err' ,  response.Message);
             return false;
         }
         console.log('community.page.lists.component.ts setNsfwFlag response:', response);
         console.log('community.page.lists.component.ts setNsfwFlag itemIndex:', itemIndex);
         this.cache.communityItems[itemIndex].NSFW  = response.Result.NSFW;
       }, err => {
       this.cache.communityItems[itemIndex].Status = tmpStatus;

         if (err.status === 401) {
          // this.messages.publish('user:logout');
          return;
         }
         this.messages.publish('service:err' ,  err.statusText );
     });

  }

  toggleInfiniteScroll() {
    this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }

  togglePostApproval(item: any) {

      if (item.Status === 'publishmoderate' ) {
        item.Status = 'publish';
      } else {
        item.Status =  'publishmoderate';
      }

    this.postService.updatePost(item).subscribe((response) => {
      if (ObjectFunctions.isValid(this.refresherRef) === true) {
        this.refresherRef.complete();
      }
      const data = response as ServiceResult;
      if (data.Code !== 200) {
        this.messages.publish('api:err', data);
        return;
      }
      this.messages.publish('api:ok', 'Post updated');

    }, (err) => {
      this.isLoading = false;
      this.noDataMessage = '';
      // this.loadingControl.dismiss();
      if ( ObjectFunctions.isValid(this.refresherRef) === true) {
       this.refresherRef.complete();
      }
       this.messages.publish('service:err', err);
    });

  }

  async unlockUser(slidingItem: HTMLIonItemSlidingElement, item: any) {
    this.userService.lockUser(item.UUID, false).subscribe(
      response => {
        if (ObjectFunctions.isValid(this.refresherRef) === true) {
          this.refresherRef.complete();
        }
        const data = response as ServiceResult;
        if (data.Code !== 200) {
          this.messages.publish('api:err', data);
          return;
        }
        for (let i = 0; i < this.cache.communityItems.length; i++) {
          if (this.cache.communityItems[i].UUID === item.UUID) {
            this.cache.communityItems.splice(i, 1);
          }
        }
      },
      err => {
        this.isLoading = false;
        this.noDataMessage = '';
        // this.loadingControl.dismiss();
        if (ObjectFunctions.isValid(this.refresherRef) === true) {
          this.refresherRef.complete();
        }
        this.messages.publish('service:err', err);
      }
    );
  }

  public async updateList(
    resetArray: boolean,
    segment: string,
    viewType: string,
    queryText: string
  ) {
    this.showDistance = this.sessionService.isLocationSet();

    console.log('community.page.lists.component.ts updateList');
    if (resetArray === true) {
      this.cache.communityItems = [];
      this.itemCount = 0;
      // this.filterService.resetFilter(this.viewType);
      this.bottomSpacerAdded = false;
    }

    this.segment = segment;
    this.viewType = viewType;
    this.queryText = queryText; // todo could change query text by viewType i.e. eventQueryText, profilesQueryText...

    // Close any open sliding items when the listItems updates
    // if (this.listControl) {
    // this.listControl.closeSlidingItems();
    // }

    if (resetArray === true) {
      this.cache.communityItems = null;
      this.cache.communityItems = [];
      this.bottomSpacerAdded = false;
    }
    console.log(
      'community.page.lists.component.ts updateList this.viewType:',
      this.viewType
    );
    this.isLoading = true;
    this.noDataMessage = '';

    if (this.segment === 'favorites') {
      await this.loadFavorites();
      return;
    }

    switch (this.viewType) {
      case 'PROFILE':
        await this.loadProfiles();
        break;
      case 'POST':
        await this.loadPosts(null);
        break;

      // case 'ATTRIBUTE': todo depricate when working in logs.page.list
      //    await this.loadAttributes();
      //   break;
      default:
        this.loadPosts(null);
        break;
    }
  }
}
