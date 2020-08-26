import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {OrderListModule} from 'primeng/primeng';
import { IonicModule } from '@ionic/angular';
import { PreferencesEditPage } from './preferences-edit.page';
import { LocationEditPageModule} from '../location-edit/location-edit.module';
import {DropdownModule} from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/primeng';
import { PickListModule } from 'primeng/primeng';
import { AutoCompleteModule, CalendarModule,  ConfirmDialogModule, // DataTableModule,
  ConfirmationService, GrowlModule } from 'primeng/primeng';
  import {TableModule} from 'primeng/table'; // https://www.primefaces.org/primeng/#/table
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    component: PreferencesEditPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OrderListModule,
    LocationEditPageModule,
    DropdownModule,
    CheckboxModule,
    PickListModule,
    ConfirmDialogModule,
    TableModule,
  //  DataTableModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PreferencesEditPage],
  exports: [
    PreferencesEditPage, RouterModule
  ], entryComponents: [   PreferencesEditPage ]
})
export class PreferencesEditPageModule {}
