import { Component, OnInit, ViewChild,  ViewEncapsulation, Input, SimpleChanges, OnChanges, EventEmitter, Output } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
import { Refresher } from 'ionic-angular';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/events/event.service';
import { AccountService} from '../../../services/user/account.service';
import { ServiceResult} from '../../../models/serviceresult';
// import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Events} from '@ionic/angular';
import {LocalSettings } from '../../../services/settings/local.settings';
import { AttributesService } from '../../../services/common/attributes.service';
import {Attribute} from '../../../models/attribute';
import {ObjectFunctions} from '../../../common/object.functions';
import { Filter, Screen, Event, EventGroup, EventLocation } from '../../../models/index';
import { SessionService } from '../../../services/session.service';
import { PostService } from '../../../services/documents/post.service';
import { FavoritesService } from '../../../services/common/favorites.service';
import { Favorite} from '../../../models/favorite';
import {Node } from '../../../models/node';
import { EmailService } from '../../../services/messaging/email.service';
import { ProfileFunctions } from '../../../common/profile.functions';
import { ProfileUI } from '../../../models/UI/profile.ui';
import { UserService} from '../../../services/user/user.service';
import { IonInfiniteScroll, IonVirtualScroll } from '@ionic/angular';
import { ConsoleColors } from '../../../common/console';
import { TieredMenu } from 'primeng/primeng';
import {EmailDialog} from '../../dialogs/email/email.dialog';
import {FilterService} from '../../../services/filter.service';
import {CachedItems} from '../../../services/cached.items';
// import { EventEmitter } from 'protractor';
import * as _ from 'lodash';

@Component({
  selector: 'app-messages-lists',
  templateUrl: './messages.page.lists.component.html',
  styleUrls: ['./messages.page.lists.component.scss', '../../../../assets/styles/primeng/primeng.min.css' ]
})
export class MessagesPageListsComponent implements OnInit, OnChanges {

  constructor(
    public alertController: AlertController,
    public cache: CachedItems,
    public attributeService: AttributesService,
    public accountService: AccountService,
    public eventService: EventService,
    public userService: UserService,
    public loadingController: LoadingController,
    public sessionService: SessionService,
    public postService: PostService,
    public filterService: FilterService,
    public router: Router,
    public route: ActivatedRoute,
    public modalCtrl: ModalController,
    public messages: Events,
    private localSettings: LocalSettings,
    private favoritesService: FavoritesService,
    public emailService: EmailService
    ) {

      ConsoleColors.colorLog('messages.page.lists.component.ts constructor', 'info');
    }

  @ViewChild(IonInfiniteScroll, {static: false}) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll, {static: false}) virtualScroll: IonVirtualScroll;
  infinitListEvent: any;

 // @Input() listItems: any[] = [];
  @Input() segment = 'inbox';
  @Input() queryText = '';
  @ViewChild('refresherRef', {static: false}) refresherRef: Refresher;
  bottomSpacerAdded = false;
  itemCount = 0; // total # of items in query.
  @Output() listUpdate = new EventEmitter();

  pageSize = 50; // number of items to load

  fabIcon = 'calendar';
  viewType = 'EMAIL';
  // distance = 25;
  isLoggedIn = false;
  noDataMessage = '';
  isLoading = false;
  isAdmin = false;

  unReadCount = 0;




  toggleInfiniteScroll() {
      this.infiniteScroll.disabled = !this.infiniteScroll.disabled;
  }
    // ------------------------------------------------------------------------------------------------------------------------

  // Adds a couple black rows to the bottom so we can access the
  // edit, favorites tab ( the fab button in in the way).
  addBottomSpacer() {
    if (this.bottomSpacerAdded === true) {
      return;
    }

    if ( this.itemCount === 0 || this.itemCount > this.cache.messageItems.length) {
      console.log('messages.page.lists.component.ts addBottomSpacer return without adding');
      return;
    }
    const blankNode = new Node();
    blankNode.Name = '';
    blankNode.UUIDType = 'blank';
    this.cache.messageItems.push(blankNode);

    const blankNode2 = new Node();
    blankNode2.Name = '';
    blankNode2.UUIDType = 'blank';
    this.cache.messageItems.push(blankNode2);
    this.bottomSpacerAdded = true;
    console.log('messages.page.lists.component.ts addBottomSpacer added');
  }



  doRefresh(event: Refresher) {
    console.log('messages.page.lists.component.ts doRefresh  updateList');
    this.resetParameters();
    this.updateList(true,   this.segment, this.viewType, this.queryText);
  }


  findItemIndex(UUID: string): number {

    for (let i = 0; i < this.cache.messageItems.length; i++) {

        if (this.cache.messageItems[i].UUID === UUID) {
            return i;
        }
    }
    return -1;
}


  isScreenedFor(field: string): boolean {
    const filter = this.filterService.getFilter(this.viewType);
    field  = field.toLowerCase();
    for (let i = 0; i < filter.Screens.length; i++) {
      if (filter.Screens[i].Field.toLowerCase() === field) {
        return true;
      }
      return false;
    }
      // screen.Field = 'SENDTO';  INBOX
    // screen.Field = 'SENDFROM'; SENT
    //  DELETED
    //  const index = this.filterService.getFilterIndex(this.viewType);
  // if (index >= 0) {
  //  this.filterService.Filters[index].IncludeDeleted = true;
//   }
//  screen.Field = 'DELETED';          // only return deleted records by filtering by them
// screen.Value =  'TRUE';

  }

  async showEmailDialog(item: any, isReply: boolean) {
    let tmpSubject = '';
    let tmpComment = '';
    let  toUserUUID = item.UserUUID ;
    let fromUserUUID = item.CreatedBy;
    if (isReply === true) {
      tmpSubject = 're:' + item.Subject;
      tmpComment = '<br/><br/><hr/>' + item.Body;
      toUserUUID = item.CreatedBy;
      fromUserUUID = item.UserUUID;
    }
    const modal = await this.modalCtrl.create({
      component: EmailDialog,
      cssClass: 'email-dialog',  // must go in globals.scss
      componentProps: {        isReplyMessage: isReply,
      emailToUserUUID: toUserUUID,
      emailFromUserUUID: fromUserUUID,
      subject: tmpSubject,
      comment: tmpComment     }
    });
    await modal.present();
  }
    listUpdated() {
      this.listUpdate.emit(this.itemCount.toString());
    }


  loadMoreInViewPort(event ) {
    console.log('messages.page.lists.component.ts loadMoreInViewPort alpha '  );
    this.infinitListEvent  = event;
    const index = this.filterService.getFilterIndex(this.viewType);
    let filter = new Filter();
    if (index >= 0) {
      filter = this.filterService.Filters[index];
    }
    filter.PageSize = this.pageSize;
    filter.StartIndex = this.cache.messageItems.length;
    filter.PageResults = true;
    filter.Page++;
    filter.ViewType = this.viewType;
    if (index < 0) {
      this.filterService.addFilter(filter);
    } else {
      this.filterService.setFilter(filter);
    }

    console.log('10. messages.page.lists.component.ts loadMoreInViewPort  updateList');
    this.updateList(false, this.segment, this.viewType, this.queryText);
  }



  loadEmails( ) {

    console.log('messages.page.lists.component.ts  loadEmails this.queryText:', this.queryText);
    this.isLoading = true;
    this.noDataMessage = '';
    const filter = this.filterService.getFilter(this.viewType);
    let svc = null;
       // the search in emails is different than other searches because
          // we display emails in the list, but the user name is in the users table
          // which is what we want to search by
        if ( this.queryText.length > 0) {
            svc =  this.emailService.searchUserEmails(filter);
        } else {
          svc =  this.emailService.getEmails(filter);
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
        if (data.Code !== 200) {
          this.messages.publish('api:err', data);
          return;
        }
        console.log('messages.page.lists.component.ts loadEmails data.Result:', data.Result);
        this.unReadCount = 0;
        this.cache.messageItems = data.Result;
        for (let j = 0; j < data.Result.length; j++ ) {
          // unReadCount
          if (data.Result[j].DateOpened === null) {
            this.unReadCount++;
          }
        }
        console.log('messages.page.lists.component.ts loadEmails this.unReadCount:', this.unReadCount);

        let tabSegmentUpdate = 'tabs.messages.emails.unreadcount'; // if there are unread messages this will show the green icon in the tab.
         const isInbox = this.isScreenedFor('SENDTO');

         if (isInbox === false) {
          tabSegmentUpdate = ''; // this will reset the tab icon for new messages to hidden.
         }
         console.log('messages.page.lists.component.ts loadEmails updateTabsEvent isInbox:', isInbox);
            this.messages.publish('tabs:update', { 'value' : this.unReadCount, 'key' : tabSegmentUpdate });

        console.log('messages.page.lists.component.ts this.emailService.getAllEmails  this.cache.messageItems:', this.cache.messageItems);
        this.itemCount = data.TotalRecordCount;

        console.log('messages.page.lists.component.ts this.emailService.getAllEmails  this.itemCount:', this.itemCount);
        this.listUpdated();

        // Re-render Virtual Scroll List After Adding New Data
        if (ObjectFunctions.isValid(this.virtualScroll) === true) {
          this.virtualScroll.checkEnd();
        }


        if (this.itemCount === 0) {
          this.noDataMessage = 'No results.';
        }

         // App logic to determine if all data is loaded
        // and disable the infinite scroll
        if ( ObjectFunctions.isValid(this.infinitListEvent) && this.cache.messageItems.length >= this.itemCount ) {
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
    console.log('messages.page.lists.component.ts ngOnChanges  changes:', changes);

    if ('queryText' in changes) {
      this.searchMessages();
    }
    }

  ngOnInit() {
    this.isLoggedIn = this.sessionService.validSession();
    if (this.isLoggedIn === true ) {

     if ( this.sessionService.isUserInRole('OWNER') || this.sessionService.isUserInRole('ADMIN' )) {
      this.isAdmin = true;
     }
    }
  }

  async deleteMessage(slidingItem: HTMLIonItemSlidingElement, item: any, title: string) {
    const tmp = [];
    for (let i = 0; i < this.cache.messageItems.length; i++) {
      if (this.cache.messageItems[i].UUID !== item.UUID) {
        tmp.push(this.cache.messageItems[i]);
      }

        this.cache.messageItems.splice(i, 1);
        console.log('messages.page.lists.component.ts deleteMessage item.UUID:', item.UUID, ' index:', i);
    }

    this.emailService.deleteEmail(item.UUID).subscribe((response) => {
      if (ObjectFunctions.isValid(this.refresherRef) === true) {
        this.refresherRef.complete();
      }

      if (ObjectFunctions.isValid(this.infinitListEvent)) {
        // Hide Infinite List Loader on Complete
        this.infinitListEvent.target.complete();
      }

      this.isLoading = false;
      this.noDataMessage = '';
      const data = response as ServiceResult;
      if (data.Code !== 200) {
        this.messages.publish('api:err', data);
        return;
      }
      // remove from list
      // make sure count is update, new email count is updated
      console.log('messages.page.lists.component.ts deleteMessage tmp:', tmp);
      this.cache.messageItems = [];
       this.cache.messageItems = tmp;

      this.itemCount = this.cache.messageItems.length;
      this.listUpdated();
      // Re-render Virtual Scroll List After Adding New Data
      if (ObjectFunctions.isValid(this.virtualScroll) === true) {
        this.virtualScroll.checkEnd();
      }

      if (this.itemCount === 0) {
        this.noDataMessage = 'No results.';
      }

       // App logic to determine if all data is loaded
      // and disable the infinite scroll
      if ( ObjectFunctions.isValid(this.infinitListEvent) && this.cache.messageItems.length >= this.itemCount ) {
        this.infinitListEvent.target.disabled = true; // event.target.disabled = true;
     }

      if (slidingItem !== undefined) {        slidingItem.close();      }

    }, (err) => {
      this.isLoading = false;
      this.noDataMessage = '';
      if ( ObjectFunctions.isValid(this.refresherRef) === true) {
       this.refresherRef.complete();
      }
       this.messages.publish('service:err', err);
    });
  }



  resetParameters() {
    this.cache.messageItems  = [];
    this.itemCount = 0;
    this.filterService.resetFilter(this.viewType);

    // this is different from events and other lists in that we a looking at a filtered view (the inbox) by default.

    const screen = new Screen();
    screen.Command = 'SearchBy';
    screen.Operator = 'CONTAINS';
    //  screen.ParserType = 'sql';

    switch (this.segment) {
      case 'inbox':
          console.log('messages.page.lists.component.ts resetParameters this.segment inbox:', this.segment);
        screen.Field = 'SENDTO'; // add to filter
        screen.Value =  this.sessionService.CurrentSession.UserUUID;
        break;
      case 'sent':
          console.log('messages.page.lists.component.ts resetParameters this.segment sent:', this.segment);
          screen.Field = 'SENDFROM';
          screen.Value =  this.sessionService.CurrentSession.UserUUID;
        break;
      case 'trash':
          console.log('messages.page.lists.component.ts resetParameters this.segment trash:', this.segment);
          const index = this.filterService.getFilterIndex(this.viewType);
          if (index >= 0) {
            this.filterService.Filters[index].IncludeDeleted = true; // include deleted records
          }
       screen.Field = 'DELETED';          // only return deleted records by filtering by them
       screen.Value =  'TRUE';
      break;
    }

    this.filterService.addScreen(this.viewType, screen);
  }
  // tslint:disable-next-line:member-ordering
  searchMessages = _.debounce( function() {

    if (!this.queryText || this.queryText === '') {
      this.resetParameters();
    //  this.updateList(true);
      return;
  }
  this.resetParameters();
   console.log('messages.page.lists.component.ts searchEvents  this.queryText:',  this.queryText);
   this.filterService.resetFilter(this.viewType);
    const screen = new Screen();
    screen.Field = 'NAME';
    screen.Command = 'SearchBy';
    screen.Operator = 'CONTAINS';
    //  screen.ParserType = 'sql';
    screen.Value = this.queryText;
    this.filterService.addScreen(this.viewType, screen);
    console.log('messages.page.lists.component.ts searchEvents  updateList');
    this.updateList(true, this.segment, this.viewType, this.queryText);
  }, 400);
  async setNsfwFlag(itemUUID: string, value: string ) {
    console.log('messages.page.lists.component.ts setNsfwFlag itemUUID', itemUUID);
    if (ObjectFunctions.isNullOrWhitespace(itemUUID) === true) {
      return;
    }
    const itemIndex = this.findItemIndex(itemUUID);

    if (itemIndex < 0 || itemIndex > this.cache.messageItems.length - 1) {
      return;
    }
    console.log('messages.page.lists.component.ts setNsfwFlag value:', value);
    const tmpStatus = this.cache.messageItems[itemIndex].Status;
    this.cache.messageItems[itemIndex].Status = 'flagging';
    const svc = this.userService.flagItem( this.cache.messageItems[itemIndex].UUIDType,
                     this.cache.messageItems[itemIndex].UUID,
                     this.cache.messageItems[itemIndex].AccountUUID,
                     'NSFW', value); // to set safe for x. set the nsfw field to 0.

       await svc.subscribe(data => {
         const response = data as ServiceResult;
         this.cache.messageItems[itemIndex].Status = tmpStatus;
         if (response.Code !== 200) {
             this.messages.publish('api:err' ,  response.Message);
             return false;
         }
         console.log('messages.page.lists.component.ts setNsfwFlag response:', response);
         console.log('messages.page.lists.component.ts setNsfwFlag itemIndex:', itemIndex);
         this.cache.messageItems[itemIndex].NSFW  = response.Result.NSFW;
       }, err => {
       this.cache.messageItems[itemIndex].Status = tmpStatus;

         if (err.status === 401) {
          // this.messages.publish('user:logout');
          return;
         }
         this.messages.publish('service:err' ,  err.statusText );
     });

   }



public async updateList(resetArray: boolean, segment: string, viewType: string, queryText: string) {
    this.segment = segment;
    this.viewType = viewType;
    this.queryText = queryText; // todo could change query text by viewType i.e. eventQueryText, emailsQueryText...

    console.log('messages.page.lists.component.ts updateList');
    if (resetArray === true) {
      this.resetParameters();
      this.bottomSpacerAdded = false;
    }

      // Close any open sliding items when the listItems updates
    // if (this.listControl) {
     // this.listControl.closeSlidingItems();
   // }

    if (resetArray === true) {
      this.cache.messageItems = null;
      this.cache.messageItems = [];
      this.bottomSpacerAdded = false;
    }
    console.log('messages.page.lists.component.ts updateList this.viewType:', this.viewType);
    this.isLoading = true;
    this.noDataMessage = '';

   // if (this.segment === 'favorites') {
    //  await this.loadFavorites();
    //  return;
    // }

    switch ( this.viewType) {
      case 'EMAIL':
          await this.loadEmails();

      break;
      default:
      //      this.loadPosts(null);
      break;
    }
  }

  async viewMessage(item: any) { // goToItemDetail(
    if (item.UUID === '' || item.UUID === undefined) {
      return;
    }
    console.log('messages.page.lists.component.ts viewMessage item:', item);

      const alert = await this.alertController.create({
        header: item.NameFrom,
        subHeader: item.Subject,
        message: item.Comment,
      //  buttons: ['OK']
      buttons: [
        {
          text: 'Reply',
          handler: () => {
            this.showEmailDialog(item, true);
          }
        }, { text: 'OK', handler: () => { } } ]
      });

      await alert.present();

      if (item.DateRead !== null && item.DateRead !== undefined) {
        return;
      }
      this.emailService.openedEmail(item.UUID).subscribe((response) => {
          console.log('messages.page.lists.component.ts openedEmail response:', response);
          for (let i = 0; i < this.cache.messageItems.length; i++) {
              if (this.cache.messageItems[i].UUID !== item.UUID) {continue; }
              this.cache.messageItems[i].DateRead = new Date();
          }
      }, (err) => {
        console.log('messages.page.lists.component.ts openedEmail err:', err);
      });
    // this.router.navigateByUrl(`tabs/details/${item.UUIDType}/${item.UUID}`); //
  }
}



