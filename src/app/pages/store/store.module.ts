import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
//import { DragDropModule } from '@angular/cdk/drag-drop';
import { IonicModule } from '@ionic/angular';
import { StorePage } from './store.page';
import { InViewportModule } from 'ng-in-viewport';
import { StoreFilterPage } from '../store-filter/store-filter';
import {ProductFilterPage} from '../product-filter/product-filter';
import {StorePageListsComponentModule} from '../../components/lists/storepagelists/store.page.lists.module';
 // ---=== Admin ===---
 // import {EventModalModule} from '../admin/event-modal/event-modal.module';  // '..//event-modal/event-modal.module';
 // import {AccountModalModule} from '../admin/account-modal/account-modal.module';

 const routes: Routes = [  {    path: '',    component: StorePage  }];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScrollingModule,
    //DragDropModule,
    InViewportModule,
    StorePageListsComponentModule,
  //  EventModalModule, //  ADMN
  //  AccountModalModule, //  ADMN
  //  EventsFilterPage,
   // MenuPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StorePage, StoreFilterPage,ProductFilterPage],
  entryComponents: [    StoreFilterPage,ProductFilterPage  ]
})
export class StorePageModule {}
