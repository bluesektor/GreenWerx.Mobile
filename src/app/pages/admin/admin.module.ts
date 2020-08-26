import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { AdminPage } from './admin';
import { AdminPageRoutingModule } from './admin-routing.module';
import {ChangePasswordModule} from '../password/change-password.module';
import {TreeTableModule} from 'primeng/treetable';

// ADMIN import {LogsPageListsComponentModule} from '../../components/lists/logspagelists/logs.page.lists.module';
// import {StageDataModalModule} from '../admin/stagedata-modal/stagedata-modal.module';


@NgModule({
  imports: [
 //   StageDataModalModule,
    FormsModule,
    CommonModule,
    IonicModule,
    AdminPageRoutingModule,
    ChangePasswordModule,
    TreeTableModule,
    // LogsPageListsComponentModule // ADMIN
  ],
  declarations: [
    AdminPage,
  ]
})
export class AdminModule { }
