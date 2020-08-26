import {
    Component, OnInit,
    ViewChild, ViewEncapsulation,
    Input, SimpleChanges,
    OnChanges, EventEmitter, Output
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
  import { Filter, Screen } from '../../../models/index';
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
  import {SelectItem} from 'primeng/primeng';
  import {CommonFunctions} from '../../../common/common.functions';
  // import { EventEmitter } from 'protractor';
  // http://www.zombieipsum.com/ style on this page is cool
  @Component({
    selector: 'attributes-list',
    templateUrl: './attributes.lists.component.html',
    styleUrls: ['./attributes.lists.component.scss']
  })
  export class AttributesListsComponent implements OnInit {

    @Input() subTypes: SelectItem[] = []; // note: value is a reference to the object
    @Input() attributes: Attribute[] = [];
    @Input() editing = false;
    @Input() referenceUUID = '';
    @Input() referenceType = '';
    @Input() uuidType = '';
    // @Input() subType = '';

    @ViewChild(IonInfiniteScroll, { static: false })
    infiniteScroll: IonInfiniteScroll;
    @ViewChild(IonVirtualScroll, { static: false })
    virtualScroll: IonVirtualScroll;
    infinitListEvent: any;

    @ViewChild('refresherRef', { static: false }) refresherRef: Refresher;
    itemCount = 0; // total # of items in query.
    @Output() listUpdate = new EventEmitter();

    pageSize = 50; // number of items to load

    isLoggedIn = false;
    noDataMessage = '';
    isLoading = false;
    isAdmin = false;

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
        this.isLoading = false;
    }

    deleteAttribute(item) {
      if (item.Status === 'new') {
        const tmp = [];
        for (let j = 0; j <  this.attributes.length; j++) {
          if ( this.attributes[j].UUID !== item.UUID) {
            tmp.push(this.attributes[j]);
          }
        }
        this.attributes = null;
        this.attributes = [];
        this.attributes =   [...tmp];
        return;
      }

      this.attributeService.deleteAttribute(item.UUID).subscribe( (response)  => {
        const data = response as ServiceResult;
          if (data.Code !== 200) {
            this.messages.publish('api:err', data);
            return;
          }
          const tmp = [];
          for (let j = 0; j <  this.attributes.length; j++) {
            if ( this.attributes[j].UUID !== item.UUID) {
              tmp.push(this.attributes[j]);
            }
          }
          this.attributes = null;
          this.attributes = [];
          this.attributes =   [...tmp];

      }, (err) => {
      this.messages.publish('service:err', err);
      return;
      });
    }

    doRefresh(event: Refresher) {
  
    }

    listUpdated() {
    }

    loadMoreInViewPort(event) {
    }

    newAttribute() {
      const att = new Attribute();
      att.UUID = CommonFunctions.newGuid();
      att.UUIDType = 'Attribute'; // note this can change if the cbo in the list is changed
      att.Status = 'new';
      att.ReferenceType = 'account';
      att.ValueType = 'string';
      att.ReferenceUUID =  this.referenceUUID;
      att.ReferenceType = this.referenceType;
      att.AccountUUID = this.sessionService.CurrentSession.AccountUUID;
      this.attributes.push(att);
    }

    ngOnInit() {
      console.log('attributes.lists.component.ts ngOnInit attributes:' , this.attributes);
    }

    onCboChangeSubType(event: any , attribute: Attribute) {
      console.log('attributes.lists.component.ts onCboChangeSubtype event:', event);
      console.log('attributes.lists.component.ts onCboChangeSubtype attribute:', attribute);
    }
    toggleInfiniteScroll() {
      this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
    }

}
