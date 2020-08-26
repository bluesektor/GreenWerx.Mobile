import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AttributesListsComponent} from './attributes.lists.component';
import { InViewportModule } from 'ng-in-viewport';
import {DropdownModule} from 'primeng/dropdown';

@NgModule({
  declarations: [AttributesListsComponent],
  imports: [
    DropdownModule,
    CommonModule,
    FormsModule,
    IonicModule,
    InViewportModule
  ],
  exports: [AttributesListsComponent]
})
export class AttributesListsModule  {

 }
