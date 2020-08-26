import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateTimeComponent} from './datetime.component';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {DropdownModule} from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/primeng';


@NgModule({
  declarations: [DateTimeComponent],
  imports: [
    CommonModule,
    FormsModule,
    AutoCompleteModule,
    DropdownModule,
    CheckboxModule
  ],
  exports: [DateTimeComponent]
})
export class DateTimeComponentModule  {

 }
