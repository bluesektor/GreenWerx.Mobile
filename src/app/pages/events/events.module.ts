import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
//import { DragDropModule } from '@angular/cdk/drag-drop';
import { IonicModule } from '@ionic/angular';
import { EventsPage } from './events.page';
import { InViewportModule } from 'ng-in-viewport';
import { EventsFilterPage } from '../events-filter/events-filter';
import {EventsPageListsComponentModule} from '../../components/lists/eventspagelists/events.page.lists.module';
 // ---=== Admin ===---
 // import {EventModalModule} from '../admin/event-modal/event-modal.module';  // '..//event-modal/event-modal.module';
 // import {AccountModalModule} from '../admin/account-modal/account-modal.module';

 const routes: Routes = [  {    path: '',    component: EventsPage  }];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScrollingModule,
    //DragDropModule,
    InViewportModule,
    EventsPageListsComponentModule,
  //  EventModalModule, //  ADMN
  //  AccountModalModule, //  ADMN
  //  EventsFilterPage,
   // MenuPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EventsPage, EventsFilterPage],
  entryComponents: [    EventsFilterPage  ]
})
export class EventsPageModule {}
