import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PostDialog} from './post.dialog';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {DropdownModule} from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/primeng';
import {EditorModule} from 'primeng/editor';
import {DateTimeComponentModule} from '../../datetime/datetime.module';
import {AttributesListsModule} from '../../../components/lists/attributes.lists/attributes.lists.module';

@NgModule({
  declarations: [PostDialog],
  imports: [
    AttributesListsModule,
    CommonModule,
    IonicModule,
    FormsModule,
    AutoCompleteModule,
    DropdownModule,
    CheckboxModule,
    EditorModule,
    DateTimeComponentModule
  ],
  exports: [PostDialog],
  entryComponents: [   PostDialog ]
})
export class PostDialogModule  {

 }
