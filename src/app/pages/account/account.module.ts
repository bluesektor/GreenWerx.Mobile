import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { AccountPage } from './account';
import { AccountPageRoutingModule } from './account-routing.module';
import {ChangePasswordModule} from '../password/change-password.module';
import {ProfileEditPageModule } from '../profile-edit/profile-edit.module';
import {PreferencesEditPageModule } from '../preferences-edit/preferences-edit.module';
import {PipesModule} from '../../common/pipes/pipes.module';
@NgModule({
  imports: [
    PipesModule,
    CommonModule,
    IonicModule,
    AccountPageRoutingModule,
    ChangePasswordModule,
    ProfileEditPageModule,
    PreferencesEditPageModule
  ],
  declarations: [
    AccountPage,
  ]
})
export class AccountModule { }
