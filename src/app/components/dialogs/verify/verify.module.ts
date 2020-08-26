import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { VerifyDialog} from './verify.dialog';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {DropdownModule} from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/primeng';

const routes: Routes = [
  {
    path: '',
    component: VerifyDialog
  }
];

@NgModule({
  declarations: [VerifyDialog],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    AutoCompleteModule,
    DropdownModule,
    CheckboxModule
  ],
  exports: [VerifyDialog],
  entryComponents: [   VerifyDialog ]
})
export class VerifyDialogModule  {

 }
