import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { StorePageListsComponent} from './store.page.lists.component';
import { InViewportModule } from 'ng-in-viewport';
import {PipesModule} from '../../../common/pipes/pipes.module';


@NgModule({
  declarations: [StorePageListsComponent],
  entryComponents: [StorePageListsComponent],
  imports: [
    CommonModule,
    IonicModule,
    InViewportModule,
    PipesModule
  ],
  exports: [StorePageListsComponent]
})
export class StorePageListsComponentModule  {

 }
