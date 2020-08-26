import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
import { CommunityPage } from './community.page';

 import {CommunityPageListsComponentModule} from '../../components/lists/communitypagelists/community.page.lists.module';
import {CommunityPageRoutingModule} from './community-routing.module';
import {PostDialogModule} from '../../components/dialogs/post/post.module';
import {CommunityFilterPage} from '../community-filter/community-filter';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CommunityPageListsComponentModule,
    CommunityPageRoutingModule,
    PostDialogModule

  //  EventsFilterPage,
   // MenuPageModule,
   //  RouterModule.forChild(routes)
   // TranslateModule.forChild()
  ],
  declarations: [CommunityPage, CommunityFilterPage],
  entryComponents: [   CommunityFilterPage  ]
})
export class CommunityPageModule {}
