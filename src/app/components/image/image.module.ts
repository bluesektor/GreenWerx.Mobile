import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ImageWithLoadingComponent} from './image.loading.component';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  declarations: [ImageWithLoadingComponent],
  imports: [
    IonicModule,
    CommonModule

  ],
  exports: [ImageWithLoadingComponent]
})
export class ImageWithLoadingModule  {

 }
