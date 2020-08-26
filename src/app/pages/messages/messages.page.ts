import { Component, OnInit, ViewChild,  ViewEncapsulation, AfterViewInit, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { AlertController, LoadingController, ModalController } from '@ionic/angular';
 
import { Filter, Screen, Event, EventGroup, EventLocation } from '../../models/index';
import { ObjectFunctions } from 'src/app/common/object.functions';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import {MessagesPageListsComponent} from '../../components/lists/messagespagelists/messages.page.lists.component';
import { ConsoleColors } from 'src/app/common/console';
import { SessionService } from '../../services/session.service';
import {FilterService} from '../../services/filter.service';
import * as _ from 'lodash';

// for emails that don't want user to see
@Component({
  selector: 'app-messages',
  templateUrl: 'messages.page.html',
  encapsulation: ViewEncapsulation.None
})
export class MessagesPage implements  AfterViewInit, OnInit {
  showSearch = false;
  viewType = 'EMAIL'; // TODO EMAIL, CHAT
  pluralType = 'EMAILS';
  segment = 'inbox';

  @ViewChild('lstItems', {static: false}) lstItems: any;
// filter: Filter = new Filter();

  itemCount = 0; // total # of items in query.
  profileListStyle = 'background-color: red;';
  queryText = '';

 // todo load posts which is attributes. see other project ( backup one).

  constructor(    public modalCtrl: ModalController,
    private filterService: FilterService,
    private componentFactoryResolver: ComponentFactoryResolver,
    public sessionService: SessionService   ) {
      const screen = new Screen();

      screen.Command = 'SearchBy';
      screen.Operator = 'CONTAINS';
      //  screen.ParserType = 'sql';
      screen.Field = 'EMAILTO';
      screen.Value = ''; // current user email filled in on server
      this.filterService.addScreen(this.viewType, screen);

      ConsoleColors.colorLog('messages.page.ts constructor', 'info');
    }


  getColor(isActivated: boolean): string {
     if (isActivated === true) {
       return '#green';
     }
     return '#8c8c8c';
   }

  listUpdated(event) {
    console.log('messages.page.ts listUpdated event:', event);
    const count = parseInt(event, 10);
    // const lblSegementText = document.getElementById('lblSegement' + this.segment + 'Text');
   // if(ObjectFunctions.isValid(lblSegementText) === true) {
    //  lblSegementText.innerHTML = this.pluralType + ' (' + this.itemCount.toString() + ')';
   // }
    switch (this.segment) {
      case 'inbox':
          const inboxText = document.getElementById('lblSegementInboxText');
          console.log('messages.page.ts listUpdated lblSegementInboxText:', inboxText);
           inboxText.innerHTML = 'Inbox (' + count.toString() + ')';
        break;
      case 'sent':
          const sentText = document.getElementById('lblSegementSentText');
          sentText.innerHTML = 'Sent (' + count.toString() + ')';
        break;
      case 'trash':
          const trashText = document.getElementById('lblSegementTrashText');
          console.log('messages.page.ts listUpdated lblSegementInboxText:', inboxText);
          trashText.innerHTML = 'Trash (' + count.toString() + ')';
      break;
    }
  }

  loadTypes(type: string, fab: HTMLIonFabElement) {
    this.itemCount = 0;
    this.filterService.resetFilter(this.viewType);
      this.viewType = type;
      let title = 'Emails';
      console.log('messages.page.ts loadTypes this.viewType:', this.viewType);
        fab.close();
        switch (  this.viewType ) {
          case 'EMAIL':
            title = 'Emails';
            this.pluralType = title;
            break;
         /* case 'ATTRIBUTE':
            title = 'Attributes';
            break;
          case 'POST':
              title = 'Posts';
              this.pluralType = title;
            break;*/
        }
        console.log('messages.page.ts loadTypes this.lstItems.updateList this.viewType:', this.viewType);
        this.updateList(true); // , this.filter, this.segment, this.viewType, this.queryText);
  }

  ngAfterViewInit(): void {
 //  console.log('messages.page.ts ngAfterViewInit update list ');
    this.updateList(true);
  }

  ngOnInit() {
    console.log('messages.page.ts ngOnInit');
  }

  // tslint:disable-next-line:member-ordering
  onSearchData = _.debounce( function() {
    this.itemCount  = 0;
    this.filterService.resetFilter(this.viewType);

    if (!this.queryText || this.queryText === '') {
        this.updateList(true);
        return;
    }
    console.log('messages.page.ts searchEvents  this.queryText:',  this.queryText);
    const screen = new Screen();
    screen.Field = 'MESSAGE';
    screen.Command = 'SearchBy';
    //  screen.ParserType = 'sql';
    screen.Operator = 'CONTAINS';
    screen.Value = this.queryText;
    this.filterService.addScreen(this.viewType, screen);
    console.log('messages.page.ts searchEvents  updateList');
     this.updateList(true);
  }, 400);

  async presentFilter() {
/*
    const modal = await this.modalCtrl.create({
      component: StoreFilterPage,
      componentProps: {
        type: this.viewType
      }
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    this.resetParameters();
    console.log('messages.page.ts presentFilter  this.viewType:', this.viewType);
    this.filter = data;
    if (this.filter === undefined) {
      this.filter = new Filter();
    }
    filter.ViewType = this.viewType;
    this.filter.TimeZone = timeZone;
    console.log('messages.page.ts presentFilter  this.eventFilter:',  this.filter);
    this.lstItems.updateList(true, this.filter, this.segment, this.viewType, this.queryText);
    */
  }



  segmentClicked() {
    console.log('messages.page.ts this.segment:', this.segment);
    this.itemCount = 0;
    this.filterService.resetFilter(this.viewType);
    console.log('messages.page.ts segmentClicked  updateList');

    const screen = new Screen();

    screen.Command = 'SearchBy';
   // screen.ParserType = 'sql';
    screen.Operator = 'CONTAINS';

  switch (this.segment) {
    case 'inbox':
        console.log('messages.page.ts segmentClicked this.segment inbox:', this.segment);
      screen.Field = 'SENDTO';
      screen.Value = this.sessionService.CurrentSession.UserUUID;
      break;
    case 'sent':
        console.log('messages.page.ts segmentClicked this.segment sent:', this.segment);
        screen.Field = 'SENDFROM';
        screen.Value =  this.sessionService.CurrentSession.UserUUID;
      break;
    case 'trash':
        console.log('messages.page.ts segmentClicked this.segment trash:', this.segment);
        const index = this.filterService.getFilterIndex(this.viewType);
        if (index >= 0) {
          this.filterService.Filters[index].IncludeDeleted = true;
        }
     screen.Field = 'DELETED';          // only return deleted records by filtering by them
     screen.Value =  'TRUE';
    break;
  }
  this.filterService.addScreen(this.viewType, screen);
    // FIlter Fields for email
    /*
    EMAILTO
    EMAILFROM
    NAMETO
    NAMEFROM
    USERUUID
    SUBJECT
    MESSAGE
*/

    this.updateList(true);
  }

  toggleList(fabButton: HTMLIonFabButtonElement, fabList: HTMLIonFabListElement) {
    fabButton.activated = !fabButton.activated;
    fabList.activated = !fabList.activated;
  }

  toggleSearch(event) {
    this.showSearch = !this.showSearch;
  }

  async updateList(resetArray: boolean) {
      console.log('messages.page.ts updateList this.viewType:', this.viewType);
      this.lstItems.updateList(resetArray,  this.segment, this.viewType, this.queryText );
  }


}
