import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfileMemberDialog} from './profilemember.dialog';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {DropdownModule} from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/primeng';


@NgModule({
  declarations: [ProfileMemberDialog],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    AutoCompleteModule,
    DropdownModule,
    CheckboxModule
  ],
  exports: [ProfileMemberDialog],
  entryComponents: [   ProfileMemberDialog ]
})
export class ProfileMemberDialogModule  {

 }
