import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation, ViewChild, Input, Host, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService} from '../../services/index';
import { EventService } from '../../services/events/event.service';
import { LocationService } from '../../services/geo/locations.service';
import { SessionService } from '../../services/session.service';
import { UserService} from '../../services/user/user.service';
import {InventoryService } from '../../services/store/inventory.service';
import { ProfileService } from '../../services/user/profile.service';
import { RoleService } from '../../services/user/roles.service';
import { Profile, Message } from '../../models';
import { Events , ModalController  } from '@ionic/angular';
import { ServiceResult } from '../../models/serviceresult';
import {Account, Event, FileEx, EventLocation, Filter, Screen, EventGroup} from '../../models/index';
import {GeoLocationComponent } from '../../components/geo/geolocation.component';
import { ObjectFunctions } from '../../common/object.functions';
import * as moment from 'moment';
import * as momentTimezone from 'moment-timezone';
import { AttributesService } from 'src/app/services/common/attributes.service';
import {Attribute} from '../../models/attribute';
import { NgxGalleryAnimation, NgxGalleryImage, NgxGalleryOptions} from 'ngx-gallery';
import { RESOURCE_CACHE_PROVIDER } from '@angular/platform-browser-dynamic';
import {SelectItem} from 'primeng/primeng';
import { AlertController } from '@ionic/angular';
import {environment} from '../../../environments/environment';
import {VerificationService} from '../../services/user/verification.service';
import {EmailService} from '../../services/messaging/email.service';
import {VerificationEntry} from '../../models/verificationentry';
import {Location} from '@angular/common';
import { FavoritesService } from '../../services/common/favorites.service';
import { Favorite } from '../../models/favorite';
import {VerifyDialog} from '../../components/dialogs/verify/verify.dialog';
import {EmailDialog} from '../../components/dialogs/email/email.dialog';
import {AffiliateLog} from '../../models/affiliatelog';
import {AffiliateService} from '../../services/common/affiliate.service';
import {Post} from '../../models/post';
import {PostService} from '../../services/documents/post.service';
import {GetLargeImagePipe} from '../../common/pipes/image.pipe';
 // import {EventModalPage} from '../../pages/admin/event-modal/event-modal'; //ADMIN
import { Api } from '../../services';
import {AttributesListsComponent} from '../../components/lists/attributes.lists/attributes.lists.component';
import {ImageWithLoadingComponent} from '../../components/image/image.loading.component';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss', '../../../assets/styles/primeng/primeng.min.css' ],
  encapsulation: ViewEncapsulation.None,
})
export class DetailsPage implements OnInit {

  uuid: string;
  type: string;
  item: any;
  isNew = false;
  // isAdmin = false;
  isAdminOrAbove = false;
  loading = false;
  editing = false;
  processingRequest  = false;
  isLoggedIn = false;
  imageVisibleIndex = -1;

  eventLocationUUID: string;
 // @ViewChild('geoLocation', {static: false}) geoLocation: GeoLocationComponent;
  @ViewChild('eventsList', {static: false}) eventsList: any;

  location: any;
  events: Event[] = [];
  eventCount = 0;
  @ViewChild('lstAttributes', {static: false}) lstAttributes: AttributesListsComponent;
   attributes: Attribute[] = [];

  // Image upload
  images:  Array<FileEx> = [];
  @Input() maxFileUpload = 1;
  picsReadOnly = false;
  imageFormData = new FormData();
  updateImage = false;
  showPrimaryImage = true;

  topImageThumb: string;
  desktopGalleryOptions: NgxGalleryOptions[] = [];
  mobileGalleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];
  showDesktopGallery = false;

  contactUser = false;
  message: Message = new Message();
  sendingMessage = false;
  messageSent = false;

  isAuthorized = true;
  errorMessage = '';
  inches: SelectItem[];

  

  authSegment = ''; // this is appended to image links so we can check on the service if the user is trying to directly access the image.

  constructor(
    private affiliateService: AffiliateService,
    private favoritesService: FavoritesService,
    public modalCtrl: ModalController,
    public router: Router,
    private route: ActivatedRoute,
    private postService: PostService,
    private cdr: ChangeDetectorRef,
    public accountService: AccountService,
    public sessionService: SessionService,
    public inventoryService: InventoryService,
    public eventService: EventService,
    public userService: UserService,
    private profileService: ProfileService,
    private rolesService: RoleService,
    private emailService: EmailService,
    public messages: Events,
    private routerLocation: Location,
    public locationService: LocationService,
    public attributesService: AttributesService,
    public alertController: AlertController,
    public verifyService: VerificationService
   // private inAppBrowser:
  ) {
    if (ObjectFunctions.isNullOrWhitespace(Api.authToken) === false) {
      console.log('details.page.ts constructor Api.authToken: ', Api.authToken);
      const segments = Api.authToken.split('.');
      this.authSegment = segments[segments.length - 1];

    }
    console.log('details.page.ts constructor this.authSegment:', this.authSegment);

    this.inches = [];
      const min = 36;
      const max = 108;
      for (let i = min; i < max; i++) {
        const ft =  Math.floor( i / 12 );
        const tmp = ( i % 12 ).toFixed(2);
        const inch =  parseInt(tmp, 10)   +  '"';
        this.inches.push({ label: ft + '\'' + inch + ' - ' + i + '"' , value: i });
      }
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

 async banUser(userUUID: string) {
  console.log('details.page.ts banUser');

    if (confirm('Are you sure you want to ban this user?' )) {
      this.loading =  true;
      await this.userService.banUser(userUUID, true).subscribe(data => {
        const response = data as ServiceResult;

        if (response.Code !== 200) {
            this.loading = false;
             this.messages.publish('api:err' ,  response.Message);
            return false;
        }
        this.messages.publish('api:ok' ,   'User is banned.');
        this.loading = false;
      }, err => {
          this.loading = false;
          this.messages.publish('service:err' , err.statusText);
      });
    }
  }

  contactPoster() {
    this.contactUser = true;
  }
 // item should be a profile object
   blockUser(item: any ) {
    console.log('details.page.ts onBlock item:', item);
    if (confirm('Are you sure you want to block this user?' )) {
      this.loading =  true;

      this.rolesService.addBlockedUser(item.UserUUID).subscribe(data => {
         // addToRole('block', '', item.UUID, item.UUIDType ).subscribe(data => {
        const response = data as ServiceResult;

        if (response.Code !== 200) {
            this.loading = false;
            this.messages.publish('api:err' ,  response.Message);
            return false;
        }
        this.item.Blocked = true;
        this.messages.publish('api:ok' ,   'User is blocked.');
        this.loading = false;
      }, err => {
          this.loading = false;
          this.messages.publish('service:err' , err.statusText);
      });
    }
  }

  editItem(slidingItem: HTMLIonItemSlidingElement, item: any) {
    console.log('editEvent item:', item);
    // todo call modal based on type

    console.log('details.page.ts editItem item:', item);
  switch ( item.UUIDType.toUpperCase() ) {
    case 'EVENT':
      this.eventEdit(slidingItem, item);
      break;
    case 'HOST':
      break;
    case 'PROFILE':
      break;
  }
  }

  async eventEdit(slidingItem: HTMLIonItemSlidingElement, item: any) {
    console.log('events.page.ts editEvent item:', item);
    /*
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
   */
  }

 async flagCurrentImage(flagType: string) {
  console.log('details.page.ts flagCurrentImage');

   console.log( 'details.page.ts flageCurrentImage this.galleryImages:', this.galleryImages );
   console.log( 'details.page.ts flageCurrentImage imgUrl:',
                  this.galleryImages[this.imageVisibleIndex].url );

  console.log( 'details.page.ts flageCurrentImage this.item.Attributes:',
                  this.item.Attributes);

    if (confirm('Are you sure you want to flag this image?' )) {
      this.loading =  true;

    let attributeUUID = '';
    let attributeIndex = -1;

   for (let i = 0; i < this.item.Attributes.length; i++) {

      if ( this.item.Attributes[i].Image === this.galleryImages[this.imageVisibleIndex].url ) {
        attributeUUID = this.item.Attributes[i].UUID;
        attributeIndex = i;
        break;
      }
    }
    if (attributeIndex < 0 ) {
      this.loading = false;
      console.log( 'details.page.ts flageCurrentImage attribute not found.');
      return;
    }


      let svc = null;
      switch (flagType) {
        case 'DELETE':
          svc = this.attributesService.deleteAttribute(attributeUUID);
        break;
        case 'NSFW':
          svc = this.userService.flagItem( this.item.Attributes[attributeIndex].UUIDType,
                                   this.item.Attributes[attributeIndex].UUID,
                                   this.item.Attributes[attributeIndex].AccountUUID,
                                   'NSFW', 'true');
        break;
      }

      await svc.subscribe(data => {
        const response = data as ServiceResult;

        if (response.Code !== 200) {
            this.loading = false;
            this.messages.publish('api:err' ,  response.Message);
            return false;
        }
        switch (flagType) {
          case 'DELETE':
            this.galleryImages.splice(this.imageVisibleIndex, 1);
            this.item.Attributes.splice(attributeIndex, 1);
          break;
          case 'NSFW':
            this.item.Attributes[attributeIndex].NSFW  = response.Result.NSFW;
          break;
        }
        this.loading = false;
      }, err => {
        this.loading = false;

        if (err.status === 401) {
          // this.messages.publish('user:logout');
          return;
        }
        this.messages.publish('service:err' ,  err.statusText );
    });


    }
  }


  getAccount(accountUUID: string) {
    this.isAuthorized = true;
    console.log('details.page.ts getAccount accountUUID:', accountUUID);

    this.accountService.getAccount(accountUUID).subscribe((response) => {
        console.log('details.page.ts getAccount response:', response);
      const data = response as ServiceResult;

      if (data.Code !== 200) {
        this.loading = false;
        if (data.Code === 401) {
          this.isAuthorized = false;
          // this.messages.publish('user:logout');
          return false;
        }

        this.messages.publish('api:err', data);
        return;
      }

      this.item = data.Result;
      this.loadAttributes();
      this.getLocation(this.item.LocationUUID, this.item.LocationType);



      if ( this.item.Image === undefined || this.item.Image === '' ||
           this.item.Image === null || this.item.Image.indexOf('blankprofile.png') !== -1  ) {
        this.item.Image = '/assets/img/blankprofile.png';
        this.showPrimaryImage = false;
      }
    });
  }

  getAge(itemDate: any): number {
    const now = moment(new Date()); // todays date

    const dob =  moment( itemDate).local();
   // var end = moment("2015-12-1"); // another date
    const duration = moment.duration(now.diff(dob));
    const years = duration.asYears().toString();
    return parseInt( years, 10 );
  }

  loadAttributes() {
    console.log('details.page.ts loadAttributes ');
    const filter = new Filter();
    filter.PageResults = false;
    const screen = new Screen();
    screen.Command = 'SEARCHBY';
    screen.Field = 'REFERENCEUUID';
    screen.Value = this.item.UUID;
    filter.Screens.push(screen);
    // select * from attributes where ReferenceType = 'account'
   // this.attributes = null;
    this.attributes = [];
    this.attributesService.getAttributes(filter ).subscribe( (response)  => {
      console.log('details.page.ts loadAttributes getAttributes response:', response);
      const data = response as ServiceResult;
        if (data.Code !== 200) {
          this.messages.publish('api:err', data);
          return;
        }
        this.attributes  = data.Result as Attribute[];
    }, (err) => {
    this.messages.publish('service:err', err);
    return;
    });
  }

  getLocation(locationUUID: string, locationType: string) {
    this.isAuthorized = true;
    console.log('details.page.ts getLocation locationUUID:', locationUUID, locationType);

    if (locationUUID === null || locationUUID === undefined || locationUUID === '') {
      this.loading = false;
      return;
    }
    this.locationService.getLocation(locationUUID, locationType ).subscribe((response) => {
      console.log('details.page.ts getLocation response:', response);
      this.loading = false;
      const data = response as ServiceResult;

      if (data.Code !== 200) {
        this.loading = false;
       // this.messages.publish('api:err', data);
        if (data.Code === 401) {
          this.isAuthorized = false;
          // this.messages.publish('user:logout');
        }
        // this.messages.publish('api:err', data);
        return;
      }
      if ( ObjectFunctions.isValid(   data.Result ) === false ) {
        this.loading = false;
        console.log('details.page.ts getLocation no location returned');
        return;
      }
      this.location = data.Result  as EventLocation;
      this.eventLocationUUID = this.location.UUID;
  //    if (this.geoLocation !== undefined || this.geoLocation !== null) {
   //   this.geoLocation.location = location;
   //   this.geoLocation.showEventLocation(location);
   //   this.loading = false;
   //   this.cdr.detectChanges();
   // } else {
      this.loading = false;
   // }


    });
  }

  getType(tmp: string): string {
    console.log('details.page.ts getType tmp', tmp);
    let res = '';
    switch (tmp) {
      case 'Account':
      case 'account':
      case 'ACCOUNT':
        res = 'ACCOUNT';
        break;
      case 'Event':
      case 'event':
      case 'EVENT':
      res = 'EVENT';
      break;
      case 'Profile':
      case 'profile':
      case 'PROFILE':
       res = 'PROFILE';
      break;
    }
   return res;
  }

  goBack() {
    console.log('details.page.ts goBack   this.routerLocation:',   this.routerLocation);

    this.routerLocation.back();
  // this.router.navigateByUrl(`tabs/store`);
  }

  goToSessionDetail(item: any) {
    console.log('details.page.ts goToSessionDetail item:', item);

    this.router.navigateByUrl(`tabs/details/${item.UUIDType}/${item.UUID}`); //
  }

  // Call this after the api call to load the item
  initializeItem() {

    console.log('details.page.ts initializeItem this.item', this.item);
        const tmp = this.item.UUIDType.toUpperCase();
        console.log('details.page.ts initializeItem type:', tmp);
      switch (tmp) {
        case 'ACCOUNT':
            this.loadAttributes();
            this.getLocation(this.item.LocationUUID, this.item.LocationType);

            if ( this.item.Image === undefined || this.item.Image === '' ||
                 this.item.Image === null || this.item.Image.indexOf('blankprofile.png') !== -1  ) {
              this.item.Image = '/assets/img/blankprofile.png';
              this.showPrimaryImage = false;
            }
          break;
        case 'EVENT':
            if ( this.item.Image === undefined || this.item.Image === '' ||
              this.item.Image === null || this.item.Image.indexOf('blankprofile.png') !== -1 ) {
              this.item.Image = '/assets/img/blankprofile.png';
              this.showPrimaryImage = false;
            }
            this.eventLocationUUID = this.item.EventLocationUUID;
          break;
        case 'PROFILE':
            if ( ObjectFunctions.isNullOrWhitespace( this.item.Image ) === true || this.item.Image.indexOf('blankprofile.png') !== -1  ) {
              this.item.Image = '/assets/img/blankprofile.png';
              this. topImageThumb = '/assets/img/blankprofile.png';
              this.showPrimaryImage = false;
            } else {
              console.log('details.page.ts initializeItem split b session.service.ts');
              const fileExt = '.' + this.item.Image.split('.').pop();
              this.topImageThumb =  this.item.Image.replace( fileExt, '.tmb' + fileExt + '.seg.' +  this.authSegment );
            }
            // add profile images to gallery
            this.galleryImages = [];
            console.log('details.page.ts loadProfile initialize galleryimages');
            for (let i = 0; i < this.item.Attributes.length; i++) {
                if ( this.item.Attributes[i] === undefined) {
                  continue;
                }
                console.log('details.page.ts initializeItem split c session.service.ts');
                const fileExt = '.' +  this.item.Attributes[i] .Image.split('.').pop();
                const imageThumb =   this.item.Attributes[i] .Image.replace( fileExt, '.tmb' + fileExt);
                this.galleryImages.push( {
                  small: imageThumb + '.seg.' +  this.authSegment ,
                  medium:  this.item.Attributes[i].Image + '.seg.' +  this.authSegment ,
                  big:  this.item.Attributes[i].Image + '.seg.' +  this.authSegment ,
                  url:  this.item.Attributes[i].Image + '.seg.' +  this.authSegment ,
                  description:  this.item.Attributes[i].Name
                });
             }
             this.imageVisibleIndex = 0;
             this.loading = false;
             console.log('details.page.ts  this.galleryImages', this.galleryImages);

             for (let p = 0; p <  this.item.Members.length; p++) {
                if ( this.inches.find(f => f.value ===  this.item.Members[p].Height ) !== undefined) {
                  this.item.Members[p].HeightLabel = this.inches.find(f => f.value ===  this.item.Members[p].Height ).label;
                }
             }
          break;
        case 'POST':
          break;
        default:
            this.loading = false;
            break;
      }
   }

 ionViewWillEnter() {

  console.log('details.page.ts ionViewWillEnter a type', this.type);

      if ( this.sessionService.isUserInRole('OWNER') || this.sessionService.isUserInRole('ADMIN' )) {
        this.isAdminOrAbove = true;
      }
      const tmp = this.type.toUpperCase();
      console.log('details.page.ts ionViewWillEnter type:', tmp);
    switch (tmp) {
      case 'ACCOUNT':
        console.log('details.page.ts ionViewWillEnter switch type', this.type);
        this.item = new Account(); // not sure if this is valid or matters..
        this.loading = true;
        this.loadAccount(this.uuid);
        const filter = new Filter();
        this.loadEvents(this.uuid, filter, true);
        break;
      case 'EVENT':
        console.log('details.page.ts ionViewWillEnter switch type', this.type);
        this.item = new Event();
        this.loadEvent();
        break;
      case 'PROFILE':
        console.log('details.page.ts ionViewWillEnter switch type', this.type);
        this.item = new Profile();
       this.loadProfile();
      break;
      case 'POST':
          console.log('details.page.ts ionViewWillEnter switch type', this.type);
        this.item = new Post();
         this.loadPost();
        break;
      default:
          this.loading = false;
          break;
    }
 }

  isDefaultSet(): boolean {
    if ( !this.images || this.images.length === 0 ) {
      return false;
    }

    for (let i = 0; i < this.images.length; i++) {
      if (this.images[i].Default === true) {
        return true;
      }
    }
    return false;
  }

 

  isNullOrWhitespace(val: string): boolean {
    return ObjectFunctions.isNullOrWhitespace(val);
  }

  loadAccount(accountUUID: string) {
    this.isAuthorized = true;
    console.log('details.page.ts getAccount accountUUID:', accountUUID);

    this.accountService.getAccount(accountUUID).subscribe((response) => {
        console.log('details.page.ts getAccount response:', response);
      const data = response as ServiceResult;

      if (data.Code !== 200) {
        this.loading = false;
        if (data.Code === 401) {
          this.isAuthorized = false;
          // this.messages.publish('user:logout');
          return false;
        }
        this.messages.publish('api:err', data);
        return;
      }
      this.item = data.Result;
      this.initializeItem();
    });
  }

 async loadEvent() {
  this.isAuthorized = true;
  await this.eventService.getEvent(this.uuid).subscribe((response) => {
    this.loading = false;
    if ( response.hasOwnProperty('Code') ) {
      this.loading = false;
      const data = response as ServiceResult;

      if (data.Code !== 200) {
        this.messages.publish('api:err', data);
        if (data.Code === 401) {
          this.isAuthorized = false;
          // this.messages.publish('user:logout');
          return false;
        }
        return;
      }
      this.item = data.Result as Event;
      this.initializeItem();
      console.log('details.page.ts this.event 1:' , this.item);
      console.log('details.page.ts this.eventLocationUUID:' , this.eventLocationUUID);

    } else { // pulled from local cache.
      this.item = response as Event;
      console.log('details.page.ts cached this.event:' , this.item);
    }
 }, (err) => {
    this.loading = false;
    this.messages.publish('service:err', err);
    return;
 });
}

  loadEvents(accountUUID: string, filter: Filter, includeTimezone: boolean ) {
    this.isAuthorized = true;
    console.log('details.page.ts loadEvents accountUUID:', accountUUID);
    // Close any open sliding items when the events updates
    if (this.eventsList) {
      this.eventsList.closeSlidingItems();
    }
    this.loading = true;
    this.events = [];
    this.eventCount = 0;
    // Screen by clients time and timezone.
    // If no timezone all event will be returned.
    if (includeTimezone === true) {
      filter.TimeZone =  momentTimezone.tz.guess();
    }

    // NOTE: in the service set the DefaultEvent value in web.config to empty to pull main events.
     this.eventService.getHostEvents(accountUUID, filter).subscribe((response) => {
      this.loading = false;
      const data = response as ServiceResult;

      if (data.Code !== 200) {
        this.loading = false;
        if (data.Code === 401) {
          this.isAuthorized = false;
          // this.messages.publish('user:logout');
          return false;
        }
        this.messages.publish('api:err', data);
        return;
      }
      this.events = data.Result;
      this.eventCount = this.events.length;
      console.log('EVENTS.TS getEvents   this.eventCount:', this.eventCount);

    }, (err) => {
       this.messages.publish('service:err', err);
    });
  }

  async loadPost() {
    await this.postService.getCachedPost(this.uuid).subscribe((response) => {
      this.loading = false;
      if ( response.hasOwnProperty('Code') ) {
        this.loading = false;
        const data = response as ServiceResult;

        if (data.Code !== 200) {
          this.messages.publish('api:err', data);
          if (data.Code === 401) {
            this.isAuthorized = false;
            // this.messages.publish('user:logout');
            return false;
          }
          return;
        }
        this.item = data.Result as Post;
       
        this.initializeItem();
        console.log('details.page.ts post 1:' , this.item);

      } else { // pulled from local cache.
        this.item = response as Post;
        this.initializeItem();
        console.log('details.page.ts cached post:' , this.item);
      }
   }, (err) => {
      this.loading = false;
      this.messages.publish('service:err', err);
      return;
   });
  }

  async loadProfile() {
     this.isAuthorized = true;
     this.errorMessage = '';
      this.loading = true;
      await this.profileService.getProfileBy(this.uuid).subscribe(data => {
          let response = data as ServiceResult;
          console.log('details.page.ts profileService.getProfile response:', response);

          if (response.Code !== 200) {
            // try getting by username
            this.profileService.getUserProfile(this.uuid).subscribe(userProfileData => {
              response = userProfileData as ServiceResult;
              console.log('details.page.ts profileService.getUserProfile response:', response);
              if (response.Code !== 200) {
                this.loading = false;
                this.messages.publish('api:err' ,  response.Message );
                return false;
              }
              this.loadProfileFromResponse(response);
            });
          } else { // loaded from getProfileBy
            this.loadProfileFromResponse(response);
            console.log('details.page.ts this.selectedProfile:', this.item);
          }
      }, err => {
          this.loading = false;

          if (err.status === 401) {
            // this.messages.publish('user:logout');
            return;
          }
          this.messages.publish('service:err' ,  err.statusText );
      });
  }

  loadProfileFromResponse(response: ServiceResult) {
    this.item = response.Result as Profile;
    if (this.item.Blocked === true) {
      this.errorMessage =  'Your are blocked from viewing this profile.';
      this.messages.publish('api:err' , this.errorMessage);
      this.isAuthorized = false;
      this.item = undefined;
      this.loading = false;
      return;
    }
    if ( this.sessionService.validSession() === false &&
        this.item.ShowPublic === false) {
          this.errorMessage = 'This profile is set to private.';
          this.messages.publish('api:err' , this.errorMessage );
          this.isAuthorized = false;
        this.item = undefined;
        this.loading = false;
          return;
    }
     // this.attributes = response.Result.Attributes;
    this.initializeItem();
  }

  ngOnInit() {
    this.loading = true;
    const screenHeight = window.innerHeight;
    const screenWidth = window.innerWidth;
    console.log('details.page.ts ngOnInit screenHeight:', screenHeight);
    console.log('details.page.ts ngOnInit screenWidth:', screenWidth);
    if (screenWidth < 768) {
      this.showDesktopGallery = false;
    } else {
      this.showDesktopGallery = true;
    }
    this.desktopGalleryOptions = [
      { 'imageDescription': true },
      {
       // width: '50%',
        height: '500px',
        thumbnailsColumns: 4,
        thumbnailsPercent: 20 }
    ];

     this.mobileGalleryOptions = [
      { 'imageDescription': true },
      {
        width: '100%',
        thumbnailsColumns: 4 }
    ];

    if (this.sessionService.validSession() === true) {
      this.isLoggedIn = true;
    }

    const detail =  this.route.snapshot.paramMap.get('object');

    if (ObjectFunctions.isValid(detail) === true) {

      this.item = detail;
      this.initializeItem();
      console.log('details.page.ts ngOnInit detail', detail );
    } else {
      console.log('details.page.ts  ngOnInit this.route.snapshot.paramMap:', this.route.snapshot.paramMap);
      this.uuid =  this.route.snapshot.paramMap.get('uuid');
      const tmp =  this.route.snapshot.paramMap.get('type');
      console.log('details.page.ts  ngOnInit tmp:', tmp);
      if (tmp !== null && tmp !== undefined ) {
        this.type = tmp.toUpperCase();
      }
      console.log('details.page.ts ngOnInit uuid', this.uuid);
      console.log('details.page.ts ngOnInit type', this.type);
    }
  }

  onGalleryImageChange(event) {
    console.log('details.page.ts onGalleryImageChange event:', event);
    this.imageVisibleIndex = event.index;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    console.log('details.page.ts onResize');
    const height = ((event.target.innerHeight > 0) ? event.targetinnerHeight : event.target.screen.height) - 1;
    const screenWidth = (event.target.innerWidth > 0) ? event.target.innerWidth : event.target.screen.width;
    if (screenWidth < 768) {
      this.showDesktopGallery = false;
    } else {
      this.showDesktopGallery = true;
    }
  }

  async openHostSite(host: any) {
    if (host === undefined ) {
      const data = new ServiceResult();
      data.Message = 'Host does not have a url for the website.';
      this.messages.publish('api:err', data);
      console.log('host-lists.ts openHostSite url is null or empty host:', host);
      return;
    }

    let url = host.WebSite;

    if (url === undefined || url === '' ) {
      url = host.Url;
    }
    console.log('host-lists.ts openHostSite host:', host);
    console.log('host-lists.ts openHostSite url :', url );
    if (url === undefined || url === null ||  url === '' ) {
      const data = new ServiceResult();
      data.Message = 'Host does not have a url for the website.';
      this.messages.publish('api:err', data);
      console.log('host-lists.ts openHostSite url is null or empty host:', host);
      return;
    }

    const log = new AffiliateLog();
    log.UUIDType = 'AffiliateLog.Link';
    log.Name = host.UUID;
    log.NameType = host.UUIDType; // event,account, user...
    log.Link = url;
    log.AccessType = host.UUIDType;
    log.ClientUserUUID = this.sessionService.CurrentSession.UserUUID;
    log.Direction = 'outbound';

    log.CreatedBy = this.sessionService.CurrentSession.UserUUID;
    log.Referrer =  document.referrer;
    await this.affiliateService.logAffliateAccess(log).subscribe(resLogAff => {
      console.log('details.page.ts openHostSite logAffliateAccess resLogAff:', resLogAff);
    });

    console.log('details.pate.ts openHostSite url:', url);
    window.open(url, '_blank');
  //  this.inAppBrowser.create(      `${host.WebSite}`,      '_blank'    );
  }

  parseTime(eventDate: any): string {
    let hour = 0;
    let minute = '00';
    let ampm = 'pm';
    const tmp =  moment(eventDate);
    if (tmp.hour() <= 12) {
         hour =  tmp.hour();
         ampm = 'am';
    } else {
      hour = tmp.hour() - 12;
        ampm = 'pm';
    }
         console.log('datetime.component.ts parseTime  hour ', hour);
        if (tmp.minute() < 10) {
          minute = '0' + tmp.minute().toString();
        } else {
          minute =   tmp.minute().toString();
        }

        console.log('datetime.component.ts parseTime minute ', minute);

    return hour.toString() + ':' + minute + ' ' + ampm;

  }

  async showEmailDialog(item: any ) {

    console.log('details.page.ts showEmailDialog emailToUserUUID:', item.UserUUID);
    console.log('details.page.ts showEmailDialog emailFromUserUUID:', this.sessionService.CurrentSession.UserUUID);

    const modal = await this.modalCtrl.create({
      component: EmailDialog,
      cssClass: 'email-dialog',  // must go in globals.scss
      componentProps: {
        isReplyMessage: false,
        emailToUserUUID: item.UserUUID,
        emailFromUserUUID: this.sessionService.CurrentSession.UserUUID,
        subject: '',
        commnet: ''     }
    });
    await modal.present();
  }

  async showVerifyRules() {
    const alert = await this.alertController.create({
      header: 'Member Verification',
      subHeader: 'Help the community by following these rules and guidlines.',
      message: '<ul>' +
          '<li style="list-style-type: disc;">ONLY verify people you have met IN PERSON!</li>' +
          '<li style="list-style-type: disc;">You only have to meet them. Anything else is at your discretion,' +
                                              ' and is not endorsed or implied by ' + environment.domain + '.</li>' +
          '<li style="list-style-type: disc;">You understand you may lose your verifications status if ' +
                                              'the member you verify is fake or fruadulent. </li>' +
        '</ul>',
      buttons: ['OK']
    });

    await alert.present();
  }


  unBlock(item: any) {


    if (confirm('Are you sure you want to unblock this user?' )) {
      const role = this.sessionService.getRole('block', '');
      if (role === null) {
        console.log('details.page.ts unBlock role not found.');
        return;
      }

      this.loading =  true;
      this.rolesService.removeUserFromRole(role.UUID, item.UserUUID  ).subscribe(data => {
        const response = data as ServiceResult;

        if (response.Code !== 200) {
            this.loading = false;
            this.messages.publish('api:err' ,  response.Message);
            return false;
        }
        this.item.Blocked = false;
        this.messages.publish('api:ok' ,   'User is unblocked.');
        this.loading = false;
      }, err => {
          this.loading = false;
          this.messages.publish('service:err' , err.statusText);
      });
    }

  }

 async verify(profile: any) {
  console.log('details.page.ts verify profile:', profile);
   const modal = await this.modalCtrl.create({
      component: VerifyDialog,
      componentProps: {        profileAccountUUID: profile.AccountUUID,
              profileUUID: profile.UUID      }
    });
    await modal.present();

    // const { data } = await modal.onWillDismiss();


/*

    console.log('details.page.ts verify profile:', profile);

    const alert = await this.alertController.create({
      header: 'Confirm Verify Member',
      subHeader: 'Help the community by following these rules and guidlines.',
      inputs: [
        {
          name: 'confirm',

          placeholder: 'Confirm',
          value: false
        }],
      message: '<ul>' +
        '<li style="list-style-type: disc;">ONLY verify people you have met IN PERSON!</li>' +
        '<li style="list-style-type: disc;">You only have to meet them. Anything else is at your discretion,' +
                                          ' and is not endorsed or implied by ' + environment.domain + '.</li>' +
      '</ul>' +
      '<br/><strong>You understand you may lose your verifications if the member you verify is fake or fruadulent.</strong>',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('details.page.ts verify cancel verification..');
            // they clicked the cancel button, do not remove the session
            // close the sliding item and hide the option buttons
           // slidingItem.close();
          }
        },
        {
          text: 'Verify',
          handler: () => {
            console.log('details.page.ts verify verifying member..');

            const ver = new VerificationEntry();
            // ver.RecipientUUID = profile.UserUUID; // this would have to be profileMember
           console.log('details.page.ts verify verifying member  a');
            ver.RecipientProfileUUID = profile.UUID;
            console.log('details.page.ts verify verifying member  b');
            ver.RecipientAccountUUID = profile.AccountUUID;
            console.log('details.page.ts verify verifying member  c');
            ver.VerificationType = 'other member'; // = ((verificationType=inperson,photo..)
            console.log('details.page.ts verify verifying member  d');
             this.verifyService.verifyUser(ver).subscribe((response) => {
              const data = response as ServiceResult;
              if (data.Code !== 200) {
                this.messages.publish('api:err', data);
                return;
              }
              console.log('details.page.ts verify verifying member  e');
              this.messages.publish('api:ok', 'Thank you for your participation.');
            }, (err) => {
              this.messages.publish('service:err', err);
           });

          }
        }
      ]
    });
    // now present the alert on top of all other content
    await alert.present();
    */
  }

}
