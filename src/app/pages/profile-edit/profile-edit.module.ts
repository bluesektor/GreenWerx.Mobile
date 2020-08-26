import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {OrderListModule} from 'primeng/primeng';
import { IonicModule } from '@ionic/angular';
import { ProfileEditPage } from './profile-edit.page';
import { LocationEditPageModule} from '../location-edit/location-edit.module';
import {DropdownModule} from 'primeng/dropdown';
import {ProfileMemberDialogModule} from '../../components/dialogs/profilemember/profilemember.module';
import { RouterModule, Routes } from '@angular/router';
import {AutosizeModule} from 'ngx-autosize';
import {PipesModule} from '../../common/pipes/pipes.module';

const routes: Routes = [
  {
    path: '',
    component: ProfileEditPage
  }
];

@NgModule({
  imports: [
    PipesModule,
    AutosizeModule,
    CommonModule,
    FormsModule,
    IonicModule,
    OrderListModule,
    LocationEditPageModule,
    DropdownModule,
    ProfileMemberDialogModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ProfileEditPage],
  exports: [
    ProfileEditPage, RouterModule
  ], entryComponents: [   ProfileEditPage ]
})
export class ProfileEditPageModule {}
