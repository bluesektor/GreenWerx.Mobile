import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { MessagesPage } from './messages.page';

import {MessagesPageListsComponentModule} from '../../components/lists/messagespagelists/messages.page.lists.module';
import {MessagesPageRoutingModule} from './messages-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MessagesPageListsComponentModule,
    MessagesPageRoutingModule,


   //  RouterModule.forChild(routes)
   // TranslateModule.forChild()
  ],
  declarations: [MessagesPage], // , StoreFilterPage],
  entryComponents: [   ] // StoreFilterPage  ]
})
export class MessagesPageModule {}
