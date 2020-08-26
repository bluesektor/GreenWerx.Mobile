import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CommunityPageListsComponent} from './community.page.lists.component';
import { InViewportModule } from 'ng-in-viewport';
import {PostDialogModule} from '../../../components/dialogs/post/post.module';
import {PipesModule} from '../../../common/pipes/pipes.module';

@NgModule({
  declarations: [CommunityPageListsComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InViewportModule,
    PostDialogModule,
    PipesModule
  ],
  exports: [CommunityPageListsComponent]
})
export class CommunityPageListsComponentModule  {

 }
