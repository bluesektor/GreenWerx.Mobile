import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EventsPageListsComponent} from './events.page.lists.component';
import { InViewportModule } from 'ng-in-viewport';
import {PipesModule} from '../../../common/pipes/pipes.module';


@NgModule({
  declarations: [EventsPageListsComponent],
  entryComponents: [EventsPageListsComponent],
  imports: [
    CommonModule,
    IonicModule,
    InViewportModule,
    PipesModule
  ],
  exports: [EventsPageListsComponent]
})
export class EventsPageListsComponentModule  {

 }
