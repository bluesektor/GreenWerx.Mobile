import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MessagesPageListsComponent} from '../messagespagelists/messages.page.lists.component';
import { InViewportModule } from 'ng-in-viewport';
import {EmailDialogModule} from '../../dialogs/email/email.module';

@NgModule({
  declarations: [MessagesPageListsComponent],
  imports: [
    CommonModule,
    IonicModule,
    InViewportModule,
    EmailDialogModule
  ],
  exports: [MessagesPageListsComponent]
})
export class MessagesPageListsComponentModule  {

 }
