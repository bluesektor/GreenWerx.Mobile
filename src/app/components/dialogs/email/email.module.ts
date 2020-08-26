import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { EmailDialog} from './email.dialog';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {DropdownModule} from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/primeng';


@NgModule({
  declarations: [EmailDialog],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    AutoCompleteModule,
    DropdownModule,
    CheckboxModule
  ],
  exports: [EmailDialog],
  entryComponents: [   EmailDialog ]
})
export class EmailDialogModule  {

 }
